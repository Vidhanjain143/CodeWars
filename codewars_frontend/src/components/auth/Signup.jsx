import React from 'react'
import Coder_Login from "../../assets/coder_login.jpg"
import { FcGoogle } from "react-icons/fc"
import { ImCross } from "react-icons/im";
import { useDispatch, useSelector } from 'react-redux';
import { signInWithGoogle } from '../../store/slices/AuthSlice';
import { setSignUpClick } from '../../store/slices/SignupClickedSlice';


const Signup = () => {
    const dispatch=useDispatch();
    const user=useSelector(state=>state.auth);
    const onClicked=useSelector(state=>state.signupClick);
    if(user.userid) return;
  return (
    <div className={`w-[40%] h-[50%] border-2 border-white fixed top-[30%] left-[30%] bg-white ${onClicked?``:`hidden`} rounded-3xl flex justify-between items-center p-2`}>
        
            <img src={Coder_Login} alt=""  className='w-1/2 h-[100%]'/>
            <div className="absolute top-3 right-6 text-gray-500 hover:text-gray-700 hover:cursor-pointer" onClick={()=>dispatch(setSignUpClick(false))}><ImCross size='15px'/></div> 
            <div className="flex flex-col justify-start items-center w-1/2 h-[50%] gap-10">
                <div className="text-2xl font-semibold">Login</div>
                <button className="rounded-3xl flex  items-center gap-3 h-fit text-md shadow-md shadow-slate-500 p-2 text-slate-800 hover:scale-105" onClick={()=>dispatch(signInWithGoogle)}>
                    <FcGoogle size={'30px'}/>Sign in with Google
                </button>
            </div>
    </div>
  )
}

export default Signup