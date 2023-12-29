import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/AuthSlice'
import signupClickReducer from './slices/SignupClickedSlice'
const store=configureStore({
    reducer:{
        auth:authReducer,
        signupClick:signupClickReducer,
    }
})

export default store;