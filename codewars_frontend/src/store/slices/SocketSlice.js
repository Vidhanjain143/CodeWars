import { createSlice } from '@reduxjs/toolkit'

const initialState={
    socketId:null,
}
const SocketSlice=createSlice({
  name:'socket',
  initialState,
  reducers:{
    setSocketID:(state,action)=>{
        console.log(action.payload);
        state.socketId=action.payload;
    },
  },
});

export const {setSocketID} = SocketSlice.actions
export default SocketSlice.reducer