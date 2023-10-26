import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExercises } from '@/state/exerciseApi';
import { selectExercises } from '@/state/exerciseSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const exerciseData = useSelector(selectExercises);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const action = await dispatch(fetchExercises('chest'));
        console.log(action)

        if (fetchExercises.fulfilled.match(action)) {
          // Exercise data is successfully fetched
          setData(action.payload);
        } else if (fetchExercises.rejected.match(action)) {
          // Error occurred while fetching data
          setError(action.error.message);
        }
      } catch (error) {
        setError('An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div>
      <h1>Hello, welcome HOME!!!</h1>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {data && (
        <ul>
          {data.map((exercise) => (
            <li key={exercise.id}>{exercise.name}</li>
          ))}
        </ul>
      )}
      <button onClick={() => fetchData()}>Fetch Exercises</button>
    </div>
  );
};

export default HomePage;
