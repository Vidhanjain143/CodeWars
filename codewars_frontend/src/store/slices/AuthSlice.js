import { createSlice } from '@reduxjs/toolkit';
import {GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth'
import {auth} from '../../components/auth/firebase'
import { setSignUpClick } from './SignupClickedSlice';

const initialState = {
  userid: null,
  displayName:null,
  loading: true,
};
const storedUserData=localStorage.getItem('userData');
if(storedUserData){
  const {id,name}=JSON.parse(storedUserData);
  initialState.userid=id;
  initialState.displayName=name;
}
const AuthSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUser:(state, action)=> {
            state.userid = action.payload.id;
            state.displayName=action.payload.name;
            state.loading = false;
            localStorage.setItem('userData', JSON.stringify(action.payload));
          },
          clearUser:(state)=> {
            state.userid = null;
            state.displayName=null;
            state.loading = false;
            localStorage.removeItem('userData');
          },
    }
})

export const { setUser, clearUser } = AuthSlice.actions;
export default AuthSlice.reducer;

export const signInWithGoogle = async (dispatch) => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth,provider);
      dispatch(setUser({id:result.user.uid,name:result.user.displayName}));
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
  