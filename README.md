# Workout Calendar

A Next.js application for managing workout training schedules with drag-and-drop functionality.

## Features

- **Weekly Calendar View**: Shows Monday through Sunday with proper date display
- **Today Highlighting**: Current day is highlighted in purple and bolded
- **Drag & Drop Workouts**: Move workouts between different days
- **Drag & Drop Exercises**: Reorder exercises within workouts
- **Workout Management**:
  - Purple workout names with truncation for long names
  - Exercise details with set information (e.g., "50 lb x 5, 60 lb x 5, 70 lb x 5")
  - Set count display (e.g., "3x")
- **Responsive Design**: Clean, modern UI matching the provided design

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **@dnd-kit** for drag-and-drop functionality
- **Lucide React** for icons
- **Bun** for package management

## Getting Started

1. Install dependencies:

   ```bash
   bun install
   ```

2. Start the development server:

   ```bash
   bun run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- **View Workouts**: Each day shows available workouts with exercise details
- **Drag Workouts**: Click and drag workout cards to move them between days
- **Edit Workouts**: Click on a workout to open the detailed editor
- **Reorder Exercises**: Within the workout editor, drag exercises to reorder them
- **Add/Edit Exercises**: Use the workout editor to add new exercises or modify existing ones

## Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── Calendar.tsx     # Main calendar component
│   ├── DayColumn.tsx    # Individual day column
│   ├── WorkoutCard.tsx  # Workout display card
│   ├── WorkoutModal.tsx # Workout editor modal
│   ├── ExerciseItem.tsx # Exercise display/editor
│   └── AddExerciseForm.tsx # Add new exercise form
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Documentation

This project includes comprehensive documentation to help you understand and work with the codebase:

- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Complete setup guide with prerequisites, installation, and troubleshooting
- **[IMPLEMENTATION_APPROACH.md](./IMPLEMENTATION_APPROACH.md)** - Detailed technical implementation approach and architecture decisions
- **[API_SETUP.md](./API_SETUP.md)** - JSON Server setup and API integration guide
- **[MODULAR_ARCHITECTURE.md](./MODULAR_ARCHITECTURE.md)** - Modular architecture documentation and component structure
- **[DOCKER.md](./DOCKER.md)** - Docker setup and deployment instructions
- **[test-execution-guide.md](./test-execution-guide.md)** - Comprehensive testing guide with test scenarios and execution instructions

## Build

To create a production build:

```bash
bun run build
```

To start the production server:

```bash
bun run start
```

## Deployment

### Vercel Deployment

This application is configured for easy deployment on Vercel:

1. **Automatic API Routes**: The app uses Next.js API routes in production, so no external API server is needed
2. **Environment Configuration**: 
   - Local development: Uses JSON server on `localhost:3002`
   - Production: Uses Next.js API routes at `/api`
3. **Database**: Uses `db.json` file for data persistence

#### Deploy to Vercel:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and configure the build
3. No additional environment variables needed - the app automatically uses API routes in production
4. Your app will be available at `https://your-app-name.vercel.app`

#### Local Development:

For local development, you can still use the JSON server:

```bash
# Terminal 1: Start JSON server
npm run server

# Terminal 2: Start Next.js dev server
npm run dev
```

The app will automatically detect the environment and use the appropriate API endpoint.
