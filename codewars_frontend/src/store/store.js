import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/AuthSlice'
import signupClickReducer from './slices/SignupClickedSlice'
import socketReducer from './slices/SocketSlice'
const store=configureStore({
    reducer:{
        auth:authReducer,
        signupClick:signupClickReducer,
        socket:socketReducer,
    }
})

export default store;