import { readFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'db.json');

// For Vercel KV (production)
let kv: any = null;

// Initialize KV client only in production
if (process.env.NODE_ENV === 'production') {
  try {
    kv = require('@vercel/kv').kv;
  } catch (error) {
    console.log('Vercel KV not available, falling back to in-memory storage');
  }
}

// In-memory storage fallback
let memoryDb: any = null;

export async function readDatabase() {
  // In production with Vercel KV
  if (process.env.NODE_ENV === 'production' && kv) {
    try {
      const data = await kv.get('workout-calendar-data');
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.log('KV read failed, falling back to file:', error);
    }
  }
  
  // Fallback: try to read from file (works in development, fails in production)
  try {
    const data = readFileSync(DB_PATH, 'utf8');
    const parsedData = JSON.parse(data);
    
    // In production, also try to save to KV if available
    if (process.env.NODE_ENV === 'production' && kv && !memoryDb) {
      try {
        await kv.set('workout-calendar-data', JSON.stringify(parsedData));
      } catch (error) {
        console.log('KV write failed:', error);
      }
    }
    
    return parsedData;
  } catch (error) {
    // If file doesn't exist, return empty data
    return { days: [] };
  }
}

export async function writeDatabase(data: any) {
  // In production with Vercel KV
  if (process.env.NODE_ENV === 'production' && kv) {
    try {
      await kv.set('workout-calendar-data', JSON.stringify(data));
      return;
    } catch (error) {
      console.log('KV write failed, falling back to memory:', error);
    }
  }
  
  // Fallback: in-memory storage
  if (process.env.NODE_ENV === 'production') {
    memoryDb = data;
    return;
  }
  
  // Development: write to file
  const { writeFileSync } = require('fs');
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
