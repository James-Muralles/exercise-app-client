import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';

const HomePage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exerciseList, setExerciseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(-1);
  const [editTemplateIndex, setEditTemplateIndex] = useState(-1);

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

  const getExercises = async () => {
    setLoading(true);
    try {
      const exerciseResponse = await fetch('http://localhost:1337/exercise/exercises?limit=5', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!exerciseResponse.ok) {
        console.log('Failed to retrieve data');
        return;
      }

      const exerciseData = await exerciseResponse.json();
      const first10Exercises = exerciseData.slice(0, 10);
      setExerciseList(first10Exercises);
    } catch (error) {
      console.error('An error occurred while retrieving data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openModal) {
      getExercises();
    }
  }, [openModal]);

  return (
    <div>
      <button onClick={() => openCreateModal(-1)}>Create a Workout Template</button>
      <button onClick={deleteTemplate} disabled={selectedTemplateIndex < 0}>Delete Template</button>
      <button
        onClick={() => openCreateModal(selectedTemplateIndex)}
        disabled={selectedTemplateIndex < 0}
      >
        Edit Template
      </button>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ width: 400, bgcolor: 'background.paper', padding: 2 }}>
          <h2>{editTemplateIndex >= 0 ? 'Edit Template' : 'Create a Workout Template'}</h2>
          {editTemplateIndex >= 0 && (
            <Button onClick={() => openCreateModal(-1)}>Create New Template</Button>
          )}
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
                        {selectedExercises.some((e) => e.id === exercise.id) ? (
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
          <Button onClick={createWorkout}>
            {editTemplateIndex >= 0 ? 'Save Template' : 'Create Template'}
          </Button>
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
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templates[selectedTemplateIndex].exercises.map((exercise) => (
                  <TableRow key={exercise.id}>
                    <TableCell>{exercise.name}</TableCell>
                    <TableCell>
                      <button onClick={() => removeExercise(exercise)}>Remove</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      <div>
        {templates.map((template, index) => (
          <button
            key={index}
            onClick={() => setSelectedTemplateIndex(index)}
            disabled={selectedTemplateIndex === index}
          >
            {template.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
