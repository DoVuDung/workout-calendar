'use client';

import { Button } from '@/components/ui/button';
import { Day, Workout } from '@/types';
import Link from 'next/link';
import { useDrop } from 'react-dnd';
import { MdAdd } from 'react-icons/md';
import { WorkoutCard } from './WorkoutCard';

interface DayColumnProps {
  day: Day;
  dayName: string;
  onWorkoutClick: (workout: Workout) => void;
  onWorkoutDrop: (workoutId: string, targetDayId: string) => void;
  onAddWorkout: (dayId: string) => void;
}

export function DayColumn({
  day,
  dayName,
  onWorkoutClick,
  onWorkoutDrop,
  onAddWorkout,
}: DayColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: 'workout',
    drop: (item: { id: string }) => {
      onWorkoutDrop(item.id, day.date);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });

  const date = new Date(day.date);
  const dayNumber = date.getDate();
  const isToday = date.toDateString() === new Date().toDateString();
  const isCurrentMonth = date.getMonth() === new Date().getMonth();

  return (
    <div
      ref={drop as any}
      className={`
        relative w-full h-[757px] bg-[#F3F5F8] rounded-lg
        ${isOver ? 'bg-accent/50' : ''}
        ${!isCurrentMonth ? 'bg-muted/50 text-muted-foreground' : ''}
      `}
    >
      {/* Day Header with integrated date */}
      <div className="rounded-t-lg p-3 relative flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link
            href={`/day/${day.date}`}
            className={`
              font-sans font-semibold text-[11px] leading-none tracking-normal
              ${isToday ? 'text-purple-600 font-bold' : isCurrentMonth ? 'text-[#6A7988]' : 'text-muted-foreground'}
            `}
          >
            {dayNumber}
          </Link>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full w-6 h-6 bg-gray-300 hover:bg-gray-400 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onAddWorkout(day.date);
          }}
        >
          <MdAdd className="w-3 h-3 text-white" />
        </Button>
      </div>

      {/* Content Area */}
      <div className="p-3 space-y-3 flex-1">
        {day.workouts.map(workout => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onClick={() => onWorkoutClick(workout)}
          />
        ))}
      </div>
    </div>
  );
}
