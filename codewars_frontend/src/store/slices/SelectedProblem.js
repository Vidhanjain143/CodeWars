import { createSlice } from "@reduxjs/toolkit";

const initialState=1;

const SelectedProblem=createSlice({
    name:'selectedProblem',
    initialState,
    reducers:{
        setSelectedProblem:(state,action)=>{
            return action.payload;
        }
    }
})

export const {setSelectedProblem}=SelectedProblem.actions

export default SelectedProblem.reducer