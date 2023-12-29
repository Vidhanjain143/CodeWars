import { createSlice } from "@reduxjs/toolkit";
const initialState=false;
const SignupClicked=createSlice({
    name:'signupClick',
    initialState,
    reducers:{
        setSignUpClick:(state,action)=>{
            return action.payload
        }
    }
})
export const {setSignUpClick} = SignupClicked.actions
export default SignupClicked.reducer