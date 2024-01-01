import React, { useState } from 'react'
import Navbar from './Navbars/Navbar'
import Coder from "../assets/coder.jpg"
import { useSelector } from 'react-redux';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const Home = () => {
  const [selectedValue, setSelectedValue] = useState('easy');
  const onClicked=useSelector(state=>state.signupClick);
  const serverUrl=import.meta.env.VITE_SERVER_URL;
  const navigate=useNavigate();
  const handleDropdownChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const displayTime={
    "easy":"You will get 30 mins for 3 problems",
    "medium":"You will get 45 mins for 3 problems",
    "hard":"You will get 1 hour for 3 problems"
  }

  const createRoom=async()=>{
       const response=await axios.post(serverUrl+'/create-room',{category:selectedValue})
       const roomId=response.data.roomId;
       navigate('/workspace/'+roomId);
  }
 
  return (
    <div className={`max-w-screen bg-slate-800 min-h-screen ${onClicked?`opacity-75`:``}`}>
        <Navbar/>
        <div className="flex justify-around px-auto py-5 items-center mt-20">
            <div className="flex flex-col gap-1 ml-2">
            <div className='text-white text-[50px] font-bold font-signature'>Let's <span className='text-green-500 text-[55px]'>Compete</span></div>
            <div className='text-white text-[70px] font-bold font-signature'>with our <span className='text-green-500 text-[75px]'>friends</span></div>
            <div className='flex items-center h-15 w-[300px] justify-between bg-slate-700 p-2 rounded-3xl'>
                <div className=''>
                <select id="difficulty" value={selectedValue} onChange={handleDropdownChange} className='h-10 bg-slate-700 text-white text-lg pl-2 outline-none'>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
              </div>
              <button className='bg-green-500 text-white p-3 rounded-3xl' onClick={createRoom}> Create Room</button>
            </div>
            <div className='text-white font-light'>ℹ️{displayTime[selectedValue]}</div>
            </div>
            <img src={Coder} alt="" className='w-1/2 h-fit'/>
        </div>
    </div>
  )
}

export default Home