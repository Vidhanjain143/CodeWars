import { createSlice } from "@reduxjs/toolkit";

const initialState=[];

const ProblemsSlice=createSlice({
    name:'problems',
    initialState,
    reducers:{
        setProblems:(state,action)=>{
            return action.payload;
        }
    }
})

export const {setProblems}=ProblemsSlice.actions
export default ProblemsSlice.reducer