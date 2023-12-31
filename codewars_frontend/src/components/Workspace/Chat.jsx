import React, { useEffect, useState } from 'react'
import { IoLinkSharp } from "react-icons/io5";
import { IoIosLogOut} from "react-icons/io";
import { useSelector } from 'react-redux';
import { IoSend } from "react-icons/io5";
const Chat = ({socket}) => {
  const user=useSelector(state=>state.auth.user.displayName);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    socket.on('chat-message', message => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      socket.off('chat-message');
    };
  }, [socket]);

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      const message = {
        userId:user,
        text: messageInput.trim(),
        timestamp: new Date().toISOString(),
      };
      socket.emit('send-chat-message', message);
      setMessages(prevMessages => [...prevMessages, message]);
      setMessageInput('');
    }
  };
  return (
    <div className='w-[30%] border-2 border-black flex flex-col' >
        <div className="h-[39px] bg-black flex items-center justify-between px-3 py-2">
         <div className="text-md text-white">Name</div>
         <div className="flex gap-5 text-white text-md mr-2 items-center justify-between">
           <IoLinkSharp size='30px'/>
           <IoIosLogOut size='30px'/>
         </div>
        </div>
        <div className="bg-slate-800 h-fit min-h-[80px] flex flex-col p-2 gap-1 ">
          <div className="text-white text-sm font-semibold">2 users</div>
          <div className="grid grid-flow-row cols-3">
          <div className="w-10 rounded-full flex items-center justify-center bg-gray-500 text-white font-lg text-lg p-1">{user?.charAt(0)}</div>
          </div>
          <button className='bg-blue-600 text-white mt-2  py-1 rounded-xl hover:shadow-md hover:shadow-blue-400 mb-1'>Are you Ready!!!</button>
        </div>
        {/*Chat Section*/}
        <div className="bg-gray-100 flex-1">
        {messages.map((msg, index) => (
        <div key={index} className={`${msg.userId ==user ? `flex justify-end ` : `flex justify-start `} mt-1`}>
      <div className={`${msg.userId === user? 'bg-blue-500 text-black rounded-tl-none': 'bg-gray-100 text-black rounded-tr-none '} rounded-xl px-1 text-xl w-fit h-fit`}>
        {messages.text}
      </div>
    </div>))}

        </div>
        <div className="bg-slate-800 text-black fixed bottom-1 flex w-full items-center h-[50px]">
            <textarea type="text" value={messageInput} onChange={e => setMessageInput(e.target.value)} className='w-[27%] h-full focus:outline-none focus:p-1' placeholder='Type your message here'/>
            <button className='text-white px-1 w-[3%] flex items-center justify-center' onClick={sendMessage}><IoSend size='25px'/></button>
          </div>
    </div>
  )
}

export default Chat