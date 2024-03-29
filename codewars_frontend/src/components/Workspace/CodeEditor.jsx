import React, {useEffect, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import axios from "axios";
import { useSelector } from 'react-redux';
import { toast} from 'react-toastify';

const CodeEditor = ({socket}) => {
    const user=useSelector(state=>state.auth);
    const [code,setCode]=useState('')
    const id=1
    const [selectedLanguage, setSelectedLanguage] = useState('cpp');
    const [showIP,setShowIP]=useState(true);
    const language_code=(selectedLanguage==='cpp'?54:(selectedLanguage==='javascript'?63:26));
    const problems=useSelector(state=>state.problems);
    const selectedProblem=useSelector(state=>state.selectedProblem);
    const [input,setInput]=useState();
    const [output,setOutput]=useState();
    const [statusId,setStatusId]=useState(0);
    const serverUrl=import.meta.env.VITE_SERVER_URL
    const timerStarted=useSelector(state=>state.timerStarted)
    const emoji=['😀', '😎', '😍', '🚀', '🌟', '🎉','👍']
    let [solvedProblems,setSolvedProblems]=useState(new Set())
    const handleLanguageSelection = (event) => {
      setSelectedLanguage(event.target.value);
      setInput('');
      setCode('');
      setOutput('');
    }
    const handleCodeSubmit=async()=>{
      if(timerStarted===0)
      {
        toast.info("Wait for contest to begin",{position:'bottom-center',theme:"colored",autoClose:3000})
        return;
      }
      if(timerStarted===2){
        toast.info("Contest ended. You can run now to just try.",{position:'bottom-center',theme:"colored",autoClose:3000})
        return;
      }
      console.log(solvedProblems);
      if(solvedProblems.has(selectedProblem)) { alert("Already done"); return;}
      setOutput('')
      const options = {
       method: 'POST',
       url: 'https://judge0-ce.p.rapidapi.com/submissions',
       params: { base64_encoded: "true", fields: "*" },
       headers: {
         'content-type': 'application/json',
         'Content-Type': 'application/json',
         'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
         'X-RapidAPI-Host': import.meta.env.VITE_RAPID_API_HOST,
       },
       data:{
         language_id:language_code,
         source_code:btoa(code),
         stdin:problems[selectedProblem].inputTestCases,
         expected_output:problems[selectedProblem].expectedOutput
       }
     };
     try {
       console.log(options)
       const response = await axios.request(options);
       const token=response.data.token;
       getOutput(token).then(()=>{
        const message={
             userId:1,
             text:`${user.displayName} solved problem ${selectedProblem+1} ${emoji[Math.floor(Math.random()*emoji.length)]}`,
             timestamp: new Date().toISOString(),
        }
         socket.emit('send-chat-message',message)
         setSolvedProblems(new Set(solvedProblems.add(selectedProblem)));
         console.log(solvedProblems);
         const response=axios.post(serverUrl+'/add-score',{userId:user.userid,selectedProblem:selectedProblem})
       })
     }catch(err) {
       console.log(err);
     }
    }
    const handleCodeRun=async()=>{
      if(!timerStarted===0)
      {
        toast.info("Wait for contest to begin",{position:'bottom-center',theme:"colored",autoClose:3000})
        return;
      }
      setOutput('')
     const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
        'X-RapidAPI-Host': import.meta.env.VITE_RAPID_API_HOST,
      },
      data:{
        language_id:language_code,
        source_code:btoa(code),
        stdin:btoa(input),
      }
    };
    try {
      console.log(options)
      const response = await axios.request(options);
      const token=response.data.token;
      getOutput(token);
    }catch(err) {
      console.log(err);
    }
  }

  const getOutput = (token) => {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/' + token,
        params: { base64_encoded: 'true', fields: '*' },
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
          'X-RapidAPI-Host': import.meta.env.VITE_RAPID_API_HOST,
        },
      };
  
      const processResponse = async () => {
        try {
          const response = await axios.request(options);
          const statusId = response.data.status?.id;
  
          if (statusId === 1 || statusId === 2) {
            // Processing, so run the function again after 2 seconds
            setTimeout(() => {
              processResponse();
            }, 2000);
          } else {
            console.log(response.data);
            if (response.data.status.id === 3) {
              setOutput(atob(response.data.stdout));
              setStatusId(1);
              resolve();
            } else {
              setOutput(response.data.status.description);
              reject("Incorrect");
            }
          }
        } catch (error) {
          console.log(error);
          reject(error);
        }
      };
      processResponse();
    });
  };

const handleCodeChange=(e)=>{
    setCode(e);
    if(timerStarted===1)
    localStorage.setItem(`code-${selectedProblem}`,e);
}
useEffect(()=>{
  if(timerStarted===1){
  setInput(atob(problems[selectedProblem].inputTestCases))
  if(localStorage.getItem(`code-${selectedProblem}`))
  setCode(localStorage.getItem(`code-${selectedProblem}`))
}
},[selectedProblem,timerStarted,selectedLanguage])

  return (
    <div className='w-[40%] bg-slate-800 flex flex-col h-fit min-h-[89.5vh] border-r-2'>
        <div className="bg-black h-[40px] flex items-center px-4 justify-between ">
            <div className="text-white bg-slate-800 p-1 rounded-xl text-sm px-2">{user?.displayName}</div>
            <select className="p-1 rounded-lg text-sm bg-slate-800 text-white outline-none" value={selectedLanguage} onChange={handleLanguageSelection}>
                <option value="cpp">C++</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
            </select>
        </div>
        <CodeMirror value={code} theme={vscodeDark} style={{fontSize:'16px'}} maxHeight={(showIP?'390px':'550px')} placeholder={'Write your code here'}
        extensions={[(selectedLanguage==='javascript'?javascript():(selectedLanguage==='cpp'?cpp():java()))]}
        onChange={handleCodeChange} />
        { showIP &&(
          <div className="w-[40%] absolute bottom-[52px] [h-[150px] flex gap-2 p-2 bg-slate-800 border-t-gray-700 border-t-2 transition-all delay-100">
            <div className="flex flex-col w-[50%] justify-center gap-2">
              <div className="text-white ">Input</div>
              <textarea className=" bg-slate-600 text-white h-[120px] cursor-text outline-none rounded-lg p-1" value={input} onChange={(e)=>setInput(e.target.value)}>{input}</textarea>
            </div>
            <div className="flex flex-col w-[50%] justify-center gap-2">
              <div className="text-white">Output</div>
              <textarea className=" bg-slate-600 text-white h-[120px] cursor-text outline-none rounded-lg p-1" readOnly={true} value={output}/>
            </div>
          </div>
        )}
        <div className=" bg-slate-800 w-[40%]  absolute bottom-1 text-black flex justify-between p-2 gap-3 border-t-2 border-gray-700">
          <div className="text-white bg-gray-600 p-1 rounded-xl px-2 cursor-pointer font-normal" onClick={()=>setShowIP(!showIP)}>Console {(showIP===true?' 👇🏻':' 👆🏻')}</div>
          <div className="flex gap-4 items-center mr-3">
          <div className="text-white bg-gray-600 px-2 py-1 rounded-xl w-[60px] flex justify-center cursor-pointer" onClick={handleCodeRun}>Run</div>
          <div className="text-white bg-green-700 py-1 w-[80px]flex justify-center px-2 rounded-xl cursor-pointer" onClick={handleCodeSubmit}>Submit</div>
          </div>
        </div>
    </div> 
  )
}

export default CodeEditor