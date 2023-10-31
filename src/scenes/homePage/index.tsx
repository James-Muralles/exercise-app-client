import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem } from '@mui/material';

const HomePage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exerciseList, setExerciseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templates, setTemplates] = useState([]);
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


  const openCreateModal = (index) => {
    setEditTemplateIndex(index);
    if (index >= 0) {
      setTemplateName(templates[index].name);
      setSelectedExercises(templates[index].exercises);
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
        const updatedTemplates = [...templates];
        updatedTemplates[editTemplateIndex] = newTemplate;
        setTemplates(updatedTemplates);
        setEditTemplateIndex(-1);
      } else {
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

  const addExercise = (exercise) => {
    if (!selectedExercises.some((e) => e.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const removeExercise = (exercise) => {
    const updatedList = selectedExercises.filter((selected) => selected.id !== exercise.id);
    setSelectedExercises(updatedList);
  };

  const filterExercises = () => {
    const filteredExercises = allExercises.filter((exercise) => {
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
      resetExerciseList();
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

  return (
    <div>
      <button onClick={() => openCreateModal(-1)}>Create a Workout Template</button>
      <button onClick={deleteTemplate} disabled={selectedTemplateIndex < 0}>Delete Template</button>
      <button onClick={() => openCreateModal(selectedTemplateIndex)} disabled={selectedTemplateIndex < 0}>Edit Template</button>

      <Modal open={openModal} onClose={closeModal}>
        <Box sx={{ width: 400, bgcolor: 'background.paper', padding: 2 }}>
          <h2>{editTemplateIndex >= 0 ? 'Edit Template' : 'Create a Workout Template'}</h2>
          {editTemplateIndex >= 0 && (
            <Button onClick={() => openCreateModal(-1)}>Create New Template</Button>
          )}
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
                  {exerciseList.map((exercise) => (
                    <TableRow key={exercise.id}>
                      <TableCell>{exercise.name}</TableCell>
                      <TableCell>
                        {editTemplateIndex < 0 && selectedExercises.some((e) => e.id === exercise.id) ? (
                          <button onClick={() => removeExercise(exercise)}>Remove</button>
                        ) : (
                          <button onClick={() => addExercise(exercise)}>Add</button>
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
                  {/* <TableCell>Action</TableCell> */}
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

      <div>
        {templates.map((template, index) => (
          <button key={index} onClick={() => setSelectedTemplateIndex(index)}>
            {template.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
