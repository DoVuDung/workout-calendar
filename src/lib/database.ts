import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'db.json');

// Global in-memory storage for Vercel (serverless functions)
// This will persist across requests within the same function instance
let memoryDb: any = null;

export function readDatabase() {
  // In production (Vercel), use in-memory storage
  if (process.env.NODE_ENV === 'production') {
    // Always try to read from file first to ensure we have the latest data
    try {
      const data = readFileSync(DB_PATH, 'utf8');
      const parsedData = JSON.parse(data);
      // Update memory with file data if it's newer or if memory is empty
      if (!memoryDb || Object.keys(parsedData).length > 0) {
        memoryDb = parsedData;
      }
    } catch (error) {
      // If file doesn't exist or can't be read, use memory or initialize empty
      if (!memoryDb) {
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

export function writeDatabase(data: any) {
  // In production (Vercel), update in-memory storage
  if (process.env.NODE_ENV === 'production') {
    memoryDb = data;
    // Also try to write to file (might fail in serverless, but worth trying)
    try {
      writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
      // Ignore file write errors in production
      console.log('File write failed in production (expected):', error instanceof Error ? error.message : 'Unknown error');
    }
    return;
  }
  
  // In development, write to file
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
