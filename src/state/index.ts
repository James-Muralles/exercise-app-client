import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "./types";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  workoutTemplates: [],
  // Add a new state to track the workout session
  workoutSession: null,
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
      state.workoutSession = null; // Initialize workout session to null
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.workoutTemplates = [];
      state.workoutSession = null; // Clear the workout session on logout
    },
    createWorkoutTemplate: (state, action) => {
      const { name, exercises } = action.payload;
      state.workoutTemplates.push({
        name,
        exercises: exercises,
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
    // Add a new reducer to start a workout session
    startWorkoutSession: (state, action) => {
      const selectedTemplate = state.workoutTemplates[action.payload.templateIndex];
      state.workoutSession = {
        template: selectedTemplate,
        timestamp: new Date().toLocaleString(),
        exercises: selectedTemplate.exercises.map((exercise) => ({
          name: exercise.name,
          reps: "",
          duration: "",
          notes: "",
        })),
      };
    },
    // Add a reducer to save workout session data
    saveWorkoutSession: (state) => {
      // Implement logic to save the workout session data
      // You can save it to a backend or update the state as needed.
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
  startWorkoutSession,
  saveWorkoutSession,
} = authSlice.actions;
export default authSlice.reducer;
