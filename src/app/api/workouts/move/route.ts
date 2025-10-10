import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { workoutId, fromDayDate, toDayDate } = await request.json();
    
    if (!workoutId || !fromDayDate || !toDayDate) {
      return NextResponse.json({ 
        error: 'Missing required fields: workoutId, fromDayDate, toDayDate' 
      }, { status: 400 });
    }

    const db = readDatabase();
    
    if (!db.days) {
      db.days = [];
    }

    // Find source day
    const fromDayIndex = db.days.findIndex((d: any) => d.date === fromDayDate);
    if (fromDayIndex === -1) {
      return NextResponse.json({ error: 'Source day not found' }, { status: 404 });
    }

    const fromDay = db.days[fromDayIndex];
    
    // Find the workout to move
    const workoutIndex = fromDay.workouts.findIndex((w: any) => w.id === workoutId);
    if (workoutIndex === -1) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    const workout = fromDay.workouts[workoutIndex];

    // Find or create target day
    let toDayIndex = db.days.findIndex((d: any) => d.date === toDayDate);
    let toDay;
    
    if (toDayIndex === -1) {
      // Create new day
      toDay = {
        date: toDayDate,
        workouts: []
      };
      db.days.push(toDay);
      toDayIndex = db.days.length - 1;
    } else {
      toDay = db.days[toDayIndex];
    }

    // Remove workout from source day
    fromDay.workouts.splice(workoutIndex, 1);
    
    // Add workout to target day
    toDay.workouts.push(workout);

    // Update the database
    writeDatabase(db);

    return NextResponse.json({ 
      success: true, 
      message: `Workout moved from ${fromDayDate} to ${toDayDate}` 
    });

  } catch (error) {
    console.error('POST /api/workouts/move error:', error);
    return NextResponse.json({ 
      error: 'Failed to move workout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
