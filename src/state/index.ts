import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "./types";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  workoutTemplates: [],
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true; 
            state.workoutTemplates = [];
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false; 
            state.workoutTemplates = [];

        },
        createWorkoutTemplate: (state, action) => {
            const { name, exercises } = action.payload;
            state.workoutTemplates.push({
              name,
              exercises: exercises
            });
          },
          
          renameWorkoutTemplate: (state, action) => {
            const { templateIndex, newName } = action.payload;
            state.workoutTemplates[templateIndex].name = newName;
          },
          
          addExerciseToTemplate: (state, action) => {
            const { templateIndex, exercise } = action.payload;
            state.workoutTemplates[templateIndex].exercises.push(exercise);
          },
          
          removeExerciseFromTemplate: (state, action) => {
            const { templateIndex, exerciseIndex } = action.payload;
            state.workoutTemplates[templateIndex].exercises.splice(exerciseIndex, 1);
          },
        
    },
});



export const { setLogin, setLogout, createWorkoutTemplate, renameWorkoutTemplate, addExerciseToTemplate, removeExerciseFromTemplate } = authSlice.actions;
export default authSlice.reducer;
