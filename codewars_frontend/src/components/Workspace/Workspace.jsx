import React, {  useEffect, useState } from 'react'
import Navbar from '../Navbars/Navbar'
import ProblemDescription from './ProblemDescription'
import CodeEditor from './CodeEditor'
import Chat from './Chat'
import { useParams } from 'react-router-dom'
import {io} from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setRoom } from '../../store/slices/RoomSlice'
import { setProblems } from '../../store/slices/ProblemsSlice'
import Signup from '../auth/Signup'
import { setSignUpClick } from '../../store/slices/SignupClickedSlice'
import { ImCross } from 'react-icons/im'
import { ToastContainer, toast } from 'react-toastify'

const Workspace = () => {
  const {id}=useParams();
  const serverUrl=import.meta.env.VITE_SERVER_URL;
  const user=useSelector(state=>state.auth);
  const socket =io(serverUrl,{
      transports: ['websocket','polling'],
  });  
  const dispatch=useDispatch();
  const [loaded,setLoaded]=useState(false);
  const [roomFound,setRoomFound]=useState(false);
  const handleCopyClick=()=>{
    navigator.clipboard.writeText(window.location.href)
  }
  useEffect(() => {
    const fetchRoom=async()=>{
      const room=await axios.get(serverUrl+`/get-room?roomId=`+id).then((res)=>res.data).catch((err)=>{console.log(err)});
      console.log(room);
      const problems=await axios.post(serverUrl+'/get-problems',{id:room.problems,category:room.category}).then((res)=>res.data).catch((err)=>{console.log(err)});
      console.log(problems);
      if(room.category){
      dispatch(setProblems(problems));
      dispatch(setRoom({roomId:room.roomId,category:room.category}));
      socket.emit('join-room',({ id: id, userName: user.displayName ,userid:user.userid}));
      setRoomFound(true);
      }
      else {
        setRoomFound(false);
        toast.error("No room found",{position:'bottom-center',theme:"colored",autoClose:3000})
      }
      setLoaded(true);
    }
    fetchRoom();

  return ()=>{
    socket.disconnect();
    for(let i in [0,1]) localStorage.removeItem(`code-${i}`);
  }
  }, [socket]);
  return (
    <>
     <Navbar/>
     {user.displayName && roomFound && loaded && (
      <div className="flex min-w-screen">
      <ProblemDescription socket={socket}/>
      <CodeEditor socket={socket}/>
      <Chat socket={socket}/>
      </div>
     )}
     {!user.displayName && roomFound && loaded && (
      <div className="bg-slate-800 h-[89.5vh] flex flex-col gap-4 items-center justify-center" onClick={()=>dispatch(setSignUpClick(true))}>
        <div className=' text-white text-6xl bg-blue-700 px-4 rounded-2xl flex items-center justify-center py-5 cursor-pointer' >Login Please ...</div>
      </div>
     )}
     { user.displayName && !roomFound && loaded &&  (
      <div className="bg-slate-800 h-[89.5vh] flex flex-col gap-6 items-center justify-center">
        <div className="text-white text-6xl font-semibold font-serif"> No room found 🤔</div>
        <div className="text-white text-2xl font-semibold"> Check and try again 🙏🏻 </div>
      </div>
     )}
     {!loaded &&(
      <div className="bg-slate-800 h-[89.5vh] flex flex-col gap-6 items-center justify-center">
      <div className="text-white text-6xl font-semibold font-serif"> Loading ....</div>
      </div>
     )}
     <ToastContainer/>
     <Signup/>
    </>
  )
}

export default Workspace