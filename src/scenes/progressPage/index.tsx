import { useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const WorkoutProgressChart = () => {
  const workoutSessions = useSelector((state) => state.workoutSessions);
  const { palette } = useTheme();


  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('reps');

  const handleExerciseChange = (exercise) => {
    setSelectedExercise(exercise);
  };

  const handleMetricChange = (metric) => {
    setSelectedMetric(metric);
  };

  const getUniqueExercises = () => {
    const uniqueExercises = [
      ...new Set(
        workoutSessions.flatMap((session) =>
          session.exercises.map((exercise) => exercise.exercise.name)
        )
      ),
    ];
    return uniqueExercises;
  };
  
  const durationToSeconds = (durationString) => {
    const [hours, minutes, seconds] = durationString.split(':');
    return parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
  };

  const prepareChartData = () => {
    if (!selectedExercise) {
      return [];
    }

    const sessionsWithSelectedExercise = workoutSessions.filter((session) =>
      session.exercises.some((exercise) => exercise.exercise.name === selectedExercise)
    );

    const uniqueDatesSet = new Set();
    const data = sessionsWithSelectedExercise.flatMap((session, index) => {
      const selectedExerciseData = session.exercises.find(
        (exercise) => exercise.exercise.name === selectedExercise
      );
  
      if (selectedExerciseData) {
        const dateTimestamp = new Date(session.createdAt).getTime();
        uniqueDatesSet.add(dateTimestamp);
  
        return {
          date: dateTimestamp + index,
          reps: selectedMetric === 'reps' ? selectedExerciseData.reps : 0,
          duration: selectedMetric === 'duration' ? durationToSeconds(selectedExerciseData.duration) : 0,
          weight: selectedMetric === 'weight' ? selectedExerciseData.weight : 0,
        };
      }
  
      return [];
    });

    const uniqueDatesArray = Array.from(uniqueDatesSet);

    return {
      data,
      uniqueDatesArray,
    };
  };

  const { data, uniqueDatesArray } = prepareChartData(); 


  const chartData = prepareChartData();
  const uniqueExercises = getUniqueExercises();

  return (
    <div>
      <select style={{width:'auto', height: '3em', borderRadius: '1em', color: palette.secondary[200]}} onChange={(e) => handleExerciseChange(e.target.value)}>
        <option value={null}>Select Exercise</option>
        {uniqueExercises.map((exercise) => (
          <option key={exercise} value={exercise}>
            {exercise}
          </option>
        ))}
      </select>

      <select style={{width:'auto', height: '3em', borderRadius: '1em', color: palette.secondary[200]}} onChange={(e) => handleMetricChange(e.target.value)}>
        <option value="reps">Reps</option>
        <option value="duration">Duration</option>
        <option value="weight">Weight</option>
      </select>

      {selectedExercise && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart width={600} height={300} data={data}>
            <XAxis
              stroke='white' 
              dataKey="date"
              type="number"
              domain={['dataMin', 'dataMax']}
              ticks={uniqueDatesArray}
              tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
            />

  <YAxis stroke='white' />
  <CartesianGrid stroke="white" strokeDasharray="5 5" />
  <Line
  type="monotone"
  dataKey={selectedMetric}
  stroke={palette.secondary[200]}
  dot={false}
  connectNulls
/>
<Tooltip 
    
    formatter={(value, name, props) => {
      if (selectedMetric === 'duration') {
        const hours = Math.floor(value / 3600);
        const minutes = Math.floor((value % 3600) / 60);
        const seconds = value % 60;
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }
      return value;
    }}
  />
  <Legend />
</LineChart>


        </ResponsiveContainer>
      )}
    </div>
  );
};

export default WorkoutProgressChart;
