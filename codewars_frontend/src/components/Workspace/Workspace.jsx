import React, { useEffect } from 'react'
import Navbar from '../Navbars/Navbar'
import ProblemDescription from './ProblemDescription'
import CodeEditor from './CodeEditor'
import Chat from './Chat'
import { useParams } from 'react-router-dom'
import {io} from 'socket.io-client'
import { useSelector } from 'react-redux'
const Workspace = () => {
  const {id}=useParams();
  const serverUrl=import.meta.env.VITE_PUBLIC_SERVER_URL;
  const user=useSelector(state=>state.auth.user);
  const socket=io(serverUrl)
  useEffect(()=>{
     socket.emit('join-room',id)
  },[])
  return (
    <>
     <Navbar/>
     <div className="flex min-w-screen">
      <ProblemDescription/>
      <CodeEditor/>
      <Chat socket={socket}/>
     </div>
    </>
  )
}

export default Workspace