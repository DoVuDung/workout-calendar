'use client';

import { CalendarView, useCalendarData, useUpdateCalendarData } from '@/modules/calendar';
import { WorkoutModalView, useCreateWorkout, useUpdateWorkout, useDeleteWorkout, useMoveWorkout, useReorderWorkout } from '@/modules/workout';
import { LoadingView, ErrorView } from '@/modules/shared';
import { Day, Workout } from '@/types';
import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { forceRefreshCalendarData } from '@/utils/cacheUtils';
import { StorageWarning } from '@/components/StorageWarning';

export default function Home() {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewWorkout, setIsNewWorkout] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Use React Query hooks
  const queryClient = useQueryClient();
  const { data: calendarData, isLoading, error, refetch } = useCalendarData(currentDate);
  const updateCalendarMutation = useUpdateCalendarData();
  const createWorkoutMutation = useCreateWorkout();
  const updateWorkoutMutation = useUpdateWorkout();
  const deleteWorkoutMutation = useDeleteWorkout();
  const moveWorkoutMutation = useMoveWorkout();
  const reorderWorkoutMutation = useReorderWorkout();
  const { toast } = useToast();

  // Refetch data when currentDate changes
  useEffect(() => {
    refetch();
  }, [currentDate, refetch]);

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

    let sourceDayId = '';
    let workout: Workout | null = null;

    // Find the workout and its source day
    for (const day of calendarData) {
      const foundWorkout = day.workouts.find(w => w.id === workoutId);
      if (foundWorkout) {
        sourceDayId = day.date;
        workout = foundWorkout;
        break;
      }
    }

    // Only move if it's to a different day
    if (sourceDayId && sourceDayId !== targetDayId && workout) {
      // Check if target day is in the past
      const targetDate = new Date(targetDayId);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      targetDate.setHours(0, 0, 0, 0); // Reset time to start of day
      
      
      if (targetDate < today) {
        toast({
          title: "Cannot Move to Past Date",
          description: "Workouts cannot be moved to past dates. Please select a current or future date.",
          variant: "destructive",
        });
        return;
      }

      // Check if target day is full
      const targetDay = calendarData.find(day => day.date === targetDayId);
      if (targetDay && targetDay.workouts.length >= 5) {
        toast({
          title: "Day is Full",
          description: "Cannot move workout. The target day already has the maximum number of workouts (5).",
          variant: "destructive",
        });
        return;
      }

      // Call API to move workout
      moveWorkoutMutation.mutate({
        workoutId: workoutId,
        fromDayId: sourceDayId,
        toDayId: targetDayId,
      }, {
        onSuccess: () => {
          // Use aggressive cache refresh utility
          forceRefreshCalendarData(queryClient);
        },
        onError: (error) => {
          toast({
            title: "Move Failed",
            description: `Failed to move workout: ${error.message}`,
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleWorkoutReorder = (dayId: string, activeWorkoutId: string, overWorkoutId: string) => {
    if (!calendarData) return;

    const day = calendarData.find(d => d.date === dayId);
    if (!day) return;

    const overIndex = day.workouts.findIndex(w => w.id === overWorkoutId);

    if (overIndex !== -1) {
      // Call API to reorder workout
      reorderWorkoutMutation.mutate({
        dayDate: dayId,
        workoutId: activeWorkoutId,
        targetIndex: overIndex,
      }, {
        onSuccess: () => {
          // Use aggressive cache refresh utility
          forceRefreshCalendarData(queryClient);
        },
      });
    }
  };

  const handleMoveWorkout = (workoutId: string) => {
    if (!calendarData) return;

    // Find the workout and its current day
    let sourceDayId = '';
    for (const day of calendarData) {
      const foundWorkout = day.workouts.find(w => w.id === workoutId);
      if (foundWorkout) {
        sourceDayId = day.date;
        break;
      }
    }

    if (!sourceDayId) return;

    // Simple implementation: show available days to move to
    const availableDays = calendarData.filter(day => {
      // Can't move to the same day
      if (day.date === sourceDayId) return false;
      
      // Can't move to past dates
      const dayDate = new Date(day.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dayDate < today) return false;
      
      // Can't move to full days
      if (day.workouts.length >= 5) return false;
      
      return true;
    });

    if (availableDays.length === 0) {
      toast({
        title: "No Available Days",
        description: "No available days to move this workout to. All other days are either full or in the past.",
        variant: "destructive",
      });
      return;
    }

    // For now, move to the first available day
    // In a real app, you'd show a date picker or day selector
    const targetDay = availableDays[0];
    
    moveWorkoutMutation.mutate({
      workoutId: workoutId,
      fromDayId: sourceDayId,
      toDayId: targetDay.date,
    }, {
      onSuccess: () => {
        refetch();
        toast({
          title: "Workout Moved",
          description: `Workout moved to ${new Date(targetDay.date).toLocaleDateString()}`,
          variant: "success",
        });
      },
      onError: (error) => {
        toast({
          title: "Move Failed",
          description: `Failed to move workout: ${error.message}`,
          variant: "destructive",
        });
      },
    });
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
    setIsNewWorkout(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWorkout(null);
    setSelectedDayId(null);
    setIsNewWorkout(false);
  };

  const handleUpdateWorkout = (updatedWorkout: Workout) => {
    if (selectedDayId) {
      // This is a new workout being created
      createWorkoutMutation.mutate({ workoutData: updatedWorkout, dayDate: selectedDayId }, {
        onSuccess: () => {
          handleCloseModal();
          refetch();
        },
      });
    } else {
      // This is an existing workout being updated - we need to find the day
      const dayWithWorkout = calendarData?.find(day => 
        day.workouts.some(workout => workout.id === updatedWorkout.id)
      );
      if (dayWithWorkout) {
        updateWorkoutMutation.mutate({ workout: updatedWorkout, dayDate: dayWithWorkout.date }, {
          onSuccess: () => {
            handleCloseModal();
            refetch();
          },
        });
      }
    }
  };

  const handleDeleteWorkout = (workoutId: string) => {
    const dayWithWorkout = calendarData?.find(day => 
      day.workouts.some(workout => workout.id === workoutId)
    );
    
    if (dayWithWorkout) {
      deleteWorkoutMutation.mutate({ workoutId, dayDate: dayWithWorkout.date }, {
        onSuccess: () => {
          handleCloseModal();
          refetch();
        },
      });
    }
  };

  const handleAddWorkout = (dayId: string) => {
    const newWorkout: Workout = {
      id: `workout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      exercises: [],
      duration: 0,
      difficulty: 'beginner',
      color: '#5A57CB',
    };

    setSelectedDayId(dayId);
    setSelectedWorkout(newWorkout);
    setIsNewWorkout(true);
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
              <h1 className="text-2xl font-bold" style={{ color: '#5A57CB' }}>Muscle Track</h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setDate(currentDate.getDate() - 7);
                    setCurrentDate(newDate);
                  }}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Previous week"
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
                  aria-label="Next week"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <StorageWarning />
          <CalendarView
            days={calendarData}
            onWorkoutClick={handleWorkoutClick}
            onWorkoutDrop={handleWorkoutDrop}
            onWorkoutReorder={handleWorkoutReorder}
            onAddWorkout={handleAddWorkout}
            onMoveWorkout={handleMoveWorkout}
          />
        </main>

        {isModalOpen && selectedWorkout && (
          <WorkoutModalView
            workout={selectedWorkout}
            onClose={handleCloseModal}
            onUpdate={handleUpdateWorkout}
            onDelete={handleDeleteWorkout}
            onExerciseDrop={handleExerciseDrop}
            isNewWorkout={isNewWorkout}
          />
        )}
      </div>
    </DndProvider>
  );
}