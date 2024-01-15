import React, { useEffect, useState } from 'react'
import Navbar from '../Navbars/Navbar'
import axios from 'axios';

const Leaderboard = () => {
    const [users,setUsers]=useState();
    const serverUrl=import.meta.env.VITE_SERVER_URL;
    useEffect(()=>{
        const fetchUsers=async()=>{
            try{
            const users=await axios.get(serverUrl+'/get-users').then(res=>res.data).catch((err)=>{console.log(err)});
            setUsers(users);
            }catch(err){
                console.log(err);
            }
        }
        fetchUsers();
    },[])
  return (
    <>
    <Navbar/>
    <div className='bg-slate-900 h-[89.5vh] flex flex-col w-full items-center justify-start px-[20vh]'>
    <div className="flex justify-around items-center text-white w-full mt-4 font-semibold">
        <div className="text-2xl">Rank 🎖️</div>
        <div className="text-2xl">Username 👦🏻</div>
        <div className="text-2xl">Score 💯</div>
    </div>
    <div className="border-2 border-white w-full mt-2 mb-2"></div>
    {users?.map((item,index)=>(
        <div className={`flex justify-around items-center text-white w-full font-normal rounded-xl bg-gray-800 mb-2 p-2 `} key={item.userId}>
        <div className="text-2xl">{index+1}</div>
        <div className="text-2xl">{item.name}</div>
        <div className="text-2xl">{item.score}</div>
    </div>
    ))}
    </div>
    </>
  )
}

export default Leaderboard