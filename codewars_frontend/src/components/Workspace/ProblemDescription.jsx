import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoCaretBackOutline ,IoCaretForwardOutline} from "react-icons/io5";
import { setSelectedProblem } from '../../store/slices/SelectedProblem';

const ProblemDescription = () => {
  const problems=useSelector(state=>state.problems);
  const selectedProblem=useSelector(state=>state.selectedProblem)
  const timerStarted=useSelector(state=>state.timerStarted)
  const dispatch=useDispatch();
  const handleBackClick=(e)=>{
    e.preventDefault();
    if(selectedProblem!==0)
    {
      dispatch(setSelectedProblem(selectedProblem-1));
    }
  }
  const handleForwardClick=(e)=>{
    e.preventDefault();
    if(selectedProblem!==(problems.length-1))
    {
      dispatch(setSelectedProblem(selectedProblem+1));
    }
  }
  return (
    <div className='w-[30%] bg-slate-800 flex flex-col  min-h-[89.5vh] text-white border-r-2 border-white'>
        <div className="bg-black h-[40px] flex items-end justify-between">
          <div className='text-white bg-slate-800 ml-2 py-1 px-2 rounded-md mb-1'>Introduction</div>
          {true && (<div className='text-white bg-slate-800 mr-4 py-1 px-1 rounded-md flex items-center justify-between w-[11vh] mb-1'>
            <button onClick={handleBackClick}><IoCaretBackOutline size='25px'/></button>
           <div className="font-semibold text-md">{selectedProblem+1}</div>
           <button onClick={handleForwardClick}><IoCaretForwardOutline size='25px'/></button>
          </div>)}
        </div>
        {timerStarted ? (<div className="font-2xl p-3">
        <span className='text-xl font-semibold'>Welcome 🎉 to CodeWars!</span><br/><br/>
        Let's get you set up and ready to compete.<br/>
        Follow these instructions to begin your coding journey.<br/><br/>
        <span className='text-xl font-semibold'>Invite Friends  🤝</span><br/><br/>
        Bring your friends along for the ride! <br/>
        Click the  🔗  on the top right corner to easily share the contest link and invite them to join the competition.<br/><br/>
        <span className='text-xl font-semibold'>Problems  🤔</span><br/><br/>
        Solve the challenge and come out on top! <br/>
        The first one to solve all the problems wins the contest.<br/><br/>
        <span className='text-xl font-semibold'>Editor  📝</span><br/><br/>
        Write your code, test it and submit it to win! <br/>
        Use the editor to write your solution and click the 'Run' 🏃‍♂️ to test it. <br/>
        Once you're confident in your solution, click the 'Submit' 💯 to solve the problem and compete for the victory<br/><br/>
        </div>):(
          <div className="h-[84vh] overflow-y-auto">
          <div className="p-3 flex flex-col justify-start gap-2">
            <div className="text-2xl font-semibold">{selectedProblem+1}. {problems[selectedProblem].title}</div>
            {
              problems[selectedProblem].description.map((item,index)=>(
                <div className="ml-2 text-md" key={index}>{item}</div>
              ))
            }
            <div/>
            <div className="ml-2 text-xl font-semibold">Input</div>
            <div className="ml-2 text-normal">
            {problems[selectedProblem].input.split('.').map((sentence, index) => (<p key={index}>{sentence.trim() + '.'}</p> ))}
            </div>
            <div/>
            <div className="ml-2 text-xl font-semibold">Output</div>
            <div className="ml-2 text-normal">{problems[selectedProblem].output}.</div>  
            <div/>
            <div className="ml-2 text-xl font-semibold">Constraints</div>
            {
              problems[selectedProblem].constraints.map((item,index)=>(
                <li className='ml-2' key={index}>{item}</li>
              ))
            }
            <div/>
            <div className="ml-2 text-xl font-semibold">Input</div>
            <textarea className=' bg-slate-700 cursor-pointer h-[180px] px-3 py-1 rounded-xl outline-none' readOnly={true} value={atob(problems[selectedProblem].inputTestCases)}/>
            <div/>
            <div className="ml-2 text-xl font-semibold">Expected Output</div>
            <textarea className=' bg-slate-700 cursor-pointer h-[100px] px-3 py-1 rounded-xl outline-none' readOnly={true} value={atob(problems[selectedProblem].expectedOutput)}/>
            <div/>
          </div>
          </div>
        )}
       
    </div>
  )
}

export default ProblemDescription