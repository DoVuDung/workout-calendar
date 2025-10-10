# Environment Setup Guide

This guide explains how the workout calendar application works in different environments.

## 🏠 Local Development

### Setup:
```bash
# Install dependencies
npm install

# Start JSON server (Terminal 1)
npm run server

# Start Next.js dev server (Terminal 2)
npm run dev
```

### How it works:
- **API**: Uses JSON server on `http://localhost:3002`
- **Storage**: Writes to `db.json` file
- **Data Persistence**: Permanent (survives restarts)
- **Environment**: `NODE_ENV=development`

### Features:
- Full CRUD operations
- Drag & drop functionality
- Data persists between sessions
- Hot reloading
- Debug logging

## Vercel Production

### Setup:
```bash
# Deploy to Vercel
git push origin main
# Vercel automatically detects Next.js and deploys
```

### How it works:
- **API**: Uses Next.js API routes (`/api/*`)
- **Storage**: In-memory storage (session-based)
- **Data Persistence**: Session-based (resets after inactivity)
- **Environment**: `NODE_ENV=production`, `VERCEL=1`

### Features:
- Full CRUD operations
- Drag & drop functionality
- Data resets when function instances recycle
- Optimized for serverless
- No external dependencies

## Environment Detection

The app automatically detects the environment:

```typescript
// Environment variables
NODE_ENV=development | production
VERCEL=1 (only on Vercel)

// API endpoint detection
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Next.js API routes
  : 'http://localhost:3002'; // JSON server
```

## Storage Comparison

| Feature | Local Development | Vercel Production |
|---------|------------------|-------------------|
| **Storage Type** | File System (`db.json`) | In-Memory |
| **Persistence** | Permanent | Session-based |
| **Performance** | Good | Excellent |
| **Scalability** | Limited | High |
| **Setup Complexity** | Medium | Low |
| **Cost** | Free | Free (with limits) |

## API Endpoints

### Local Development:
- `http://localhost:3002/days` - JSON server
- `http://localhost:3002/days/:date` - JSON server

### Vercel Production:
- `https://your-app.vercel.app/api/days` - Next.js API
- `https://your-app.vercel.app/api/days/:date` - Next.js API

## Environment Info

Check the current environment:
```bash
# Local
curl http://localhost:3000/api/environment

# Vercel
curl https://your-app.vercel.app/api/environment
```

Response:
```json
{
  "environment": "production",
  "isVercel": true,
  "isProduction": true,
  "storage": "memory",
  "dataPath": "/var/task/db.json",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "message": "Running on Vercel with in-memory storage"
}
```

## Deployment Checklist

### Before Deploying:
- [ ] Test locally with `npm run build`
- [ ] Verify all API endpoints work
- [ ] Check drag & drop functionality
- [ ] Test data persistence

### After Deploying:
- [ ] Visit your Vercel URL
- [ ] Test creating workouts
- [ ] Test moving workouts
- [ ] Check `/api/environment` endpoint
- [ ] Verify data works during session

## Troubleshooting

### Common Issues:

1. **Data not persisting on Vercel**
   - Expected behavior (session-based storage)
   - Consider Vercel KV for permanent storage

2. **API calls failing**
   - Check environment detection
   - Verify API endpoint URLs
   - Check browser network tab

3. **Drag & drop not working**
   - Ensure React Query cache invalidation
   - Check mutation success callbacks
   - Verify API responses

## 📈 Performance

### Local Development:
- **Cold Start**: ~2-3 seconds
- **Hot Reload**: ~1 second
- **API Response**: ~50-100ms

### Vercel Production:
- **Cold Start**: ~1-2 seconds
- **Warm Requests**: ~100-200ms
- **API Response**: ~50-150ms

## Best Practices

1. **Always test locally first**
2. **Use environment variables for configuration**
3. **Handle both environments gracefully**
4. **Provide clear error messages**
5. **Log environment info for debugging**

## 🔮 Future Improvements

- [ ] Add Vercel KV for permanent storage
- [ ] Implement database migrations
- [ ] Add data backup/export features
- [ ] Optimize for edge functions
- [ ] Add monitoring and analytics
