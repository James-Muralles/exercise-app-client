import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from '@mui/material';
import { setWorkoutSessions } from '@/state';
import { AuthState, WorkoutSession } from '@/state/types';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import ReactTooltip from 'react-tooltip';

const formatDate = (dateString: string | number | Date) => {
  const options = { month: 'numeric', day: 'numeric', year: 'numeric' };
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

  const currentDate = new Date();
  const startDate = new Date(currentDate);
  startDate.setMonth(currentDate.getMonth() - 2); 

  const endDate = new Date(currentDate);

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
        });
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
    const column = sortOrder.column as keyof WorkoutSession;

    if (a[column] && b[column]) {
      if (sortOrder.direction === 'asc') {
        return a[column].localeCompare(b[column]);
      } else {
        return b[column].localeCompare(a[column]);
      }
    } else {
      return 0;
    }
  });

  // Prepare data for calendar heatmap
  const dateCounts = sortedSessions.reduce((acc, session) => {
    const date = new Date(session.createdAt).toISOString().split('T')[0]; // Extract YYYY-MM-DD
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const heatmapData = Object.entries(dateCounts).map(([date, count]) => ({ date, count }));


  return (
    <div>
      <div style={{ width: '40%', height: '40%' }}>
        <CalendarHeatmap
          showWeekdayLabels
          gutterSize={1}
          startDate={startDate}
          endDate={endDate}
          values={heatmapData}
          tooltipDataAttrs={(value) => {
            return {
              'data-tip': `${formatDate(value.date)}: ${value.count} workouts`,
            };
          }}
          
        />
      </div>
      <h2>Sessions Completed</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortOrder.column === 'name'}
                  direction={sortOrder.column === 'name' ? sortOrder.direction as 'asc' | 'desc' : undefined}
                  onClick={() => handleSort('name')}
                >
                  Session Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortOrder.column === 'createdAt'}
                  direction={sortOrder.column === 'name' ? sortOrder.direction as 'asc' | 'desc' : undefined}
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
                        {exercise.exercise.name} - Reps: {exercise.reps}, Duration: {exercise.duration}, Completed:{' '}
                        {exercise.completed ? 'Yes' : 'No'}
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
