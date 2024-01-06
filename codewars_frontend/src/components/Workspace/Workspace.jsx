import React, { useCallback, useEffect, useMemo } from 'react'
import Navbar from '../Navbars/Navbar'
import ProblemDescription from './ProblemDescription'
import CodeEditor from './CodeEditor'
import Chat from './Chat'
import { useParams } from 'react-router-dom'
import {io} from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setRoom } from '../../store/slices/RoomSlice'
const Workspace = () => {
  const {id}=useParams();
  const serverUrl=import.meta.env.VITE_SERVER_URL;
  const user=useSelector(state=>state.auth);
  const socket =io(serverUrl);  
  const dispatch=useDispatch();
  useEffect(() => {
    const fetchRoom=async()=>{
      const room=await axios.get(serverUrl+`/get-room?roomId=`+id);
      if(room.data.category){
      dispatch(setRoom({roomId:room.data.roomId,category:room.data.category}));
      socket.emit('join-room',({ id: id, userName: user.displayName ,userid:user.userid}));
      }
      else {
        alert("No room");
      }
    }
    fetchRoom();

  return ()=>{
    socket.disconnect();
  }
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