import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const getUniqueExercises = (sessions) => {
  const exercises = new Set();
  sessions.forEach((session) => {
    session.exercises.forEach((exercise) => {
      exercises.add(exercise.exercise.name);
    });
  });
  return Array.from(exercises);
};

const prepareDataPoints = (sessions, selectedExercise, yAxisKey) => {
  const dateCounts = sessions.reduce((acc, session) => {
    session.exercises.forEach((exercise) => {
      const date = new Date(session.createdAt).toISOString().split('T')[0];
      const value = selectedExercise ? exercise.exercise.name === selectedExercise : true;
      if (value) {
        const key = `${date}-${exercise.exercise.name}`;
        acc[key] = { date, [exercise.exercise.name]: exercise[yAxisKey] || 0 };
      }
    });
    return acc;
  }, {});

  const dataPoints = Object.values(dateCounts);
  return dataPoints;
};

const WorkoutProgressChart = () => {
  const workoutSessions = useSelector((state) => state.workoutSessions);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [yAxisKey, setYAxisKey] = useState('reps');

  const uniqueExercises = getUniqueExercises(workoutSessions);

  const handleExerciseChange = (exercise) => {
    setSelectedExercise(exercise);
  };

  const handleYAxisToggle = () => {
    setYAxisKey((prevKey) => (prevKey === 'reps' ? 'duration' : 'reps'));
  };

  const dataPoints = prepareDataPoints(workoutSessions, selectedExercise, yAxisKey);
  
  

  return (
    <div>
      <div>
        <label>Select Exercise: </label>
        <select onChange={(e) => handleExerciseChange(e.target.value)} value={selectedExercise}>
          <option value="">All Exercises</option>
          {uniqueExercises.map((exercise, index) => (
            <option key={index} value={exercise}>
              {exercise}
            </option>
          ))}
        </select>
        <button onClick={handleYAxisToggle}>Toggle Y-Axis</button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dataPoints}>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip />
          <Legend />
          {selectedExercise
            ? <Line type="monotone" dataKey={selectedExercise} stroke="#8884d8" name={`${selectedExercise} (${yAxisKey})`} activeDot={{ r: 8 }} />
            : Object.keys(uniqueExercises).map((exercise, index) => (
                <Line key={index} type="monotone" dataKey={exercise} stroke="#8884d8" name={`${exercise} (${yAxisKey})`} activeDot={{ r: 8 }} />
              ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};



export default WorkoutProgressChart;
