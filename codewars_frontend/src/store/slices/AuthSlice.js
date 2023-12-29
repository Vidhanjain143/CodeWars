import { createSlice } from '@reduxjs/toolkit';
import {GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth'
import {auth} from '../../components/auth/firebase'
import { setSignUpClick } from './SignupClickedSlice';

const initialState = {
  user: null,
  loading: true,
};

const AuthSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUser:(state, action)=> {
            state.user = action.payload;
            state.loading = false;
          },
          clearUser:(state)=> {
            state.user = null;
            state.loading = false;
          },
    }
})

export const { setUser, clearUser } = AuthSlice.actions;
export default AuthSlice.reducer;

export const signInWithGoogle = async (dispatch) => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth,provider);
      dispatch(setUser(result.user));
      dispatch(setSignUpClick(false));
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };
  
  export const signout= async (dispatch) => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      // Additional logic if needed
    } catch (error) {
      console.error('Sign-Out Error:', error);
      // Handle error or dispatch another action
    }
  };
  