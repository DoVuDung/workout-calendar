import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/database-kv';

export async function GET() {
  try {
    const db = await readDatabase();
    return NextResponse.json(db.days || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch days' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newDay = await request.json();
    const db = await readDatabase();
    
    if (!db.days) {
      db.days = [];
    }
    
    db.days.push(newDay);
    await writeDatabase(db);
    
    return NextResponse.json(newDay, { status: 201 });
  } catch (error) {
    console.error('POST /api/days-kv error:', error);
    return NextResponse.json({ 
      error: 'Failed to create day',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
