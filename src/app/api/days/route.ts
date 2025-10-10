import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/database';

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
