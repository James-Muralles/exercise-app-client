import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "./types";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  workoutTemplates: [],
  workoutSessions: []
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.workoutTemplates = [];
      state.workoutSessions = []; 
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.workoutTemplates = [];
      state.workoutSessions = []; 
    },
    createWorkoutTemplate: (state, action) => {
      const { name, exercises, user } = action.payload;
      state.workoutTemplates.push({
        name,
        exercises: exercises,
        user,
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
    setUserTemplates: (state, action) => {
      state.workoutTemplates = action.payload;
    },
    
    // // Add a reducer to save workout session data
    setWorkoutSessions: (state, action) => {
      state.workoutSessions = action.payload;
    },
    deleteWorkoutSession: (state, action) => {
      const sessionIdToDelete = action.payload;
      state.workoutSessions = state.workoutSessions.filter(session => session.id !== sessionIdToDelete);
    },
  },
  
});

export const {
  setLogin,
  setLogout,
  createWorkoutTemplate,
  renameWorkoutTemplate,
  addExerciseToTemplate,
  removeExerciseFromTemplate,
  setUserTemplates,
  // startWorkoutSession,
  deleteWorkoutSession,
  setWorkoutSessions,
} = authSlice.actions;
export default authSlice.reducer;
