import { Day, Workout, Exercise } from '@/types';

// Use Next.js API routes in production (Vercel), JSON server in development
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002');

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Days API
  async getDays(): Promise<Day[]> {
    return this.request<Day[]>('/days');
  }

  async getDay(date: string): Promise<Day | null> {
    try {
      return await this.request<Day>(`/days/${date}`);
    } catch (error) {
      return null;
    }
  }

  async updateDay(day: Day): Promise<Day> {
    // Check if day exists first
    const existingDay = await this.getDay(day.date);
    
    if (existingDay) {
      // Update existing day using date as ID
      return this.request<Day>(`/days/${day.date}`, {
        method: 'PUT',
        body: JSON.stringify(day),
      });
    } else {
      // Create new day with date as ID
      const dayWithId = {
        id: day.date,
        ...day,
      };
      return this.request<Day>('/days', {
        method: 'POST',
        body: JSON.stringify(dayWithId),
      });
    }
  }

  // Workouts API
  async getWorkouts(dayDate: string): Promise<Workout[]> {
    const day = await this.getDay(dayDate);
    return day?.workouts || [];
  }

  async createWorkout(dayDate: string, workout: Omit<Workout, 'id'>): Promise<Workout> {
    
    const MAX_WORKOUTS_PER_DAY = 5;
    
    let day = await this.getDay(dayDate);
    
    // Check if day is full
    if (day && day.workouts.length >= MAX_WORKOUTS_PER_DAY) {
      throw new Error(`Day ${dayDate} is full. Maximum ${MAX_WORKOUTS_PER_DAY} workouts allowed per day.`);
    }

    // Check for duplicate workout name in the same day
    if (day && day.workouts.some(w => w.name.toLowerCase() === workout.name.toLowerCase())) {
      throw new Error(`A workout with the name "${workout.name}" already exists on this day.`);
    }
    
    const newWorkout: Workout = {
      ...workout,
      id: `workout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    if (!day) {
      // Create a new day if it doesn't exist
      day = {
        date: dayDate,
        workouts: [],
      };
    }

    const updatedDay = {
      ...day,
      workouts: [...day.workouts, newWorkout],
    };

    await this.updateDay(updatedDay);
    return newWorkout;
  }

  async updateWorkout(dayDate: string, workout: Workout): Promise<Workout> {
    const day = await this.getDay(dayDate);
    if (!day) {
      throw new Error(`Day ${dayDate} not found`);
    }

    // Check for duplicate workout name (excluding the current workout)
    const duplicateWorkout = day.workouts.find(w => 
      w.id !== workout.id && w.name.toLowerCase() === workout.name.toLowerCase()
    );
    if (duplicateWorkout) {
      throw new Error(`A workout with the name "${workout.name}" already exists on this day.`);
    }

    const updatedDay = {
      ...day,
      workouts: day.workouts.map(w => w.id === workout.id ? workout : w),
    };

    await this.updateDay(updatedDay);
    return workout;
  }

  async deleteWorkout(dayDate: string, workoutId: string): Promise<void> {
    const day = await this.getDay(dayDate);
    
    if (!day) {
      throw new Error(`Day ${dayDate} not found`);
    }

    const updatedDay = {
      ...day,
      workouts: day.workouts.filter(w => w.id !== workoutId),
    };

    await this.updateDay(updatedDay);
  }

  async moveWorkout(workoutId: string, fromDayId: string, toDayId: string): Promise<void> {
    await this.request('/workouts/move', {
      method: 'POST',
      body: JSON.stringify({
        workoutId,
        fromDayDate: fromDayId,
        toDayDate: toDayId,
      }),
    });
  }

  async reorderWorkout(dayDate: string, workoutId: string, targetIndex: number): Promise<void> {
    await this.request('/workouts/reorder', {
      method: 'POST',
      body: JSON.stringify({
        dayDate,
        workoutId,
        targetIndex,
      }),
    });
  }

  // Exercises API
  async addExercise(dayDate: string, workoutId: string, exercise: Omit<Exercise, 'id'>): Promise<Exercise> {
    const newExercise: Exercise = {
      ...exercise,
      id: `exercise-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const day = await this.getDay(dayDate);
    if (!day) {
      throw new Error(`Day ${dayDate} not found`);
    }

    const workout = day.workouts.find(w => w.id === workoutId);
    if (!workout) {
      throw new Error(`Workout ${workoutId} not found`);
    }

    const updatedWorkout = {
      ...workout,
      exercises: [...workout.exercises, newExercise],
    };

    await this.updateWorkout(dayDate, updatedWorkout);
    return newExercise;
  }

  async updateExercise(dayDate: string, workoutId: string, exercise: Exercise): Promise<Exercise> {
    const day = await this.getDay(dayDate);
    if (!day) {
      throw new Error(`Day ${dayDate} not found`);
    }

    const workout = day.workouts.find(w => w.id === workoutId);
    if (!workout) {
      throw new Error(`Workout ${workoutId} not found`);
    }

    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.map(ex => ex.id === exercise.id ? exercise : ex),
    };

    await this.updateWorkout(dayDate, updatedWorkout);
    return exercise;
  }

  async deleteExercise(dayDate: string, workoutId: string, exerciseId: string): Promise<void> {
    const day = await this.getDay(dayDate);
    if (!day) {
      throw new Error(`Day ${dayDate} not found`);
    }

    const workout = day.workouts.find(w => w.id === workoutId);
    if (!workout) {
      throw new Error(`Workout ${workoutId} not found`);
    }

    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.filter(ex => ex.id !== exerciseId),
    };

    await this.updateWorkout(dayDate, updatedWorkout);
  }

  async moveExercise(dayDate: string, workoutId: string, exerciseId: string, targetIndex: number): Promise<void> {
    await this.request('/exercises/move', {
      method: 'POST',
      body: JSON.stringify({
        dayDate,
        workoutId,
        exerciseId,
        targetIndex,
      }),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
