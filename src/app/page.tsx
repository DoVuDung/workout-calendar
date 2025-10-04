'use client';

import { Calendar } from '@/components/Calendar';
import { WorkoutModal } from '@/components/WorkoutModal';
import { Day, Workout } from '@/types';
import { generateCalendarData } from '@/utils/calendarUtils';
import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function Home() {
  const [calendarData, setCalendarData] = useState<Day[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

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
    const year = startOfWeek.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${startOfWeek.getDate()}-${endOfWeek.getDate()}, ${year}`;
    } else {
      return `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${year}`;
    }
  };

  useEffect(() => {
    const data = generateCalendarData(currentDate);
    setCalendarData(data);
  }, [currentDate]);

  const handleWorkoutDrop = (workoutId: string, targetDayId: string) => {
    moveWorkoutBetweenDays(workoutId, targetDayId);
  };

  const handleExerciseDrop = (
    activeExerciseId: string,
    overExerciseId: string
  ) => {
    moveExerciseWithinWorkout(activeExerciseId, overExerciseId);
  };

  const moveWorkoutBetweenDays = (workoutId: string, targetDayId: string) => {
    setCalendarData(prevData => {
      const newData = [...prevData];

      // Find source day and workout
      let sourceDayIndex = -1;
      let workoutIndex = -1;
      let workout: Workout | null = null;

      for (let i = 0; i < newData.length; i++) {
        const day = newData[i];
        const index = day.workouts.findIndex(w => w.id === workoutId);
        if (index !== -1) {
          sourceDayIndex = i;
          workoutIndex = index;
          workout = day.workouts[index];
          break;
        }
      }

      if (!workout || sourceDayIndex === -1) return prevData;

      // Remove workout from source day
      newData[sourceDayIndex].workouts.splice(workoutIndex, 1);

      // Add workout to target day
      const targetDayIndex = newData.findIndex(day => day.date === targetDayId);
      if (targetDayIndex !== -1) {
        newData[targetDayIndex].workouts.push(workout);
      }

      return newData;
    });
  };

  const moveExerciseWithinWorkout = (
    activeExerciseId: string,
    overExerciseId: string
  ) => {
    setCalendarData(prevData => {
      const newData = [...prevData];

      // Find the workout containing these exercises
      for (const day of newData) {
        for (const workout of day.workouts) {
          const activeIndex = workout.exercises.findIndex(
            e => e.id === activeExerciseId
          );
          const overIndex = workout.exercises.findIndex(
            e => e.id === overExerciseId
          );

          if (activeIndex !== -1 && overIndex !== -1) {
            // Swap exercises
            const [movedExercise] = workout.exercises.splice(activeIndex, 1);
            workout.exercises.splice(overIndex, 0, movedExercise);
            return newData;
          }
        }
      }

      return prevData;
    });
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
    setCalendarData(prevData => {
      const newData = [...prevData];
      let workoutFound = false;

      // First, try to find and update existing workout
      for (const day of newData) {
        const workoutIndex = day.workouts.findIndex(
          w => w.id === updatedWorkout.id
        );
        if (workoutIndex !== -1) {
          day.workouts[workoutIndex] = updatedWorkout;
          workoutFound = true;
          break;
        }
      }

      // If workout not found, it's a new workout that needs to be added
      if (!workoutFound && selectedDayId) {
        const dayIndex = newData.findIndex(day => day.date === selectedDayId);
        if (dayIndex !== -1) {
          newData[dayIndex].workouts.push(updatedWorkout);
        }
      }

      return newData;
    });

    handleCloseModal();
  };

  const handleDeleteWorkout = (workoutId: string) => {
    setCalendarData(prevData => {
      const newData = [...prevData];

      for (const day of newData) {
        const workoutIndex = day.workouts.findIndex(w => w.id === workoutId);
        if (workoutIndex !== -1) {
          day.workouts.splice(workoutIndex, 1);
          break;
        }
      }

      return newData;
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

    // Store the day ID for when the workout is saved
    setSelectedDayId(dayId);
    
    // Open the modal for the new workout without adding it to calendar yet
    setSelectedWorkout(newWorkout);
    setIsModalOpen(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-white">
        <header className="bg-white">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-[#0A84FF]">MuscleMap</h1>
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
          <Calendar
            days={calendarData}
            onWorkoutClick={handleWorkoutClick}
            onWorkoutDrop={handleWorkoutDrop}
            onAddWorkout={handleAddWorkout}
          />
        </main>

        {isModalOpen && selectedWorkout && (
          <WorkoutModal
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
