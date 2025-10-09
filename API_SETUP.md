# API Setup with JSON Server

This application now uses json-server as a mock API server to provide realistic data persistence and API interactions.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Environment

#### Option A: Start Both Servers Together
```bash
npm run dev:full
```

This will start:
- JSON Server on `http://localhost:3002`
- Next.js Dev Server on `http://localhost:3000`

#### Option B: Start Servers Separately
```bash
# Terminal 1: Start JSON Server
npm run server

# Terminal 2: Start Next.js Dev Server
npm run dev
```

## API Endpoints

The JSON Server provides the following REST API endpoints:

### Days
- `GET /days` - Get all days
- `GET /days/:date` - Get specific day by date
- `PUT /days/:date` - Update a day
- `POST /days` - Create a new day

### Workouts
Workouts are nested under days, so they're managed through the day endpoints.

### Example API Calls

```bash
# Get all days
curl http://localhost:3002/days

# Get specific day
curl http://localhost:3002/days/2024-01-08

# Update a day (this will update workouts and exercises)
curl -X PUT http://localhost:3002/days/2024-01-08 \
  -H "Content-Type: application/json" \
  -d '{"id":"2024-01-08","date":"2024-01-08","workouts":[...]}'
```

## Data Structure

The mock data is stored in `db.json` and includes:

- **Days**: Calendar days with associated workouts
- **Workouts**: Exercise sessions with metadata
- **Exercises**: Individual exercises with sets, reps, weight, etc.

## Features

### ✅ Working Features
- **Drag and Drop**: Exercises can be reordered within workouts
- **CRUD Operations**: Create, read, update, delete workouts and exercises
- **Data Persistence**: Changes are saved to the JSON file
- **Real-time Updates**: UI updates immediately after API calls
- **Error Handling**: Graceful fallback to generated data if API fails

### 🎯 Drag and Drop
- **Exercise Reordering**: Drag exercises within a workout to reorder them
- **Visual Feedback**: Dragged items show opacity and drop targets are highlighted
- **Persistence**: Order changes are saved to the API

## Development

### Adding New Data
Edit `db.json` directly to add new days, workouts, or exercises. The JSON Server will automatically reload.

### API Client
The application uses a custom API client (`src/lib/api.ts`) that provides:
- Type-safe API calls
- Error handling
- Automatic data transformation

### React Query Integration
All API calls are managed through React Query for:
- Caching
- Background updates
- Optimistic updates
- Error handling

## Troubleshooting

### Port Conflicts
If you get port conflicts:
1. Check what's running: `lsof -i :3002` or `lsof -i :3000`
2. Kill conflicting processes: `pkill -f "json-server"` or `pkill -f "next"`
3. Restart the servers

### API Connection Issues
1. Verify JSON Server is running: `curl http://localhost:3002/days`
2. Check browser console for CORS or network errors
3. Ensure both servers are running on correct ports

### Data Not Persisting
1. Check if `db.json` is writable
2. Verify JSON Server has write permissions
3. Check JSON Server logs for errors
