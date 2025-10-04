'use client';

import { Button } from '@/components/ui/button';
import { Workout } from '@/types';
import { useDrag } from 'react-dnd';
import { MdAdd, MdMoreHoriz } from 'react-icons/md';

interface WorkoutCardViewProps {
  workout: Workout;
  onClick: () => void;
}

export function WorkoutCardView({ workout, onClick }: WorkoutCardViewProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'workout',
    item: { id: workout.id },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatSetInfo = (exercise: any) => {
    if (exercise.type === 'cardio') {
      return `${exercise.duration} min`;
    }

    const sets = [];
    for (let i = 0; i < exercise.sets; i++) {
      sets.push(`${exercise.weight} lb x ${exercise.reps}`);
    }
    return sets.join(', ');
  };

  return (
    <div
      ref={drag as any}
      className={`
        bg-white rounded-lg p-3 cursor-pointer transition-all duration-200 mb-3 border border-[#22242626]
        ${isDragging ? 'opacity-50 scale-105 shadow-lg' : 'hover:shadow-md'}
      `}
      onClick={onClick}
    >
      {/* Workout Name Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#5A57CB] font-bold text-[13px] uppercase">
          {truncateText(workout.name, 25)}
        </h3>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full w-6 h-6 p-0 hover:bg-transparent"
        >
          <MdMoreHoriz className="w-3 h-3 text-[#5A57CB]" />
        </Button>
      </div>

      {/* Exercises */}
      <div className="space-y-2">
        {workout.exercises.map(exercise => (
          <div
            key={exercise.id}
            className="bg-white rounded-lg p-3 border border-[#DFDFDF] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)]"
          >
            <div className="flex items-start space-x-3">
              <span className="text-[10px] font-medium text-gray-500 mt-1">
                {exercise.sets}x
              </span>
              <div className="flex-1">
                <div className="font-bold text-gray-800 text-[13px] mb-1">
                  {truncateText(exercise.name, 20)}
                </div>
                <div className="text-[10px] text-gray-500">
                  {formatSetInfo(exercise)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Exercise Button */}
        <div className="flex justify-end pt-2">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full w-6 h-6 bg-gray-300 hover:bg-gray-400 p-0"
          >
            <MdAdd className="w-3 h-3 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
