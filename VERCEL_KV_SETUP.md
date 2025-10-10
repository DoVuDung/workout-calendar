# Vercel KV Setup for Persistent Storage

## Problem
Vercel's serverless functions have a read-only file system, so `db.json` cannot be modified. In-memory storage resets between requests.

## Solution: Vercel KV
Vercel KV is a Redis-compatible key-value store that provides persistent storage for serverless applications.

## Setup Steps

### 1. Install Vercel KV
```bash
npm install @vercel/kv
```

### 2. Create Vercel KV Database
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Storage" tab
4. Click "Create Database"
5. Choose "KV" (Key-Value)
6. Name it "workout-calendar-db"
7. Select region (choose closest to your users)

### 3. Environment Variables
Vercel will automatically add these to your project:
```
KV_REST_API_URL=https://your-kv-url.kv.vercel-storage.com
KV_REST_API_TOKEN=your-token
KV_REST_API_READ_ONLY_TOKEN=your-readonly-token
```

### 4. Update Database Utility
Replace `src/lib/database.ts` with KV implementation:

```typescript
import { kv } from '@vercel/kv';

const DB_KEY = 'workout-calendar-data';

export async function readDatabase() {
  try {
    const data = await kv.get(DB_KEY);
    return data || { days: [] };
  } catch (error) {
    console.error('KV read error:', error);
    return { days: [] };
  }
}

export async function writeDatabase(data: any) {
  try {
    await kv.set(DB_KEY, data);
    return true;
  } catch (error) {
    console.error('KV write error:', error);
    return false;
  }
}
```

### 5. Update API Routes
All API routes need to be async and use await:

```typescript
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
    return NextResponse.json({ error: 'Failed to create day' }, { status: 500 });
  }
}
```

## Benefits
- ✅ **Persistent Storage** - Data survives between requests
- ✅ **Global Availability** - Works across all Vercel regions
- ✅ **Fast Performance** - Redis-based, very fast
- ✅ **Automatic Scaling** - Handles traffic spikes
- ✅ **Free Tier** - 30,000 requests/month free

## Cost
- **Free Tier**: 30,000 requests/month
- **Pro**: $0.20 per 100,000 requests
- **Team**: $0.15 per 100,000 requests

## Migration Steps
1. Set up Vercel KV database
2. Update database utility to use KV
3. Make all API routes async
4. Deploy and test
5. Data will persist across sessions

## Alternative: Keep Current Setup
If you prefer to keep the current setup:
- ✅ **Works for demos** - Shows functionality
- ❌ **Data resets** - Not suitable for production
- ❌ **No persistence** - Users lose data on refresh
