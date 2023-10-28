import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "./types";

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false, // Add isAuthenticated property
    exercises: [], 
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true; // Set isAuthenticated to true upon login
            state.exercises = action.payload.exercises;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false; // Set isAuthenticated to false upon logout
            state.exercises = [];
        },
    },
});



export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;
