import React,{useEffect, useMemo} from 'react'
import { fetchExercises } from '@/state/exerciseApi';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectExercises } from '@/state/exerciseSlice';
import { useGetExercisesQuery } from '@/state/api';




const HomePage = () => {
  const { data } = useGetExercisesQuery;
  console.log(data)
  const exercise = useMemo(() => {
    return (
      data &&
      data[0].exerciseData.map(({ name, type }) => {
        return {
          name: name,
          revenue: type,
        };
      })
    );
  }, [data]);
  console.log(exercise)

  

  return (
    <div>

        Hello, welcome HOME!!!
        {/* Your component UI */}
      <button >Fetch Exercises</button>
    </div>
      
  )
}

export default HomePage;
