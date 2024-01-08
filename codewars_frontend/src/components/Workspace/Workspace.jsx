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
const Workspace = () => {
  const {id}=useParams();
  const serverUrl=import.meta.env.VITE_SERVER_URL;
  const user=useSelector(state=>state.auth);
  const socket =io(serverUrl);  
  const dispatch=useDispatch();
  const [loaded,setLoaded]=useState(false);
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
      setLoaded(true);
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
      {loaded && <ProblemDescription/>}
      {loaded && <CodeEditor/>}
      <Chat socket={socket}/>
     </div>
    </>
  )
}

export default Workspace