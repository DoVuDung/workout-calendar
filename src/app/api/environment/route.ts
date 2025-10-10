import { NextResponse } from 'next/server';
import { getEnvironmentInfo } from '@/lib/database-universal';

export async function GET() {
  const envInfo = getEnvironmentInfo();
  
  return NextResponse.json({
    ...envInfo,
    timestamp: new Date().toISOString(),
    message: envInfo.isVercel 
      ? 'Running on Vercel with in-memory storage' 
      : envInfo.isProduction 
        ? 'Running in production with in-memory storage'
        : 'Running in development with file system storage'
  });
}
