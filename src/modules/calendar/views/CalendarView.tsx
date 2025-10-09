'use client';

import { Day, Workout } from '@/types';
import { DayColumnView } from './DayColumnView';

interface CalendarViewProps {
  days: Day[];
  onWorkoutClick: (workout: Workout) => void;
  onWorkoutDrop: (workoutId: string, targetDayId: string) => void;
  onWorkoutReorder: (dayId: string, activeWorkoutId: string, overWorkoutId: string) => void;
  onAddWorkout: (dayId: string) => void;
  onMoveWorkout: (workoutId: string) => void;
}

export function CalendarView({
  days,
  onWorkoutClick,
  onWorkoutDrop,
  onWorkoutReorder,
  onAddWorkout,
  onMoveWorkout,
}: CalendarViewProps) {
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
        <div className="grid grid-cols-7 gap-4 min-h-[600px] items-stretch">
          {days.map((day, index) => (
            <DayColumnView
              key={day.date}
              day={day}
              dayName={weekDays[index]}
              onWorkoutClick={onWorkoutClick}
              onWorkoutDrop={onWorkoutDrop}
              onWorkoutReorder={onWorkoutReorder}
              onAddWorkout={onAddWorkout}
              onMoveWorkout={onMoveWorkout}
            />
          ))}
        </div>
      </div>

      {/* Mobile/Tablet Layout - Vertical Stack */}
      <div className="lg:hidden space-y-4">
        {days.map((day, index) => (
          <DayColumnView
            key={day.date}
            day={day}
            dayName={weekDays[index]}
            onWorkoutClick={onWorkoutClick}
            onWorkoutDrop={onWorkoutDrop}
            onWorkoutReorder={onWorkoutReorder}
            onAddWorkout={onAddWorkout}
            onMoveWorkout={onMoveWorkout}
          />
        ))}
      </div>
    </div>
  );
}
