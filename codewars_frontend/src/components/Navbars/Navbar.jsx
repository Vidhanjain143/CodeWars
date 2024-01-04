import React, { useState } from 'react'
import Logo from "../../assets/codewars-logo.png"
import Signup from '../auth/Signup'
import { IoIosLogOut } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { signout } from '../../store/slices/AuthSlice';
import {setSignUpClick} from '../../store/slices/SignupClickedSlice'

const Navbar = () => {
  const dispatch=useDispatch();
  const onClicked=useSelector(state=>state.signupClick);
    const [loggedUserClick,setLoggedUserClick]=useState(false);
    const user=useSelector(state=>state.auth);
    
  return (
    <>
    <div className='text-white h-13 flex justify-between items-center px-10 py-3 bg-slate-800'>
    <div className="flex justify-between items-center gap-4">
        <img src={Logo} alt="Logo" className='h-[50px] w-[400px]' />
    </div>
    <div className="flex justify-between items-center gap-8 ">
        <div className="text-lg">Leaderboard</div>
        <div className="text-lg">Active Rooms</div>
        {user.userid ?<div className="text-lg  mr-10 hover:scale-105 hover:cursor-pointer flex" onClick={()=>setLoggedUserClick(!loggedUserClick)}> 
        <div className="w-8 rounded-full flex items-center justify-center bg-gray-500 text-white font-lg text-lg mr-2">{user?.displayName?.charAt(0)}</div>{user?.displayName}</div>:
        <div className="text-lg  mr-10 hover:cursor-pointer" onClick={()=>dispatch(setSignUpClick(true))}>Login</div>
        }
        { user.userid && loggedUserClick && (<div className='text-white ml-[-20px]' onClick={()=>dispatch(signout)}><IoIosLogOut size='30px'/></div>)}
    </div>
    </div>

    <Signup/>
    </>
  )
}

export default Navbar