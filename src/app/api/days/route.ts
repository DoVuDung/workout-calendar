import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'db.json');

function readDatabase() {
  try {
    const data = readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { days: [] };
  }
}

function writeDatabase(data: any) {
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
    return NextResponse.json({ error: 'Failed to create day' }, { status: 500 });
  }
}
