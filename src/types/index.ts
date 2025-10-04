export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // for cardio exercises
  type: 'strength' | 'cardio' | 'flexibility';
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  color: string;
}

export interface Day {
  date: string; // YYYY-MM-DD format
  workouts: Workout[];
}

export interface CalendarData {
  days: Day[];
  currentMonth: number;
  currentYear: number;
}
