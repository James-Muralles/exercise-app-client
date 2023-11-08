import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Select } from '@mui/material';
import { Exercise } from '@/state/types';
import { useDispatch, useSelector } from 'react-redux';
import state, { createWorkoutTemplate, setUserTemplates } from '@/state';

const CreateTemplatePage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [exerciseList, setExerciseList] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const [modalClosed, setModalClosed] = useState(false);

  const [templates, setTemplates] = useState<{ name: string; exercises: Exercise[] }[]>([]); 
  const [loading, setLoading] = useState(false);

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

  const [selectedTemplate, setSelectedTemplate] = useState<{ name: string; exercises: Exercise[] } | null>(null);
  const [selectedTemplateName, setSelectedTemplateName] = useState(''); state
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(-1);
  const [editTemplateIndex, setEditTemplateIndex] = useState(-1);

  const dispatch = useDispatch();//redux
  const workoutTemplates = useSelector((state) => state.workoutTemplates);//redux
  const userId = useSelector((state) => state.user._id); 
  const authToken = useSelector((state) => state.token); 
  

const user = useSelector((state) => state.user);


useEffect(() => {
  if (userId && authToken) {
    fetch('http://localhost:1337/templates/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(setUserTemplates(data));
        setTemplates(data);
        setIsLoading(false);
        console.log(templates);
      })
      .catch((error) => {
        console.error('Error fetching user templates:', error);
        setIsLoading(false); 
      });
  }
}, [userId, authToken, dispatch]);


  const openCreateModal = () => {
    setOpenModal(true);
   
  };
  const closeModal = () => {
    setOpenModal(false);
    setModalClosed(true); 
  };

  const createWorkout = () => {
    if (templateName && selectedExercises.length > 0) {
      const newTemplate = {
        name: templateName,
        exercises: selectedExercises.map((exercise) => exercise.id), 
        user: userId,
      }
  
      dispatch(createWorkoutTemplate(newTemplate));
      console.log(newTemplate)
  
      fetch('http://localhost:1337/templates/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTemplate), 
      })
        .then((response) => response.json())
        .then((data) => {
          const createdTemplate = data;
          dispatch(createWorkoutTemplate(createdTemplate));
          console.log(createdTemplate)
        })
        .catch((error) => {
          console.error('An error occurred while creating the template:', error);
        });
  
      setTemplateName('');
      setSelectedExercises([]);
      setOpenModal(false);
    }
  };

  const handleTemplateSelect = (e) => {
    const selectedTemplateName = e.target.value;
    setSelectedTemplateName(selectedTemplateName);

    const selectedTemplate = templates.find((template) => template.name === selectedTemplateName);

    setSelectedTemplate(selectedTemplate);
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

  const addExercise = (exercise: Exercise) => {
    if (!selectedExercises.some((e) => e.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const removeExercise = (exercise: Exercise) => {
    const updatedList = selectedExercises.filter((selected) => selected.id !== exercise.id);
    setSelectedExercises(updatedList);
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

  return (
    <div>
      <button onClick={openCreateModal}>Create a Workout Template</button>

      <Modal open={openModal} onClose={closeModal}>
        <Box sx={{ width: 400, bgcolor: 'background.paper', padding: 2 }}>
          <h2>Create a Workout Template</h2>
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

          <Button onClick={createWorkout}>Create Template</Button>
        </Box>
      </Modal>
      {/* Dropdown for selecting templates */}
      <Select value={selectedTemplateName} onChange={handleTemplateSelect}>
        <MenuItem value="">Select a Template</MenuItem>
        {templates.map((template) => (
          <MenuItem key={template.name} value={template.name}>
            {template.name}
          </MenuItem>
        ))}
      </Select>
      {selectedTemplate && (
        <div>
          <h3>Selected Template: {selectedTemplate.name}</h3>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Exercise Name</TableCell>
                  <TableCell>Exercise Type</TableCell>
                  <TableCell>Exercise Muscle</TableCell>
                  <TableCell>Exercise Difficulty</TableCell>
                  <TableCell>Exercise Instructions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedTemplate.exercises.map((exercise) => (
                  <TableRow key={exercise.id}>
                    <TableCell>{exercise.name}</TableCell>
                    <TableCell>{exercise.type}</TableCell>
                    <TableCell>{exercise.muscle}</TableCell>
                    <TableCell>{exercise.difficulty}</TableCell>
                    <TableCell>{exercise.instructions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {/* The table for displaying workout templates goes here */}
    </div>
  );
};

export default CreateTemplatePage;
