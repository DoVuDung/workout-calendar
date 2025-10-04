'use client';

import { CalendarView, useCalendarData, useUpdateCalendarData } from '@/modules/calendar';
import { WorkoutModalView, useCreateWorkout, useUpdateWorkout, useDeleteWorkout, useMoveWorkout } from '@/modules/workout';
import { LoadingView, ErrorView } from '@/modules/shared';
import { Day, Workout } from '@/types';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function Home() {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Use React Query hooks
  const { data: calendarData, isLoading, error, refetch } = useCalendarData(currentDate);
  const updateCalendarMutation = useUpdateCalendarData();
  const createWorkoutMutation = useCreateWorkout();
  const updateWorkoutMutation = useUpdateWorkout();
  const deleteWorkoutMutation = useDeleteWorkout();
  const moveWorkoutMutation = useMoveWorkout();

  const getWeekRange = (date: Date) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startMonth = startOfWeek.toLocaleDateString('en-US', {
      month: 'short',
    });
    const endMonth = endOfWeek.toLocaleDateString('en-US', { month: 'short' });
    const startDay = startOfWeek.getDate();
    const endDay = endOfWeek.getDate();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
  };

  const handleWorkoutDrop = (workoutId: string, targetDayId: string) => {
    if (!calendarData) return;

    const newData = [...calendarData];
    let sourceDayIndex = -1;
    let targetDayIndex = -1;
    let workoutIndex = -1;
    let workout: Workout | null = null;

    // Find the workout and its source day
    for (let i = 0; i < newData.length; i++) {
      const day = newData[i];
      const foundIndex = day.workouts.findIndex(w => w.id === workoutId);
      if (foundIndex !== -1) {
        sourceDayIndex = i;
        workoutIndex = foundIndex;
        workout = day.workouts[foundIndex];
        break;
      }
    }

    // Find the target day
    targetDayIndex = newData.findIndex(day => day.date === targetDayId);

    if (sourceDayIndex !== -1 && targetDayIndex !== -1 && workout) {
      // Remove workout from source day
      newData[sourceDayIndex].workouts.splice(workoutIndex, 1);
      
      // Add workout to target day
      newData[targetDayIndex].workouts.push(workout);

      // Update calendar data
      updateCalendarMutation.mutate({ date: currentDate, updatedData: newData });
    }
  };

  const handleExerciseDrop = (exerciseId: string, targetWorkoutId: string, targetIndex: number) => {
    if (!selectedWorkout) return;

    const exerciseIndex = selectedWorkout.exercises.findIndex(ex => ex.id === exerciseId);
    if (exerciseIndex === -1) return;

    const newExercises = [...selectedWorkout.exercises];
    const [movedExercise] = newExercises.splice(exerciseIndex, 1);
    newExercises.splice(targetIndex, 0, movedExercise);

    const updatedWorkout = {
      ...selectedWorkout,
      exercises: newExercises,
    };

    setSelectedWorkout(updatedWorkout);
  };

  const handleWorkoutClick = (workout: Workout) => {
    setSelectedWorkout(workout);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWorkout(null);
    setSelectedDayId(null);
  };

  const handleUpdateWorkout = (updatedWorkout: Workout) => {
    if (selectedDayId) {
      // This is a new workout being created
      createWorkoutMutation.mutate(updatedWorkout, {
        onSuccess: () => {
          handleCloseModal();
          refetch();
        },
      });
    } else {
      // This is an existing workout being updated
      updateWorkoutMutation.mutate(updatedWorkout, {
        onSuccess: () => {
          handleCloseModal();
          refetch();
        },
      });
    }
  };

  const handleDeleteWorkout = (workoutId: string) => {
    deleteWorkoutMutation.mutate(workoutId, {
      onSuccess: () => {
        handleCloseModal();
        refetch();
      },
    });
  };

  const handleAddWorkout = (dayId: string) => {
    const newWorkout: Workout = {
      id: `workout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: 'New Workout',
      exercises: [],
      duration: 60,
      difficulty: 'intermediate',
      color: '#5A57CB',
    };

    setSelectedDayId(dayId);
    setSelectedWorkout(newWorkout);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <LoadingView message="Loading calendar..." />;
  }

  if (error) {
    return <ErrorView message="Failed to load calendar data" onRetry={() => refetch()} />;
  }

  if (!calendarData) {
    return <ErrorView message="No calendar data available" onRetry={() => refetch()} />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-white">
        <header className="bg-white">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-blue-600">Muscle Track</h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setDate(currentDate.getDate() - 7);
                    setCurrentDate(newDate);
                  }}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  ←
                </button>
                <span className="text-lg font-semibold text-muted-foreground">
                  {getWeekRange(currentDate)}
                </span>
                <button
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setDate(currentDate.getDate() + 7);
                    setCurrentDate(newDate);
                  }}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <CalendarView
            days={calendarData}
            onWorkoutClick={handleWorkoutClick}
            onWorkoutDrop={handleWorkoutDrop}
            onAddWorkout={handleAddWorkout}
          />
        </main>

        {isModalOpen && selectedWorkout && (
          <WorkoutModalView
            workout={selectedWorkout}
            onClose={handleCloseModal}
            onUpdate={handleUpdateWorkout}
            onDelete={handleDeleteWorkout}
            onExerciseDrop={handleExerciseDrop}
          />
        )}
      </div>
    </DndProvider>
  );
}