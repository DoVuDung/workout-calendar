import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'db.json');

// Global in-memory storage for Vercel (serverless functions)
let memoryDb: any = null;

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

export function readDatabase() {
  // In production (Vercel), use in-memory storage with file fallback
  if (isProduction) {
    // Always try to read from file first to ensure we have the latest data
    try {
      const data = readFileSync(DB_PATH, 'utf8');
      const parsedData = JSON.parse(data);
      
      // Update memory with file data if it's newer or if memory is empty
      if (!memoryDb || Object.keys(parsedData).length > 0) {
        memoryDb = parsedData;
        console.log(`[${isVercel ? 'Vercel' : 'Production'}] Loaded data from file into memory`);
      }
    } catch (error) {
      // If file doesn't exist or can't be read, use memory or initialize empty
      if (!memoryDb) {
        memoryDb = { days: [] };
        console.log(`[${isVercel ? 'Vercel' : 'Production'}] Initialized empty database in memory`);
      }
    }
    return memoryDb;
  }
  
  // In development, use file system
  try {
    const data = readFileSync(DB_PATH, 'utf8');
    const parsedData = JSON.parse(data);
    console.log('[Development] Loaded data from file system');
    return parsedData;
  } catch (error) {
    console.log('[Development] File not found, returning empty database');
    return { days: [] };
  }
}

export function writeDatabase(data: any) {
  // In production (Vercel), update in-memory storage
  if (isProduction) {
    memoryDb = data;
    console.log(`[${isVercel ? 'Vercel' : 'Production'}] Updated data in memory`);
    
    // Also try to write to file (might fail in serverless, but worth trying)
    try {
      writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
      console.log(`[${isVercel ? 'Vercel' : 'Production'}] Successfully wrote to file`);
    } catch (error) {
      // Ignore file write errors in production (expected in Vercel)
      console.log(`[${isVercel ? 'Vercel' : 'Production'}] File write failed (expected):`, error instanceof Error ? error.message : 'Unknown error');
    }
    return;
  }
  
  // In development, write to file
  try {
    writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    console.log('[Development] Successfully wrote to file system');
  } catch (error) {
    console.error('[Development] Failed to write to file:', error);
    throw error;
  }
}

// Utility function to get environment info
export function getEnvironmentInfo() {
  return {
    environment: process.env.NODE_ENV,
    isVercel: isVercel,
    isProduction: isProduction,
    storage: isProduction ? 'memory' : 'file-system',
    dataPath: DB_PATH
  };
}
