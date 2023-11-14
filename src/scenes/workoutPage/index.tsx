import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
  Collapse,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
} from '@mui/icons-material';
import { AuthState, Exercise } from '@/state/types';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import state, { setWorkoutSessions } from '@/state';

const WorkoutPage = () => {
  const location = useLocation();
  const userName = useSelector((state: AuthState) => state.user.username);
  const userId = useSelector((state: AuthState) => state.user.id);
  const templateData = location.state?.templateData;
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [exerciseData, setExerciseData] = useState(
    templateData.exercises.map(() => ({
      reps: '',
      duration: '',
      notes: '',
      completed: false,
    }))
  );
 const authToken = useSelector((state: AuthState) => state.token); 
 const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [workoutName, setWorkoutName] = useState('');

  const ExpandableCell = ({ content }) => {
    const [expanded, setExpanded] = useState(false);


 const dispatch = useDispatch();

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const collapsedContent = content.length > 20 ? `${content.substring(0, 20)}...` : content;

    return (
      <React.Fragment>
        <IconButton size="small" onClick={handleExpandClick}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Typography variant="body2">{content}</Typography>
        </Collapse>
        {!expanded && <Typography variant="body2">{collapsedContent}</Typography>}
      </React.Fragment>
    );
  };

  const handleExerciseChange = (index, field, value) => {
    const newData = [...exerciseData];
    newData[index] = { ...newData[index], [field]: value };
    setExerciseData(newData);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
const dispatch = useDispatch();
const handleSaveWorkout = async () => {
    const workoutData = templateData.exercises.map((exercise, index) => ({
      ...exercise,
      ...exerciseData[index],
    }));

    const sessionData = {
      user: userId,
      name: workoutName,
      template: templateData.id,
      exercises: workoutData.map(({ id, reps, duration, notes, completed }) => ({
        exercise: id,
        reps,
        duration,
        notes,
        completed,
      })),
      completed: true,
    };

    try {
      const response = await fetch('http://localhost:1337/sessions/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(sessionData),
      });

      if (response.status === 201) {
        dispatch(setWorkoutSessions(sessionData));
        setOpenDialog(false);
        setWorkoutCompleted(true);
        return;
      }

      console.error(`HTTP error! Status: ${response.status}`);
    } catch (error) {
      console.error('Error saving workout session:', error);
    }
  };
  const handleWorkoutCompletedDialogClose = () => {
    navigate('/completedSessions');
  };
      

  return (
    
    <div>
      <h1>
        Hello, {userName}! Workout {templateData.name} started!
      </h1>
      <Dialog open={workoutCompleted} onClose={handleWorkoutCompletedDialogClose}>
        <DialogTitle>Workout Completed</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Congratulations! You've completed the workout.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleWorkoutCompletedDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Exercise Name</TableCell>
              <TableCell>Exercise Difficulty</TableCell>
              <TableCell>Exercise Instructions</TableCell>
              <TableCell>Reps</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Completed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templateData.exercises.map((exercise: Exercise, index: number) => (
              <TableRow key={exercise.id}>
                <TableCell>{exercise.name}</TableCell>
                <TableCell>{exercise.difficulty}</TableCell>
                <TableCell>
                  <ExpandableCell content={exercise.instructions} />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    label="Enter Reps"
                    value={exerciseData[index].reps}
                    onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label="Enter Time"
                    value={exerciseData[index].duration}
                    onChange={(e) => handleExerciseChange(index, 'duration', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={exerciseData[index].notes}
                    onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={exerciseData[index].completed}
                    onChange={(e) => handleExerciseChange(index, 'completed', e.target.checked)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <button onClick={handleOpenDialog}>End Workout</button>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Enter Workout Name</DialogTitle>
        <DialogContent>
          <TextField
            label="Workout Name"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveWorkout}>Save Workout</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WorkoutPage;
