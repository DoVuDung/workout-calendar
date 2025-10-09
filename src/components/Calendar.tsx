'use client';

import { Day, Workout } from '@/types';
import { DayColumn } from './DayColumn';

interface CalendarProps {
  days: Day[];
  onWorkoutClick: (workout: Workout) => void;
  onWorkoutDrop: (workoutId: string, targetDayId: string) => void;
  onWorkoutReorder: (dayId: string, activeWorkoutId: string, overWorkoutId: string) => void;
  onAddWorkout: (dayId: string) => void;
}

export function Calendar({
  days,
  onWorkoutClick,
  onWorkoutDrop,
  onWorkoutReorder,
  onAddWorkout,
}: CalendarProps) {
  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div className="bg-white">
      {/* Desktop Layout - Horizontal Grid */}
      <div className="hidden lg:block">
        {/* Day Names Header */}
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map(dayName => (
            <div key={dayName} className="p-3 text-left">
              <span className="text-[#6A7988] font-sans font-bold text-[10px] leading-none tracking-normal uppercase">
                {dayName}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4 min-h-[600px]">
          {days.map((day, index) => (
            <DayColumn
              key={day.date}
              day={day}
              dayName={weekDays[index]}
              onWorkoutClick={onWorkoutClick}
              onWorkoutDrop={onWorkoutDrop}
              onWorkoutReorder={onWorkoutReorder}
              onAddWorkout={onAddWorkout}
            />
          ))}
        </div>
      </div>

      {/* Mobile/Tablet Layout - Vertical Stack */}
      <div className="lg:hidden space-y-4">
        {days.map((day, index) => (
          <DayColumn
            key={day.date}
            day={day}
            dayName={weekDays[index]}
            onWorkoutClick={onWorkoutClick}
            onWorkoutDrop={onWorkoutDrop}
            onWorkoutReorder={onWorkoutReorder}
            onAddWorkout={onAddWorkout}
          />
        ))}
      </div>
    </div>
  );
}
