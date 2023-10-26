// exerciseSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { fetchExercises } from './exerciseApi';

const initialState = {
    data: null,
    loading: 'idle',
    error: null,
  };
  

const exerciseSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExercises.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.loading = 'fulfilled';
        state.data = action.payload;
        console.log('Data:', action.payload);
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.loading = 'rejected';
        state.error = action.error.message;
      });
  },
});

export const selectExercises = (state: { exercises: any; }) => state.exercises;

export default exerciseSlice.reducer;
