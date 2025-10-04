'use client';

import { useState, useEffect } from 'react';
import { DayDetailView } from '@/components/DayDetailView';
import { Day, Workout } from '@/types';
import { generateCalendarData } from '@/utils/calendarUtils';

interface DayPageProps {
  params: {
    date: string;
  };
}

export default function DayPage({ params }: DayPageProps) {
  const [day, setDay] = useState<Day | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const calendarData = generateCalendarData(currentDate);
    const foundDay = calendarData.find(d => d.date === params.date);
    setDay(foundDay || null);
  }, [params.date, currentDate]);

  const handleWorkoutUpdate = (updatedWorkout: Workout) => {
    if (day) {
      const updatedDay = {
        ...day,
        workouts: day.workouts.map(w =>
          w.id === updatedWorkout.id ? updatedWorkout : w
        ),
      };
      setDay(updatedDay);
    }
  };

  const handleExerciseDrop = (
    activeExerciseId: string,
    overExerciseId: string
  ) => {
    // This will be handled by the DayDetailView component
  };

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
