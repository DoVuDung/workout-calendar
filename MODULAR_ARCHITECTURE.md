# Modular Architecture Documentation

## Overview

The workout calendar application has been refactored into a micro frontend architecture with a modular structure. Each module contains its own views and queries, making the codebase more maintainable and scalable.

## Architecture

```
src/
├── modules/
│   ├── calendar/
│   │   ├── views/
│   │   │   ├── CalendarView.tsx
│   │   │   └── DayColumnView.tsx
│   │   ├── queries/
│   │   │   └── useCalendarData.ts
│   │   └── index.ts
│   ├── workout/
│   │   ├── views/
│   │   │   ├── WorkoutCardView.tsx
│   │   │   ├── WorkoutModalView.tsx
│   │   │   ├── ExerciseItemView.tsx
│   │   │   └── AddExerciseFormView.tsx
│   │   ├── queries/
│   │   │   └── useWorkoutData.ts
│   │   └── index.ts
│   ├── shared/
│   │   ├── views/
│   │   │   ├── LoadingView.tsx
│   │   │   └── ErrorView.tsx
│   │   ├── queries/
│   │   │   └── useApiClient.ts
│   │   └── index.ts
│   └── index.ts
├── providers/
│   └── QueryProvider.tsx
└── app/
    ├── layout.tsx
    └── page.tsx
```

## Module Structure

### Calendar Module (`src/modules/calendar/`)

**Purpose**: Handles calendar display and week navigation

**Views**:
- `CalendarView.tsx` - Main calendar grid with responsive layout
- `DayColumnView.tsx` - Individual day column with drag-and-drop support

**Queries**:
- `useCalendarData.ts` - React Query hooks for calendar data management
  - `useCalendarData()` - Fetch calendar data for a specific week
  - `useUpdateCalendarData()` - Update calendar data (drag and drop)
  - `useDayData()` - Get specific day data

### Workout Module (`src/modules/workout/`)

**Purpose**: Manages workout and exercise functionality

**Views**:
- `WorkoutCardView.tsx` - Individual workout card display
- `WorkoutModalView.tsx` - Modal for editing workouts
- `ExerciseItemView.tsx` - Individual exercise item with editing
- `AddExerciseFormView.tsx` - Form for adding new exercises

**Queries**:
- `useWorkoutData.ts` - React Query hooks for workout management
  - `useWorkout()` - Get workout by ID
  - `useWorkoutsForDay()` - Get workouts for a specific day
  - `useCreateWorkout()` - Create new workout
  - `useUpdateWorkout()` - Update existing workout
  - `useDeleteWorkout()` - Delete workout
  - `useMoveWorkout()` - Move workout between days

### Shared Module (`src/modules/shared/`)

**Purpose**: Common components and utilities used across modules

**Views**:
- `LoadingView.tsx` - Loading spinner component
- `ErrorView.tsx` - Error display component

**Queries**:
- `useApiClient.ts` - API client configuration and utilities

## Key Features

### React Query Integration

- **Caching**: Automatic caching of API responses
- **Background Updates**: Automatic refetching of stale data
- **Optimistic Updates**: Immediate UI updates with rollback on error
- **Loading States**: Built-in loading and error states

### Responsive Design

- **Desktop**: 7-column horizontal grid layout
- **Mobile/Tablet**: Vertical stacked layout
- **Breakpoint**: `lg` (1024px) for layout switching

### Drag and Drop

- **Workouts**: Can be dragged between days
- **Exercises**: Can be reordered within workouts
- **Visual Feedback**: Drag states and drop zones

## Usage Examples

### Using Calendar Module

```tsx
import { CalendarView, useCalendarData } from '@/modules/calendar';

function MyComponent() {
  const { data: calendarData, isLoading } = useCalendarData(new Date());
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <CalendarView
      days={calendarData}
      onWorkoutClick={handleWorkoutClick}
      onWorkoutDrop={handleWorkoutDrop}
      onAddWorkout={handleAddWorkout}
    />
  );
}
```

### Using Workout Module

```tsx
import { WorkoutModalView, useUpdateWorkout } from '@/modules/workout';

function MyComponent() {
  const updateWorkout = useUpdateWorkout();
  
  const handleUpdate = (workout) => {
    updateWorkout.mutate(workout);
  };
  
  return (
    <WorkoutModalView
      workout={selectedWorkout}
      onUpdate={handleUpdate}
      onClose={handleClose}
      onDelete={handleDelete}
      onExerciseDrop={handleExerciseDrop}
    />
  );
}
```

## Benefits

1. **Separation of Concerns**: Each module handles its own domain
2. **Reusability**: Components can be easily reused across the application
3. **Maintainability**: Changes to one module don't affect others
4. **Scalability**: Easy to add new modules or extend existing ones
5. **Testing**: Each module can be tested independently
6. **Performance**: React Query provides efficient data management
7. **Developer Experience**: Clear structure and consistent patterns

## Future Enhancements

- **API Integration**: Replace mock data with real API calls
- **State Management**: Add global state management if needed
- **Module Federation**: Split modules into separate micro frontends
- **Testing**: Add comprehensive unit and integration tests
- **Documentation**: Add Storybook for component documentation
