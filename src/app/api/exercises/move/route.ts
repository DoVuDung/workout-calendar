import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { dayDate, workoutId, exerciseId, targetIndex } = await request.json();
    
    if (!dayDate || !workoutId || !exerciseId || targetIndex === undefined) {
      return NextResponse.json({ 
        error: 'Missing required fields: dayDate, workoutId, exerciseId, targetIndex' 
      }, { status: 400 });
    }

    const db = readDatabase();
    
    if (!db.days) {
      db.days = [];
    }

    // Find the day
    const dayIndex = db.days.findIndex((d: any) => d.date === dayDate);
    if (dayIndex === -1) {
      return NextResponse.json({ error: 'Day not found' }, { status: 404 });
    }

    const day = db.days[dayIndex];
    
    // Find the workout
    const workoutIndex = day.workouts.findIndex((w: any) => w.id === workoutId);
    if (workoutIndex === -1) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    const workout = day.workouts[workoutIndex];
    
    // Find the exercise to move
    const exerciseIndex = workout.exercises.findIndex((ex: any) => ex.id === exerciseId);
    if (exerciseIndex === -1) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }

    // Reorder exercises within the workout
    const newExercises = [...workout.exercises];
    const [movedExercise] = newExercises.splice(exerciseIndex, 1);
    newExercises.splice(targetIndex, 0, movedExercise);

    // Update the workout with reordered exercises
    workout.exercises = newExercises;

    // Update the database
    writeDatabase(db);

    return NextResponse.json({ 
      success: true, 
      message: `Exercise reordered to position ${targetIndex}` 
    });

  } catch (error) {
    console.error('POST /api/exercises/move error:', error);
    return NextResponse.json({ 
      error: 'Failed to move exercise',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
