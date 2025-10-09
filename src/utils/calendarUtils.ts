import { Day, Workout, Exercise } from '@/types';
import { getStoredCalendarData } from './dataPersistence';

export function generateCalendarData(currentDate: Date, includeSampleData: boolean = false): Day[] {
  // Always generate a complete week (7 days)
  const days: Day[] = [];

  // Get the start of the current week (Monday)
  const startOfWeek = new Date(currentDate);
  const dayOfWeek = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
  startOfWeek.setDate(diff);

  // Generate 7 days starting from Monday
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    const day: Day = {
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
      workouts: includeSampleData ? generateSampleWorkouts(date) : [],
    };

    days.push(day);
  }

  return days;
}

function generateSampleWorkouts(date: Date): Workout[] {
  const workouts: Workout[] = [];

  // Add different workouts for different days
  const dayOfWeek = date.getDay();

  if (dayOfWeek === 2) {
    // Tuesday - Chest Day
    workouts.push({
      id: `workout-${date.toISOString().split('T')[0]}-1`,
      name: 'CHEST DAY - WITH ARM...',
      duration: 60,
      difficulty: 'intermediate',
      color: 'bg-purple-500',
      exercises: [
        {
          id: `exercise-${date.toISOString().split('T')[0]}-1-1`,
          name: 'Bench Press Med...',
          sets: 3,
          reps: 5,
          weight: 50,
          type: 'strength',
        },
        {
          id: `exercise-${date.toISOString().split('T')[0]}-1-2`,
          name: 'Exercise B',
          sets: 1,
          reps: 10,
          weight: 40,
          type: 'strength',
        },
      ],
    });
  } else if (dayOfWeek === 3) {
    // Wednesday - Leg Day and Arm Day
    // Leg Day
    workouts.push({
      id: `workout-${date.toISOString().split('T')[0]}-1`,
      name: 'LEG DAY',
      duration: 45,
      difficulty: 'intermediate',
      color: 'bg-blue-500',
      exercises: [
        {
          id: `exercise-${date.toISOString().split('T')[0]}-1-1`,
          name: 'Exercise C',
          sets: 1,
          reps: 6,
          weight: 30,
          type: 'strength',
        },
        {
          id: `exercise-${date.toISOString().split('T')[0]}-1-2`,
          name: 'Exercise D',
          sets: 1,
          reps: 5,
          weight: 40,
          type: 'strength',
        },
        {
          id: `exercise-${date.toISOString().split('T')[0]}-1-3`,
          name: 'Exercise E',
          sets: 1,
          reps: 5,
          weight: 50,
          type: 'strength',
        },
      ],
    });

    // Arm Day
    workouts.push({
      id: `workout-${date.toISOString().split('T')[0]}-2`,
      name: 'ARM DAY',
      duration: 30,
      difficulty: 'intermediate',
      color: 'bg-green-500',
      exercises: [
        {
          id: `exercise-${date.toISOString().split('T')[0]}-2-1`,
          name: 'Exercise F',
          sets: 1,
          reps: 6,
          weight: 60,
          type: 'strength',
        },
      ],
    });
  }

  return workouts;
}

export function getWeekDates(currentDate: Date): Date[] {
  const dates: Date[] = [];
  const startOfWeek = new Date(currentDate);
  const dayOfWeek = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  startOfWeek.setDate(diff);

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date);
  }

  return dates;
}
