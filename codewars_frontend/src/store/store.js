import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/AuthSlice'
import signupClickReducer from './slices/SignupClickedSlice'
import socketReducer from './slices/SocketSlice'
import roomReducer from './slices/RoomSlice'
const store=configureStore({
    reducer:{
        auth:authReducer,
        signupClick:signupClickReducer,
        socket:socketReducer,
        room:roomReducer,
    }
})

export default store;