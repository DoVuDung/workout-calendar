import { Day, Workout, Exercise } from '@/types';

const STORAGE_KEY = 'workout-calendar-data';

// Get stored calendar data
export function getStoredCalendarData(): Day[] | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    return null;
  }
}

// Store calendar data
export function storeCalendarData(data: Day[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
  }
}

// Update a specific workout in stored data
export function updateStoredWorkout(workout: Workout, dayDate: string): void {
  const storedData = getStoredCalendarData();
  if (!storedData) return;

  const dayIndex = storedData.findIndex(day => day.date === dayDate);
  if (dayIndex === -1) return;

  const workoutIndex = storedData[dayIndex].workouts.findIndex(w => w.id === workout.id);
  if (workoutIndex === -1) {
    // Add new workout
    storedData[dayIndex].workouts.push(workout);
  } else {
    // Update existing workout
    storedData[dayIndex].workouts[workoutIndex] = workout;
  }

  storeCalendarData(storedData);
}

// Add a new workout to stored data
export function addStoredWorkout(workout: Workout, dayDate: string): void {
  const storedData = getStoredCalendarData();
  if (!storedData) return;

  const dayIndex = storedData.findIndex(day => day.date === dayDate);
  if (dayIndex === -1) return;

  storedData[dayIndex].workouts.push(workout);
  storeCalendarData(storedData);
}

// Delete a workout from stored data
export function deleteStoredWorkout(workoutId: string, dayDate: string): void {
  const storedData = getStoredCalendarData();
  if (!storedData) return;

  const dayIndex = storedData.findIndex(day => day.date === dayDate);
  if (dayIndex === -1) return;

  storedData[dayIndex].workouts = storedData[dayIndex].workouts.filter(w => w.id !== workoutId);
  storeCalendarData(storedData);
}

// Move a workout between days in stored data
export function moveStoredWorkout(workoutId: string, fromDayDate: string, toDayDate: string): void {
  const storedData = getStoredCalendarData();
  if (!storedData) return;

  const fromDayIndex = storedData.findIndex(day => day.date === fromDayDate);
  const toDayIndex = storedData.findIndex(day => day.date === toDayDate);
  
  if (fromDayIndex === -1 || toDayIndex === -1) return;

  const workoutIndex = storedData[fromDayIndex].workouts.findIndex(w => w.id === workoutId);
  if (workoutIndex === -1) return;

  const [workout] = storedData[fromDayIndex].workouts.splice(workoutIndex, 1);
  storedData[toDayIndex].workouts.push(workout);
  
  storeCalendarData(storedData);
}
