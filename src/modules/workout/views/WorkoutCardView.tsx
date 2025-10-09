'use client';

import { Button } from '@/components/ui/button';
import { Workout } from '@/types';
import { useDrag, useDrop } from 'react-dnd';
import { MdAdd, MdMoreHoriz, MdDragIndicator, MdSwapHoriz } from 'react-icons/md';
import { useState, useEffect, useRef } from 'react';

interface WorkoutCardViewProps {
  workout: Workout;
  onClick: () => void;
  onWorkoutReorder?: (activeWorkoutId: string, overWorkoutId: string) => void;
  onMoveWorkout?: (workoutId: string) => void;
}

export function WorkoutCardView({ workout, onClick, onWorkoutReorder, onMoveWorkout }: WorkoutCardViewProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);
  const [{ isDragging }, drag] = useDrag({
    type: 'workout',
    item: { id: workout.id },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'workout',
    drop: (item: { id: string }) => {
      if (item.id !== workout.id && onWorkoutReorder) {
        onWorkoutReorder(item.id, workout.id);
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
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
      ref={node => {
        (drag as any)(node);
        (drop as any)(node);
      }}
      className={`
        bg-white rounded-[6px] p-3 cursor-pointer transition-all duration-200 mb-3 border border-[#22242626]
        ${isDragging ? 'opacity-50 scale-105 shadow-lg' : 'hover:shadow-md'}
        ${isOver ? 'bg-accent/50 border-primary/50' : ''}
      `}
      onClick={onClick}
    >
      {/* Workout Name Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <h3 className="font-bold text-[10px] uppercase" style={{ color: '#5A57CB' }}>
            {truncateText(workout.name, 25)}
          </h3>
        </div>
        <div className="relative" ref={menuRef}>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full w-6 h-6 p-0 hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            aria-label="Workout options menu"
          >
            <MdMoreHoriz className="w-3 h-3 text-[#C4C4C4]" />
          </Button>
          
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
              <button
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveWorkout?.(workout.id);
                  setShowMenu(false);
                }}
              >
                <MdSwapHoriz className="w-4 h-4" />
                Move
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-2">
        {workout.exercises.map(exercise => (
          <div
            key={exercise.id}
            className="bg-white rounded-[3px] border border-[#DFDFDF] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] w-full"
            style={{ 
              height: '42.4212646484375px',
              borderWidth: '1px'
            }}
          >
            <div className="flex items-center h-full px-3 py-2 space-x-3">
              <span className="text-[10px] font-medium text-gray-500 min-w-[20px]">
                {exercise.sets}x
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-800 text-[13px] truncate" title={exercise.name}>
                  {truncateText(exercise.name, 20)}
                </div>
                <div className="text-[10px] text-gray-500 truncate" title={formatSetInfo(exercise)}>
                  {truncateText(formatSetInfo(exercise), 30)}
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
