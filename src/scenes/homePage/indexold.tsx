import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Checkbox } from '@mui/material';
import { CheckBox } from '@mui/icons-material';
import { Exercise } from '@/state/types';

const HomePageOld = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [exerciseList, setExerciseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templates, setTemplates] = useState<{ name: string; exercises: Exercise[] }[]>([]);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(-1);
  const [editTemplateIndex, setEditTemplateIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const muscleTypes = [
    'abdominals',
    'abductors',
    'adductors',
    'biceps',
    'calves',
    'chest',
    'forearms',
    'glutes',
    'hamstrings',
    'lats',
    'lower_back',
    'middle_back',
    'neck',
    'quadriceps',
    'traps',
    'triceps',
  ];

  const [allExercises, setAllExercises] = useState([]);
  const [modalClosed, setModalClosed] = useState(false);
  const [showWorkoutSession, setShowWorkoutSession] = useState(false); 
  const [workoutSessionStartTime, setWorkoutSessionStartTime] = useState<Date | null>(null);
  const [workoutSessionStartDate, setWorkoutSessionStartDate] = useState<Date | null>(null);
  const [showCompletedWorkoutSession, setShowCompletedWorkoutSession] = useState(false); 
  const [workoutSessionEndTime, setWorkoutSessionEndTime] = useState<Date | null>(null);
  const [workoutSessionEndtDate, setWorkoutSessionEndDate] = useState<Date | null>(null);
  const [workoutSessionActive, setWorkoutSessionActive] = useState(false);
 const [sessionCompleted, setSessionCompleted] = useState<{
  startTime: Date | null;
  endTime: Date | null;
  exercises: Exercise[];
} | null>(null);
const [showTemplateTable, setShowTemplateTable] = useState(false); 





// const isTimeValid = (time) => {
//     const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
//     return timeRegex.test(time);
//   }

  const formatDate = (date) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }
  const formatTime = (date) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString(undefined, options);
  }


  const startWorkoutSessionDate = () => {
    const sessionStartDate = new Date();
    setWorkoutSessionStartDate(formatDate(sessionStartDate));
    setShowWorkoutSession(true);
    console.log(sessionStartDate)
  };

  const startWorkoutSessionStartTime = () => {
    const sessionStartTime = new Date();
    setWorkoutSessionStartTime(formatTime(sessionStartTime));
    console.log(formatTime(sessionStartTime));
  }

  const endWorkoutSessionDate = () => {
    const sessionEndDate = new Date();
    setWorkoutSessionEndDate(formatDate(sessionEndDate));
    setShowWorkoutSession(true);
    console.log(sessionEndDate)
  };

  const endWorkoutSessionStartTime = () => {
    const sessionEndTime = new Date();
    setWorkoutSessionEndTime(formatTime(sessionEndTime));
    console.log(formatTime(sessionEndTime));
  }
  

  const openCreateModal = (index) => {
    setEditTemplateIndex(index);
    if (index >= 0) {
      setTemplateName(templates[index].name);
      // Set selectedExercises by spreading the exercises from the selected template
      setSelectedExercises([...templates[index].exercises]);
    } else {
      setTemplateName('');
      setSelectedExercises([]);
    }
    setOpenModal(true);
  };

  const createWorkout = () => {
    if (templateName && selectedExercises.length > 0) {
      const newTemplate = { name: templateName, exercises: selectedExercises };
      if (editTemplateIndex >= 0) {
        // If editTemplateIndex is >= 0, it's an edit operation
        const updatedTemplates = [...templates];
        updatedTemplates[editTemplateIndex] = newTemplate;
        setTemplates(updatedTemplates);
        setEditTemplateIndex(-1);
      } else {
        // Otherwise, it's a new template
        setTemplates([...templates, newTemplate]);
      }
      setTemplateName('');
      setSelectedExercises([]);
      setOpenModal(false);
    }
  };
  

  const deleteTemplate = () => {
    if (selectedTemplateIndex >= 0) {
      const updatedTemplates = [...templates];
      updatedTemplates.splice(selectedTemplateIndex, 1);
      setTemplates(updatedTemplates);
      setSelectedTemplateIndex(-1);
    }
  };

  const addExercise = (exercise: Exercise) => {
    if (!selectedExercises.some((e) => e.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const removeExercise = (exercise: Exercise) => {
    const updatedList = selectedExercises.filter((selected) => selected.id !== exercise.id);
    setSelectedExercises(updatedList);
  };

  const filterExercises = () => {
    const filteredExercises = allExercises.filter((exercise: Exercise) => {
      const isMatchingName = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
      const isMatchingType = !selectedType || exercise.muscle === selectedType;
      return isMatchingName && isMatchingType;
    });

    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    const paginatedExercises = filteredExercises.slice(startIndex, endIndex);

    setExerciseList(paginatedExercises);
  };

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const nextPage = () => {
    if (exerciseList.length === 10) {
      setPage(page + 1);
    }
  };

  const resetExerciseList = () => {
    setExerciseList([]);
  };

  useEffect(() => {
    if (openModal) {
      // resetExerciseList();
      filterExercises();
      setModalClosed(false); 
    } else if (modalClosed) {
      setPage(1); 
      setModalClosed(false); 
    }
  }, [openModal, selectedType, searchTerm, page, modalClosed]);

  const closeModal = () => {
    setOpenModal(false);
    setModalClosed(true); 
  };
  useEffect(() => {
    if (openModal) {
      fetch('http://localhost:1337/exercise/exercises?limit=10', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => response.json())
        .then((data) => setAllExercises(data))
        .catch((error) => {
          console.error('An error occurred while retrieving data:', error);
        });
    }
  }, [openModal]);

  const endWorkoutSession = () => {
    // Logic to end the workout session and save the completed session
    setSessionCompleted({
      startTime: workoutSessionStartTime || new Date(),
      endTime: workoutSessionEndTime || new Date(),
      exercises: templates[selectedTemplateIndex].exercises,
    });
    setWorkoutSessionActive(false);
  };

  

  return (
    <div>
      {!workoutSessionActive && (
  <button onClick={() => openCreateModal(-1)}>
    Create a Workout Template
  </button>
)}

{!workoutSessionActive && selectedTemplateIndex >= 0 && (
  <button onClick={deleteTemplate}>
    Delete Template
  </button>
)}
{!workoutSessionActive && selectedTemplateIndex >= 0 && (
  <button onClick={() => openCreateModal(selectedTemplateIndex)}>
    Edit Template
  </button>
)}
{!workoutSessionActive && selectedTemplateIndex >= 0 && (
  <button onClick={() => {
    setShowWorkoutSession(true);
    startWorkoutSessionDate();
    startWorkoutSessionStartTime();
    setWorkoutSessionActive(true);
  }}>
    Start Workout Session
  </button>
)}

{selectedTemplateIndex >= 0 && !sessionCompleted && (
  <button onClick={() => {
    setShowCompletedWorkoutSession(true);
    endWorkoutSessionDate();
    endWorkoutSessionStartTime();
    endWorkoutSession();
    setSessionCompleted({
      startTime: workoutSessionStartTime || new Date(),
      endTime: workoutSessionEndTime || new Date(),
      exercises: templates[selectedTemplateIndex].exercises,
    });
    
  }}>
    End Workout Session
  </button>
)}
<div>
  {templates.map((template, index) => (
    <button
      key={index}
      onClick={() => {
        setSessionCompleted(null)
        if (selectedTemplateIndex === index) {
          setSelectedTemplateIndex(-1); 
          
        } else {
          setSelectedTemplateIndex(index);
          
        }
      }}
    >
      {template.name}
    </button>
  ))}
</div>

      <Modal open={openModal} onClose={closeModal}>
        <Box sx={{ width: 400, bgcolor: 'background.paper', padding: 2 }}>
          <h2>{editTemplateIndex >= 0 ? 'Edit Template' : 'Create a Workout Template'}</h2>
          {/* {editTemplateIndex >= 0 && (
            <button onClick={() => openCreateModal(-1)}>Create New Template</button>
          )} */}
          <TextField
            label="Exercise Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <TextField
            select
            label="Muscle Type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {muscleTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Exercise Name</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exerciseList.map((exercise: Exercise) => (
                    <TableRow key={exercise.id}>
                      <TableCell>{exercise.name}</TableCell>
                      <TableCell>
                        {editTemplateIndex < 0 ? (
                          selectedExercises.some((e) => e.id === exercise.id) ? (
                            <button onClick={() => removeExercise(exercise)}>Remove</button>
                          ) : (
                            <button onClick={() => addExercise(exercise)}>Add</button>
                          )
                        ) : (
                          selectedExercises.some((e) => e.id === exercise.id) ? (
                            <button onClick={() => removeExercise(exercise)}>Remove</button>
                          ) : (
                            <button onClick={() => addExercise(exercise)}>Add</button>
                          )
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </TableContainer>
          )}
          <TextField
            label="Template Name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
          <Button onClick={createWorkout}>{editTemplateIndex >= 0 ? 'Save Template' : 'Create Template'}</Button>
          <div>
            {page > 1 && (
              <button onClick={previousPage}>Previous</button>
            )}
            <span>Page {page}</span>
            {exerciseList.length === 10 && (
              <button onClick={nextPage}>Next</button>
            )}
          </div>
        </Box>
      </Modal>

      {selectedTemplateIndex >= 0 && (
        <div>
          {!workoutSessionActive && (
  <div>
    <h2>{templates[selectedTemplateIndex].name}</h2>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Exercise Name</TableCell>
            <TableCell>Muscle</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Difficulty</TableCell>
            <TableCell>Instructions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {templates[selectedTemplateIndex].exercises.map((exercise) => (
            <TableRow key={exercise.id}>
              <TableCell>{exercise.name}</TableCell>
              <TableCell>{exercise.muscle}</TableCell>
              <TableCell>{exercise.type}</TableCell>
              <TableCell>{exercise.difficulty}</TableCell>
              <TableCell>{exercise.instructions}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
)}

          {showWorkoutSession && (
        <div>
          <h2>
            Workout Session{' '}
            {workoutSessionStartTime && (
              <span style={{ fontSize: '14px', color: 'gray' }}>
                Started at {workoutSessionStartTime.toLocaleString()}
                <span> </span>
                <span style={{ fontSize: '14px', color: 'gray' }}>
                on {workoutSessionStartDate.toLocaleString()}
              </span>
              </span>
              
            )}
          </h2>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Exercise Name</TableCell>
                      <TableCell>Reps</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Notes</TableCell>
                      <TableCell>Completed</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {templates[selectedTemplateIndex].exercises.map((exercise) => (
                      <TableRow key={exercise.id}>
                        <TableCell>{exercise.name}</TableCell>
                        <TableCell>
                            <TextField type="number" label="Reps" variant="outlined" />
                        </TableCell>
                        <TableCell>
                            <TextField 
                            label="Duration" 
                            variant="outlined" 
                             />
                        </TableCell>
                        <TableCell>
                            <TextField label="Notes" variant="outlined" />
                        </TableCell>
                        <TableCell>
                            <Checkbox/>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
          
        </div>
      )}

      {sessionCompleted && (
        <div>
          <h2>
            Session Completed{' '}
            {sessionCompleted.startTime && sessionCompleted.endTime && (
              <span style={{ fontSize: '14px', color: 'gray' }}>
                Started at {sessionCompleted.startTime.toLocaleString()}
                <span> </span>
                Ended at {sessionCompleted.endTime.toLocaleString()}
              </span>
            )}
          </h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Exercise Name</TableCell>
                  <TableCell>Reps</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Completed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessionCompleted.exercises.map((exercise) => (
                  <TableRow key={exercise.id}>
                    <TableCell>{exercise.name}</TableCell>
                    <TableCell>
                      <TextField type="number" label="Reps" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <TextField label="Duration" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <TextField label="Notes" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
};

export default HomePageOld;
