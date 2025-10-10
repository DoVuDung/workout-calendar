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

export async function GET() {
  try {
    const db = readDatabase();
    return NextResponse.json(db.days || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch days' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newDay = await request.json();
    const db = readDatabase();
    
    if (!db.days) {
      db.days = [];
    }
    
    db.days.push(newDay);
    writeDatabase(db);
    
    return NextResponse.json(newDay, { status: 201 });
  } catch (error) {
    console.error('POST /api/days error:', error);
    return NextResponse.json({ 
      error: 'Failed to create day',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
