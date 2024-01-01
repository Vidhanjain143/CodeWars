import React, { useCallback, useEffect, useMemo } from 'react'
import Navbar from '../Navbars/Navbar'
import ProblemDescription from './ProblemDescription'
import CodeEditor from './CodeEditor'
import Chat from './Chat'
import { useParams } from 'react-router-dom'
import {io} from 'socket.io-client'
import { useSelector } from 'react-redux'
const Workspace = () => {
  const {id}=useParams();
  const serverUrl=import.meta.env.VITE_SERVER_URL;
  const user=useSelector(state=>state.auth);
  const socket =useMemo(()=>io(serverUrl));

  const joinRoom = useCallback(() => {
    console.log("Hello")
    socket.emit('join-room', { id: id, userName: user.displayName });
    return () => {
      socket.disconnect();
    };
  }, [id, user.displayName,socket]);

  useEffect(() => {
    joinRoom();
  },[]);
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