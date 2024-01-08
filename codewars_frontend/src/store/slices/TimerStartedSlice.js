import { createSlice } from "@reduxjs/toolkit";

const initialState=false;

const TimerStarted=createSlice({
    name:'timerStarted',
    initialState,
    reducers:{
        setTimerStarted:(state,action)=>{
            return action.payload;
        }
    }
})

export const {setTimerStarted}=TimerStarted.actions

export default TimerStarted.reducer