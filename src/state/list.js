import fetch from 'node-fetch';
import fs from 'fs';

const muscleGroups = [
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

const apiKey = '6wbpsqPtkHQxMTBHmdBDZw==wiX5WBtYkcD7BgLk'; // Replace with your actual API key

const allExercises = {};
let exerciseId = 1;

async function fetchExercisesForMuscleGroup(muscle, offset, exercises) {
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}&offset=${offset}`, {
      headers: {
        'X-Api-Key': apiKey,
      },
    });

    if (!response.ok) {
      console.error('Error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();

    data.forEach((exercise) => {
      exercise.id = exerciseId; // Assign the ID
      exerciseId++; // Increment the ID for the next exercise
    });

    exercises.push(...data);

    return data;
  } catch (error) {
    console.error('Request failed:', error);
    return null;
  }
}

async function fetchAndSaveAllExercises() {
  for (const muscle of muscleGroups) {
    let offset = 0;
    const exercises = [];

    while (true) {
      const data = await fetchExercisesForMuscleGroup(muscle, offset, exercises);

      if (!data || data.length === 0) {
        break; // No more exercises to fetch
      }

      offset += 10; // Increase the offset for the next batch
    }

    allExercises[muscle] = exercises;
  }

  // Save all exercises to a JSON file
  fs.writeFileSync('client/src/state/exerciseswithid.json', JSON.stringify(allExercises, null, 2));
  console.log('All exercises fetched and saved to exercises.json');
}

fetchAndSaveAllExercises();
