import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/AuthSlice'
import signupClickReducer from './slices/SignupClickedSlice'
import roomReducer from './slices/RoomSlice'
import problemsReducer from './slices/ProblemsSlice'
import selectedProblemReducer from './slices/SelectedProblem'

const store=configureStore({
    reducer:{
        auth:authReducer,
        signupClick:signupClickReducer,
        room:roomReducer,
        problems:problemsReducer,
        selectedProblem:selectedProblemReducer
    }
})

export default store;