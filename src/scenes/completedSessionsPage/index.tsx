import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { setWorkoutSessions } from '@/state';
import { AuthState } from '@/state/types';

const formatDate = (dateString: string | number | Date) => {
    const options = {  month: 'numeric', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  

const SessionsCompleted = () => {
  const dispatch = useDispatch();
  const workoutSessions = useSelector((state: AuthState) => state.workoutSessions);
  const authToken = useSelector((state: AuthState) => state.token);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      fetch('http://localhost:1337/sessions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      })
      .then((response) => response.json())
      .then((data) => {
        dispatch(setWorkoutSessions(data));
        setIsLoading(false); 
      })
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      setIsLoading(false); 
    }
  }, [dispatch, authToken]);

  if (isLoading) {
    return <div>Loading...</div>; 
  }  


  return (
    <div>
      <h2>Sessions Completed</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Session Name</TableCell>
              <TableCell>Date Completed</TableCell>
              <TableCell>Exercises</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workoutSessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{session.name}</TableCell>
                <TableCell>{formatDate(session.createdAt)}</TableCell>
                <TableCell>
                  <ul>
                    {session.exercises.map((exercise) => (
                      <li key={exercise.id}>
                        {exercise.exercise.name} - Reps: {exercise.reps}, Duration: {exercise.duration}, Completed: {exercise.completed ? 'Yes' : 'No'}
                      </li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SessionsCompleted;
