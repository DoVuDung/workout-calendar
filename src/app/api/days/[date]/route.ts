import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const db = readDatabase();
    const day = db.days?.find((d: any) => d.date === params.date);
    
    if (!day) {
      return NextResponse.json(null);
    }
    
    return NextResponse.json(day);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch day' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const updatedDay = await request.json();
    const db = readDatabase();
    
    if (!db.days) {
      db.days = [];
    }
    
    const dayIndex = db.days.findIndex((d: any) => d.date === params.date);
    
    if (dayIndex === -1) {
      return NextResponse.json({ error: 'Day not found' }, { status: 404 });
    }
    
    db.days[dayIndex] = updatedDay;
    writeDatabase(db);
    
    return NextResponse.json(updatedDay);
  } catch (error) {
    console.error('PUT /api/days/[date] error:', error);
    return NextResponse.json({ 
      error: 'Failed to update day',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const db = readDatabase();
    
    if (!db.days) {
      db.days = [];
    }
    
    const dayIndex = db.days.findIndex((d: any) => d.date === params.date);
    
    if (dayIndex === -1) {
      return NextResponse.json({ error: 'Day not found' }, { status: 404 });
    }
    
    db.days.splice(dayIndex, 1);
    writeDatabase(db);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/days/[date] error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete day',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
