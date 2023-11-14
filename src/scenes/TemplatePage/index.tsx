import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { AuthState, Exercise } from '@/state/types';
import { useDispatch, useSelector } from 'react-redux';
import state, { createWorkoutTemplate, setUserTemplates } from '@/state';
import { Link, useNavigate } from 'react-router-dom';


const TemplatesPage = () => {
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

  const [selectedTemplate, setSelectedTemplate] = useState<{
    [x: string]: any; name: string; exercises: Exercise[] 
} | null>(null);
  const [selectedTemplateName, setSelectedTemplateName] = useState('');
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(-1);
  const [editTemplateIndex, setEditTemplateIndex] = useState(-1);

  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [editedTemplateName, setEditedTemplateName] = useState('');
  const [editedExercises, setEditedExercises] = useState<Exercise[]>([]);

  const dispatch = useDispatch();//redux
  const workoutTemplates = useSelector((state: AuthState) => state.workoutTemplates);//redux
  const userId = useSelector((state: AuthState) => state.user._id); 
  const authToken = useSelector((state: AuthState) => state.token); 

  const navigate = useNavigate();


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
        })
        .catch((error) => {
          console.error('Error fetching user templates:', error);
          setIsLoading(false);
        });
    }
  }, [userId, authToken, dispatch, setTemplates]);
  
  useEffect(() => {
    if (selectedTemplateName && templates.length > 0) {
      const selectedTemplate = templates.find((template) => template.name === selectedTemplateName);
      if (selectedTemplate) {
        setSelectedTemplate(selectedTemplate);
      }
    }
  }, [selectedTemplateName, templates]);
  
  

  useEffect(() => {
    if (openModal) {
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
  }, [openModal,templates]);

  const openCreateModal = () => {
    setIsEditingTemplate(false);
    setEditedTemplateName('');
    setEditedExercises([]);
    setSelectedTemplateName('');
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
      };
  
      fetch('http://localhost:1337/templates/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTemplate),
      })
        .then((response) => response.json())
        .then((data) => {
          
          dispatch(createWorkoutTemplate(data));
  
          setTemplateName('');
          
          setSelectedExercises([]);
          setOpenModal(false);
  
          setSelectedTemplateName(data.name);
  
          fetch('http://localhost:1337/templates/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
          })
            .then((response) => response.json())
            .then((templatesData) => {
              dispatch(setUserTemplates(templatesData));
              setTemplates(templatesData);
              setIsLoading(false);
            })
            .catch((error) => {
              console.error('Error fetching user templates:', error);
              setIsLoading(false);
              dispatch(setUserTemplates([]));
              setTemplates([]);
            });
        })
        .catch((error) => {
          console.error('An error occurred while creating the template:', error);
        });
    }
  };
  

  const handleTemplateSelect = (e: SelectChangeEvent<string>) => {
    const selectedTemplateName = e.target.value;
    setSelectedTemplateName(selectedTemplateName);
  
    if (isEditingTemplate) {
      const selectedTemplate = templates.find((template) => template.name === selectedTemplateName);
      if (selectedTemplate) {
        setEditedTemplateName(selectedTemplate.name);
        setEditedExercises(selectedTemplate.exercises);
        setSelectedTemplate(selectedTemplate || null);
      }
    } else {
      const selectedTemplate = templates.find((template) => template.name === selectedTemplateName);
      setSelectedTemplate(selectedTemplate || null);
    }
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

  const saveEditedTemplate = () => {
    if (selectedTemplate) {
      const updatedTemplate = {
        name: editedTemplateName,
        exercises: editedExercises.map((exercise) => exercise.id),
        user: userId,
      };
  
      fetch(`http://localhost:1337/templates/edit/${selectedTemplate.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(updatedTemplate),
      })
        .then((response) => response.json())
        .then((data) => {
          const updatedTemplates = templates.map((template) =>
            template.name === selectedTemplate.name ? data : template
          );
  
          dispatch(setUserTemplates(updatedTemplates));
          setTemplates(updatedTemplates);
          setSelectedTemplate(null);
          
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
          })
          .catch((error) => {
            console.error('Error fetching user templates:', error);
            setIsLoading(false);
            dispatch(setUserTemplates([]));
            setTemplates([]);
          });
  
          setOpenModal(false);
        })
        .catch((error) => {
          console.error('An error occurred while updating the template:', error);
        });
    }
  };
  
  
  

  const deleteTemplate = () => {
    if (selectedTemplate) {
      fetch(`http://localhost:1337/templates/delete/${selectedTemplate.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            const updatedTemplates = templates.filter((template) => template.name !== selectedTemplate.name);
            dispatch(setUserTemplates(updatedTemplates));
            setTemplates(updatedTemplates);
            setSelectedTemplate(null);
          } else {
            console.error('Failed to delete the template');
          }
        })
        .catch((error) => {
          console.error('An error occurred while deleting the template:', error);
        })
        .finally(() => {
          setIsEditingTemplate(false);
          setOpenModal(false);
        });
    } else {
      console.error('No template selected for deletion');
      setIsEditingTemplate(false);
      setOpenModal(false);
    }
  };
  

  const openEditModal = () => {
  setIsEditingTemplate(true);

  if (selectedTemplate) {
    setEditedTemplateName(selectedTemplate.name);
    setEditedExercises(selectedTemplate.exercises);
  }

  setOpenModal(true);
};
const handleEditExercise = (exercise: Exercise) => {
  if (editedExercises.some((e) => e.id === exercise.id)) {
    const updatedList = editedExercises.filter((e) => e.id !== exercise.id);
    setEditedExercises(updatedList);
  } else {
    setEditedExercises([...editedExercises, exercise]);
  }
};
const handleStartWorkoutClick = () => {

  if (selectedTemplate) {
    navigate('/workoutStart', {
      state: { templateData: selectedTemplate },
    });
  } else {
    console.error('No template selected to start the workout');
  }
};



  return (
    <div>
      <button onClick={openCreateModal}>Create a Workout Template</button>

      <Modal open={openModal} onClose={closeModal}>
        <Box sx={{ width: 400, bgcolor: 'background.paper', padding: 2 }}>
          <h2>{isEditingTemplate ? 'Editing Template' : 'Create a Workout Template'}</h2>
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
      <button
        onClick={() =>
          isEditingTemplate
            ? handleEditExercise(exercise)
            : selectedExercises.some((e) => e.id === exercise.id)
            ? removeExercise(exercise)
            : addExercise(exercise)
        }
      >
        {isEditingTemplate
          ? editedExercises.some((e) => e.id === exercise.id)
            ? 'Remove'
            : 'Add'
          : selectedExercises.some((e) => e.id === exercise.id)
          ? 'Remove'
          : 'Add'}
      </button>
    </TableCell>
  </TableRow>
))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <TextField
            label="Template Name"
            value={isEditingTemplate ? editedTemplateName : templateName}
            onChange={(e) => {
              if (isEditingTemplate) {
                setEditedTemplateName(e.target.value);
              } else {
                setTemplateName(e.target.value);
              }
            }}
          />
          

          <Button onClick={isEditingTemplate ? saveEditedTemplate : createWorkout}>
            {isEditingTemplate ? 'Save Template' : 'Create Template'}
          </Button>
          {isEditingTemplate && (
            <Button onClick={deleteTemplate}>Delete Template</Button>
          )}
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
          <button onClick={openEditModal}>Edit Template</button>
          <button onClick={handleStartWorkoutClick}>Start Workout</button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow key={selectedTemplate.id}>
                  <TableCell>Exercise Name</TableCell>
                  <TableCell>Exercise Type</TableCell>
                  <TableCell>Exercise Muscle</TableCell>
                  <TableCell>Exercise Difficulty</TableCell>
                  <TableCell>Exercise Instructions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedTemplate.exercises.map((exercise: Exercise) => (
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

export default TemplatesPage;
