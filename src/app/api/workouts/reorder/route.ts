import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { dayDate, workoutId, targetIndex } = await request.json();
    
    if (!dayDate || !workoutId || targetIndex === undefined) {
      return NextResponse.json({ 
        error: 'Missing required fields: dayDate, workoutId, targetIndex' 
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
    
    // Find the workout to reorder
    const workoutIndex = day.workouts.findIndex((w: any) => w.id === workoutId);
    if (workoutIndex === -1) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    // Reorder workouts within the day
    const newWorkouts = [...day.workouts];
    const [movedWorkout] = newWorkouts.splice(workoutIndex, 1);
    newWorkouts.splice(targetIndex, 0, movedWorkout);

    // Update the day with reordered workouts
    day.workouts = newWorkouts;

    // Update the database
    writeDatabase(db);

    return NextResponse.json({ 
      success: true, 
      message: `Workout reordered to position ${targetIndex}` 
    });

  } catch (error) {
    console.error('POST /api/workouts/reorder error:', error);
    return NextResponse.json({ 
      error: 'Failed to reorder workout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
