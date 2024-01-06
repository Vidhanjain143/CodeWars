import { createSlice} from "@reduxjs/toolkit"

const initialState={
   roomId:null,
   category:null,
}

const RoomSlice=createSlice({
    name:'room',
    initialState,
    reducers:{
        setRoom:(state,action)=>{
           state.roomId=action.payload.roomId,
           state.category=action.payload.category
        },
        clearRoom:(state,action)=>{
            state.roomId=null,
            state.category=null
        }
    }
})

export const {setRoom,clearRoom}=RoomSlice.actions
export default RoomSlice.reducer
