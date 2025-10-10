import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'db.json');

// In-memory storage for Vercel (serverless functions)
let memoryDb: any = null;

function readDatabase() {
  // In production (Vercel), use in-memory storage
  if (process.env.NODE_ENV === 'production') {
    if (!memoryDb) {
      // Initialize with data from db.json if available
      try {
        const data = readFileSync(DB_PATH, 'utf8');
        memoryDb = JSON.parse(data);
      } catch (error) {
        memoryDb = { days: [] };
      }
    }
    return memoryDb;
  }
  
  // In development, use file system
  try {
    const data = readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { days: [] };
  }
}

function writeDatabase(data: any) {
  // In production (Vercel), update in-memory storage
  if (process.env.NODE_ENV === 'production') {
    memoryDb = data;
    return;
  }
  
  // In development, write to file
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

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
