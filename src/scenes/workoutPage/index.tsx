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

interface WorkoutPageProps {
    workoutCompleted?: boolean;
    setWorkoutCompleted?: React.Dispatch<React.SetStateAction<boolean>>;
  }

  interface ExerciseDataItem {
    reps: string;
    hours: string;
    minutes: string;
    seconds: string;
    notes: string;
    completed: boolean;
  }

const WorkoutPage: React.FC<WorkoutPageProps> = ({workoutCompleted = false, setWorkoutCompleted}) => {
  const location = useLocation();
  const userName = useSelector((state: AuthState) => state.user.username);
  const userId = useSelector((state: AuthState) => state.user.id);
  const templateData = location.state?.templateData;
//   const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [exerciseData, setExerciseData] = useState<ExerciseDataItem[]>(
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

  const ExpandableCell = ({ content }: { content: React.ReactNode }) => {
    const [expanded, setExpanded] = useState(false);


    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

     const collapsedContent =
    typeof content === 'string' && content.length > 20
      ? `${content.substring(0, 20)}...`
      : content;

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

  const handleExerciseChange = (index: number, field: string, value: string | boolean) => {
    const newData = [...exerciseData];
  
    // Ensure the structure is initialized
    if (!newData[index].hasOwnProperty('hours')) {
      newData[index] = { ...newData[index], hours: '00', minutes: '00', seconds: '00' };
    }
  
    newData[index] = { ...newData[index], [field]: value };
  
    console.log('New Data:', newData); // Log the entire newData array
  
    if (field === 'hours' || field === 'minutes' || field === 'seconds') {
      console.log('Hours:', newData[index].hours);
      console.log('Minutes:', newData[index].minutes);
      console.log('Seconds:', newData[index].seconds);
  
      // Combine the values into 'hh:mm:ss' format
      const combinedDuration = `${newData[index].hours.padStart(2, '0')}:${newData[index].minutes.padStart(2, '0')}:${newData[index].seconds.padStart(2, '0')}`;
      console.log('Combined Duration:', combinedDuration);
    }
  
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
  const workoutData = templateData.exercises.map((exercise: Exercise, index: number) => ({
    ...exercise,
    ...exerciseData[index],
  }));

  const sessionData = {
    user: userId,
    name: workoutName,
    template: templateData.id,
    exercises: workoutData.map(({ id, reps, duration, notes, completed }: any, index: number) => {
      // Calculate combined duration
      const combinedDuration = `${exerciseData[index].hours.padStart(2, '0')}:${exerciseData[index].minutes.padStart(2, '0')}:${exerciseData[index].seconds.padStart(2, '0')}`;
  
      return {
        exercise: id,
        reps,
        duration: combinedDuration, // Use combined duration
        notes,
        completed,
      };
    }),
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
      if (setWorkoutCompleted) {
        setWorkoutCompleted(true);
      }
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
                    type="number"
                    label="Hrs"
                    value={exerciseData[index].hours}
                    onChange={(e) => handleExerciseChange(index, 'hours', e.target.value)}
                    style={{ width: '6em' }}
                  />
                  <TextField
                  
                    type="number"
                    label="Min"
                    value={exerciseData[index].minutes}
                    onChange={(e) => handleExerciseChange(index, 'minutes', e.target.value)}
                    style={{ width: '6em' }}
                  />
                  <TextField
                    type="number"
                    label="Sec"
                    value={exerciseData[index].seconds}
                    onChange={(e) => handleExerciseChange(index, 'seconds', e.target.value)}
                    style={{ width: '6em' }}
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
