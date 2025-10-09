# Getting Started Guide - Workout Calendar

This guide will help you get the Workout Calendar application up and running on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **Bun** (recommended package manager) - [Install Bun](https://bun.sh/docs/installation)
- **Git** (for cloning the repository)

### Alternative Package Managers

If you prefer not to use Bun, you can also use:
- **npm** (comes with Node.js)
- **yarn** (install with `npm install -g yarn`)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd workout-calendar
```

### 2. Install Dependencies

Using Bun (recommended):
```bash
bun install
```

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

### 3. Start the Development Server

Using Bun:
```bash
bun run dev
```

Using npm:
```bash
npm run dev
```

Using yarn:
```bash
yarn dev
```

### 4. Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run format` | Format code with Prettier |
| `bun run format:check` | Check code formatting |

## Docker Setup (Alternative)

If you prefer to use Docker, you can run the application in a container:

### Using Docker Compose (Recommended)

```bash
# Build and start the application
docker-compose up --build

# Run in detached mode (background)
docker-compose up -d --build

# Stop the application
docker-compose down
```

### Using Docker directly

```bash
# Build the image
docker build -t workout-calendar .

# Run the container
docker run -p 3000:3000 workout-calendar
```

## Project Structure

```
workout-calendar/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   ├── day/[date]/        # Dynamic day pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/                # Reusable UI components
│   │   ├── Calendar.tsx       # Main calendar component
│   │   ├── DayColumn.tsx      # Individual day column
│   │   ├── WorkoutCard.tsx    # Workout display card
│   │   ├── WorkoutModal.tsx   # Workout editor modal
│   │   ├── ExerciseItem.tsx   # Exercise display/editor
│   │   └── AddExerciseForm.tsx # Add new exercise form
│   ├── modules/               # Modular architecture
│   │   ├── calendar/          # Calendar module
│   │   ├── workout/           # Workout module
│   │   └── shared/            # Shared utilities
│   ├── providers/             # React context providers
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── public/                    # Static assets
├── package.json              # Dependencies and scripts
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
└── docker-compose.yml        # Docker Compose configuration
```

## Features Overview

- **Weekly Calendar View**: Monday through Sunday with proper date display
- **Today Highlighting**: Current day is highlighted in purple and bolded
- **Drag & Drop Workouts**: Move workouts between different days
- **Drag & Drop Exercises**: Reorder exercises within workouts
- **Workout Management**: 
  - Purple workout names with truncation for long names
  - Exercise details with set information (e.g., "50 lb x 5, 60 lb x 5, 70 lb x 5")
  - Set count display (e.g., "3x")
- **Responsive Design**: Clean, modern UI that works on all devices

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React DnD** for drag-and-drop functionality
- **React Icons** for icons
- **TanStack Query** for data fetching
- **Bun** for package management (optional)

## Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   # Kill process using port 3000
   lsof -ti:3000 | xargs kill -9
   
   # Or use a different port
   bun run dev -- -p 3001
   ```

2. **Dependencies not installing**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules bun.lockb
   bun install
   ```

3. **Build errors**
   ```bash
   # Check for TypeScript errors
   bun run lint
   
   # Format code
   bun run format
   ```

### Health Check

The application includes a health check endpoint at `/api/health` that returns:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## Next Steps

Once you have the application running:

1. **Explore the Calendar**: Navigate through different days to see the workout interface
2. **Try Drag & Drop**: Move workouts between days and reorder exercises
3. **Edit Workouts**: Click on workout cards to open the detailed editor
4. **Add Exercises**: Use the workout editor to add new exercises or modify existing ones

## Getting Help

If you encounter any issues:

1. Check the [README.md](./README.md) for more detailed information
2. Review the [DOCKER.md](./DOCKER.md) for Docker-specific setup
3. Check the console for error messages
4. Ensure all prerequisites are properly installed

## Development Tips

- The application uses a modular architecture - check the `src/modules/` directory
- Components are organized by feature in the `src/components/` directory
- TypeScript types are defined in `src/types/index.ts`
- Utility functions are in `src/utils/` and `src/lib/`
