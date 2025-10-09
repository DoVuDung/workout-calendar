'use client';

import { Button } from '@/components/ui/button';
import { Day, Workout } from '@/types';
import Link from 'next/link';
import { useDrop } from 'react-dnd';
import { MdAdd } from 'react-icons/md';
import { WorkoutCardView } from '../../workout/views/WorkoutCardView';

interface DayColumnViewProps {
  day: Day;
  dayName: string;
  onWorkoutClick: (workout: Workout) => void;
  onWorkoutDrop: (workoutId: string, targetDayId: string) => void;
  onWorkoutReorder: (dayId: string, activeWorkoutId: string, overWorkoutId: string) => void;
  onAddWorkout: (dayId: string) => void;
  onMoveWorkout: (workoutId: string) => void;
}

export function DayColumnView({
  day,
  dayName,
  onWorkoutClick,
  onWorkoutDrop,
  onWorkoutReorder,
  onAddWorkout,
  onMoveWorkout,
}: DayColumnViewProps) {
  const [{ isOver }, drop] = useDrop({
    accept: 'workout',
    drop: (item: { id: string }) => {
      onWorkoutDrop(item.id, day.date);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleWorkoutReorder = (activeWorkoutId: string, overWorkoutId: string) => {
    onWorkoutReorder(day.date, activeWorkoutId, overWorkoutId);
  };

  const date = new Date(day.date);
  const dayNumber = date.getDate();
  const isToday = date.toDateString() === new Date().toDateString();
  const isCurrentMonth = date.getMonth() === new Date().getMonth();
  
  // Define maximum workouts per day
  const MAX_WORKOUTS_PER_DAY = 5;
  const isDayFull = day.workouts.length >= MAX_WORKOUTS_PER_DAY;

  return (
    <div
      ref={drop as any}
      className={`
        relative w-full h-full bg-[#F3F5F8] rounded-lg flex flex-col
        ${isOver ? 'bg-accent/50' : ''}
        ${!isCurrentMonth ? 'bg-muted/50 text-muted-foreground' : ''}
      `}
    >
      {/* Day Header with integrated date */}
      <div className="rounded-t-lg p-3 relative flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Show day name on mobile/tablet, hide on desktop */}
          <span className="lg:hidden text-[#6A7988] font-sans font-bold text-[10px] leading-none tracking-normal uppercase">
            {dayName}
          </span>
          <Link
            href={`/day/${day.date}`}
            className={`
              font-sans font-semibold text-[11px] leading-none tracking-normal px-2 py-1 rounded
              ${isToday ? 'text-purple-600 font-bold bg-[#F3F5F8]' : isCurrentMonth ? 'text-[#6A7988]' : 'text-muted-foreground'}
            `}
          >
            {dayNumber}
          </Link>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className={`rounded-full w-6 h-6 p-0 ${
            isDayFull 
              ? 'bg-gray-200 cursor-not-allowed opacity-50' 
              : 'bg-gray-300 hover:bg-gray-400'
          }`}
          disabled={isDayFull}
          onClick={(e) => {
            e.stopPropagation();
            if (!isDayFull) {
              onAddWorkout(day.date);
            }
          }}
          title={isDayFull ? `Maximum ${MAX_WORKOUTS_PER_DAY} workouts per day` : 'Add workout'}
          aria-label={isDayFull ? `Maximum ${MAX_WORKOUTS_PER_DAY} workouts per day` : 'Add workout'}
        >
          <MdAdd className="w-3 h-3 text-white" />
        </Button>
      </div>

      {/* Content Area */}
      <div className="p-3 space-y-3 flex-1 overflow-y-auto">
        {day.workouts.map(workout => (
          <WorkoutCardView
            key={workout.id}
            workout={workout}
            onClick={() => onWorkoutClick(workout)}
            onWorkoutReorder={handleWorkoutReorder}
            onMoveWorkout={onMoveWorkout}
          />
        ))}
        
        {/* Show full day indicator */}
        {isDayFull && (
          <div className="text-center py-2">
            <div className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1 inline-block">
              Day Full ({day.workouts.length}/{MAX_WORKOUTS_PER_DAY})
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
