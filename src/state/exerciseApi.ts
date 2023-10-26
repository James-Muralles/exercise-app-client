import { createAsyncThunk } from '@reduxjs/toolkit';

// Define an async thunk action to fetch exercises
export const fetchExercises = createAsyncThunk('exercises/fetchExercises', async (muscle, thunkAPI) => {
  try {
    // Perform your API call to fetch exercises here
    const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {
      headers: {
        'X-Api-Key': "6wbpsqPtkHQxMTBHmdBDZw==wiX5WBtYkcD7BgLk", // Set your authorization token here
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Handle API call errors and return an appropriate value
    console.error('API error:', error);
    throw error;
  }
});
