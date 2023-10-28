import React,{useEffect, useMemo} from 'react'
import { fetchExercises } from '@/state/exerciseApi';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectExercises } from '@/state/exerciseSlice';
import { useGetExercisesQuery } from '@/state/api';


  const getExercises = async () => {
    console.log("Attempting to retrieve data");
    try {
      const exerciseResponse = await fetch('http://localhost:1337/exercise/exercises', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!exerciseResponse.ok) {
        // Handle the case where the request failed (e.g., network issues or server error).
        console.log("Failed to retrieve data");
        return;
      }

      // Assuming a successful response, you can process the data here.
      const exerciseData = await exerciseResponse.json();
      console.log("Successfully retrieved data:", exerciseData);
    } catch (error) {
      console.error("An error occurred while retrieving data:", error);
    }
};
getExercises()


  

  return (
    <div>

        Hello, welcome HOME!!!
        {/* Your component UI */}
      <button >Fetch Exercises</button>
    </div>
      
  )
}

export default HomePage;
