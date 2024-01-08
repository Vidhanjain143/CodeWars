import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/AuthSlice'
import signupClickReducer from './slices/SignupClickedSlice'
import roomReducer from './slices/RoomSlice'
import problemsReducer from './slices/ProblemsSlice'
import selectedProblemReducer from './slices/SelectedProblem'
import timerStartedReducer from './slices/TimerStartedSlice'

const store=configureStore({
    reducer:{
        auth:authReducer,
        signupClick:signupClickReducer,
        room:roomReducer,
        problems:problemsReducer,
        selectedProblem:selectedProblemReducer,
        timerStarted:timerStartedReducer
    }
})

export default store;