import React, { useEffect, useState } from 'react'
import { IoLinkSharp } from "react-icons/io5";
import { IoIosLogOut} from "react-icons/io";
import { useSelector } from 'react-redux';
import { IoSend } from "react-icons/io5";
const Chat = ({socket}) => {
  const user=useSelector(state=>state.auth.displayName);
  const userId=useSelector(state=>state.auth.userid);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const colors=[`gray-500`,`blue-600`];
  useEffect(() => {
    socket.on('chat-message', message => {
      setMessages(prevMessages => [...prevMessages, message]);
    });
    socket.on('active-users',(users)=>{
      setActiveUsers(users);
      console.log(activeUsers);
    })
    return () => {
      socket.off('chat-message');
      sendMessage([])
      socket.off('active-users')
    };
  }, [socket]);
  
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
  }
  const handleKeyDown=(e) => {
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault();  
      sendMessage();
   }}
  return (
    <div className='w-[30%] border-2 border-black flex flex-col' >
        <div className="h-[39px] bg-black flex items-center justify-between px-3 py-2">
         <div className="text-md text-white">Name</div>
         <div className="flex gap-5 text-white text-md mr-2 items-center justify-between">
           <IoLinkSharp size='30px' onClick={handleCopy} className='cursor-pointer'/>
           <IoIosLogOut size='30px' onClick={leaveRoom} className='cursor-pointer'/>
         </div>
        </div>
        <div className="bg-slate-800 h-fit min-h-[80px] flex flex-col p-2 gap-1 ">
          <div className="text-white text-sm font-semibold">{activeUsers.length} users </div>
          <div className="grid grid-flow-col justify-start gap-2 overflow-x-auto">
          {activeUsers.map((user, index) => (
          <div key={index} className={`w-10 rounded-full flex items-center justify-center bg-${colors[index%2]} text-white text-lg p-1`}>
            {user.userName.charAt(0)}
          </div>
        ))}
          </div>
          <button className='bg-blue-600 text-white mt-2  py-1 rounded-xl hover:shadow-md hover:shadow-blue-400 mb-1'>Are you Ready!!!</button>
        </div>
        {/*Chat Section*/}
        <div className="bg-slate-900 flex-1">
        {messages.map((msg, index) => (
        <div key={index} className={`${msg.userId ==1 ? `flex justify-center `:(msg.userId==userId?`flex justify-end ` : `flex justify-start `)} mt-2 px-1`}>
            <div className={`${msg.userId === 1? 'rounded-xl text-sm': 'rounded-lg text-md'} text-white bg-slate-800 px-2 font-normal text-md w-fit h-fit`}>
            {msg.text}
          </div>
        </div>
       ))}

        </div>
        <div className="bg-slate-800 text-black text-sm fixed bottom-1 flex w-full items-center h-[40px]">
            <textarea type="text" value={messageInput} onChange={e => setMessageInput(e.target.value)} className='w-[27%] h-full focus:outline-none p-1 capitalize rounded-md' placeholder='Type your message here' onKeyDown={handleKeyDown}/>
            <button className='text-white px-1 w-[3%] flex items-center justify-center focus:outline-none rounded-md' onClick={sendMessage}><IoSend size='25px'/></button>
          </div>
    </div>
  )
}

export default Chat