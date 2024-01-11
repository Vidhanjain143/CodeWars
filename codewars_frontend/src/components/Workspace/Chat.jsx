import React, { useEffect, useState } from 'react'
import { IoLinkSharp } from "react-icons/io5";
import { IoIosLogOut} from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { IoSend } from "react-icons/io5";
import { setTimerStarted } from '../../store/slices/TimerStartedSlice';
import { toast} from 'react-toastify';
const Chat = ({socket}) => {
  const userId=useSelector(state=>state.auth.userid);
  const id=useSelector(state=>state.room.roomId);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const category =useSelector(state=>state.room.category);
  const [minutes,setMinutes]=useState(0);
  const [seconds,setSeconds]=useState(0);
  const colors=[`gray-500`,`blue-600`];
  const dispatch=useDispatch();
  useEffect(() => {
    socket.on('chat-message', message => {
      setMessages(prevMessages => [...prevMessages, message]);
    });
    socket.on('active-users',(users)=>{
      setActiveUsers(users);
    })
    socket.on('timer',({timer,timerStarted})=>{
      console.log(timer,timerStarted);
      if(timerStarted){
      dispatch(setTimerStarted(timerStarted));
      if(timerStarted) startTimer(timer);
    }
    })
    return () => {
      socket.off('chat-message');
      sendMessage([])
      socket.off('active-users')
      socket.off('timer');
    };
  }, [socket]);
  useEffect(()=>{
        console.log(category);
        if(category==='easy') setMinutes(20);
        else if(category==='medium') setMinutes(30);
        else setMinutes(40);
  },[category])
  const startTimer=(timer)=>{
     
     const interval=setInterval(()=>{
         setMinutes(Math.floor(timer/60));
         setSeconds(timer%60);
         timer--;
         if(timer<0) {
          clearInterval(interval);
          //socket.emit('send-chat-message',{ userId:1,text:'Contest ended',timestamp: new Date().toISOString()})
          dispatch(setTimerStarted(2));
         }
     },1000)
  }
  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      const message = {
        userId:userId,
        text: messageInput.trim(),
        timestamp: new Date().toISOString(),
      };
      socket.emit('send-chat-message', message);
      setMessageInput('');
    }
  };
  const leaveRoom=()=>{
      socket.disconnect();
  }
  const handleCopy=()=>{
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link Copied",{position:'bottom-right',theme:"colored",autoClose:4000})
    
  }
  const handleKeyDown=(e) => {
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault();  
      sendMessage();
   }}

   const handleUserReady=(e)=>{
    e.preventDefault();
    console.log(category);
    if(activeUsers.length<2)
    {
      toast.info("Wait for one more user to join.Click again ",{position:'bottom-right',theme:"dark",autoClose:4000})
      return;
    }
    socket.emit('user-ready',{userId:userId,roomId:id,category:category});
   
   }
  return (
    <div className='w-[30%] border-2 border-black flex flex-col' >
        <div className="h-[39px] bg-black flex items-center justify-between px-3 py-2">
         <div className="text-md text-white">Room 1</div>
         <div className="flex gap-5 text-white text-md mr-2 items-center justify-between">
          <div className="text-white">{(minutes<10?"0"+minutes:minutes)}:{(seconds<10?"0"+seconds:seconds)}</div>
           <IoLinkSharp size='30px' onClick={handleCopy} className='cursor-pointer'/>
           <IoIosLogOut size='30px' onClick={leaveRoom} className='cursor-pointer'/>
         </div>
        </div>
        <div className="bg-slate-800 h-fit min-h-[80px] flex flex-col p-2 gap-1 ">
          <div className="text-white text-sm font-semibold">{activeUsers.length} users </div>
          <div className="grid grid-flow-col justify-start gap-2 overflow-x-auto">
          {activeUsers.map((user, index) => (
          <div key={index} className={`w-10 rounded-full flex items-center justify-center bg-${colors[index%2]} text-white text-lg p-1`}>
            {user?.userName?.charAt(0)}
          </div>
        ))}
          </div>
          <button className='bg-blue-600 text-white mt-2  py-1 rounded-xl hover:shadow-md hover:shadow-blue-400 mb-1' onClickCapture={handleUserReady}>Are you Ready!!!</button>
        </div>
        {/*Chat Section*/}
        <div className="bg-slate-900 flex-1">
          <div className="overflow-y-auto h-[60vh]">
        {messages.map((msg, index) => (
        <div key={index} className={`${msg.userId ==1 ? `flex justify-center `:(msg.userId==userId?`flex justify-end ` : `flex justify-start `)} mt-2 px-1`}>
            <div className={`${msg.userId === 1? 'rounded-xl text-sm': 'rounded-lg text-md'} text-white bg-slate-800 px-2 font-normal text-md w-fit h-fit`}>
            {msg.text}
          </div>
        </div>
       ))}
       </div>
        </div>
        <div className="bg-slate-800 text-black text-sm fixed bottom-1 flex w-full items-center h-[40px]">
            <textarea type="text" value={messageInput} onChange={e => setMessageInput(e.target.value)} className='w-[27%] h-full focus:outline-none p-1 capitalize rounded-md' placeholder='Type your message here' onKeyDown={handleKeyDown}/>
            <button className='text-white px-1 w-[3%] flex items-center justify-center focus:outline-none rounded-md' onClick={sendMessage}><IoSend size='25px'/></button>
          </div>
    </div>
  )
}

export default Chat


{/* <div className={`fixed flex h-[20vh] bg-slate-900 w-[50vw] top-[30%] left-[25%] flex-col gap-4 px-3 py-3 border-green-200 rounded-xl border-1 outline-none z-10 ` +(firstClick?`hidden`:``)}>
      <div className="flex items-center justify-between">
        <div className="text-white text-2xl">Invite your friends to the contest</div>
        <div className="text-white mr-2 cursor-pointer" onClick={() => setFirstClick(true)}><ImCross /></div>
      </div>
      <div className="flex w-[100%] items-center justify-between gap-2">
        <div className="bg-gray-300 w-[90%] rounded-lg p-2 font-semibold">{window.location.href}</div>
        <div className="text-white rounded-xl p-2 w-[10%] bg-blue-500 cursor-pointer flex items-center justify-center font-medium" onClick={handleCopyClick}>Copy</div>
      </div>
    </div>
*/}