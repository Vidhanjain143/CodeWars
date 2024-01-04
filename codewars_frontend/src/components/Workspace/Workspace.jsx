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
  const socket =io(serverUrl);  
  let count=0;
  useEffect(() => {
    console.log("Hello",count);
    console.log(socket);
    socket.emit('join-room',({ id: id, userName: user.displayName ,userid:user.userid}));
  }, []);
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