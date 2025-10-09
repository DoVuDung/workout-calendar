'use client';

import { useState, useEffect } from 'react';
import { DayDetailView } from '@/components/DayDetailView';
import { Day, Workout } from '@/types';
import { useDayData, useUpdateCalendarData } from '@/modules/calendar';
import { useUpdateWorkout } from '@/modules/workout';
import { useMoveExercise } from '@/modules/workout';
import { DumbbellLoader } from '@/components/ui/DumbbellLoader';

interface DayPageProps {
  params: {
    date: string;
  };
}

export default function DayPage({ params }: DayPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Use React Query hooks for data management
  const { data: day, isLoading, error, refetch } = useDayData(params.date);
  const updateCalendarMutation = useUpdateCalendarData();
  const updateWorkoutMutation = useUpdateWorkout();
  const moveExerciseMutation = useMoveExercise();

  const handleWorkoutUpdate = (updatedWorkout: Workout) => {
    if (day) {
      // Update the workout using the mutation
      updateWorkoutMutation.mutate({ workout: updatedWorkout, dayDate: day.date }, {
        onSuccess: () => {
          // Refetch the day data to get the updated state
          refetch();
        },
      });
    }
  };

  const handleExerciseDrop = (
    activeExerciseId: string,
    overExerciseId: string,
    workoutId: string
  ) => {
    if (day) {
      const workout = day.workouts.find(w => w.id === workoutId);
      if (workout) {
        const activeIndex = workout.exercises.findIndex(
          ex => ex.id === activeExerciseId
        );
        const overIndex = workout.exercises.findIndex(
          ex => ex.id === overExerciseId
        );

        if (activeIndex !== -1 && overIndex !== -1) {
          moveExerciseMutation.mutate({
            dayDate: day.date,
            workoutId: workout.id,
            exerciseId: activeExerciseId,
            targetIndex: overIndex,
          }, {
            onSuccess: () => {
              refetch();
            },
          });
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <DumbbellLoader size="lg" message="Loading day data..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Error loading day
          </h1>
          <p className="text-gray-600 mb-4">Failed to load the requested day.</p>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!day) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Day not found
          </h1>
          <p className="text-gray-600">The requested day could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <DayDetailView
      day={day}
      onWorkoutUpdate={handleWorkoutUpdate}
      onExerciseDrop={handleExerciseDrop}
    />
  );
}
