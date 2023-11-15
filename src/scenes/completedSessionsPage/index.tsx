import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from '@mui/material';
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
  const [sortOrder, setSortOrder] = useState({
    column: '',
    direction: 'asc',
  });

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

  const handleSort = (column: string) => {
    setSortOrder((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedSessions = [...workoutSessions].sort((a, b) => {
    if (sortOrder.direction === 'asc') {
      return a[sortOrder.column].localeCompare(b[sortOrder.column]);
    } else {
      return b[sortOrder.column].localeCompare(a[sortOrder.column]);
    }
  });


  return (
    <div>
      <h2>Sessions Completed</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortOrder.column === 'name'}
                  direction={sortOrder.column === 'name' ? sortOrder.direction as 'asc' | "desc" : undefined}
                  onClick={() => handleSort('name')}
                >Session Name </TableSortLabel>
                </TableCell>
              <TableCell>
              <TableSortLabel
                  active={sortOrder.column === 'createdAt'}
                  direction={sortOrder.column === 'createdAt' ? sortOrder.direction : 'asc'}
                  onClick={() => handleSort('createdAt')}
                >
                  Date Completed
                </TableSortLabel>
                </TableCell>
              <TableCell>Exercises</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSessions.map((session) => (
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
