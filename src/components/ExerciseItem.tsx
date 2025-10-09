'use client';

import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Exercise } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EditExerciseForm } from './EditExerciseForm';
import {
  MdDragIndicator,
  MdEdit,
  MdDelete,
  MdFitnessCenter,
  MdDirectionsRun,
  MdSelfImprovement,
} from 'react-icons/md';

interface ExerciseItemProps {
  exercise: Exercise;
  onUpdate: (exercise: Exercise) => void;
  onDelete: (exerciseId: string) => void;
  onDrop: (activeExerciseId: string, overExerciseId: string) => void;
}

export function ExerciseItem({
  exercise,
  onUpdate,
  onDelete,
  onDrop,
}: ExerciseItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: 'exercise',
    item: { id: exercise.id },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'exercise',
    drop: (item: { id: string }) => {
      if (item.id !== exercise.id) {
        onDrop(item.id, exercise.id);
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = (updatedExercise: Exercise) => {
    onUpdate(updatedExercise);
    setIsEditing(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'strength':
        return <MdFitnessCenter className="w-4 h-4" />;
      case 'cardio':
        return <MdDirectionsRun className="w-4 h-4" />;
      case 'flexibility':
        return <MdSelfImprovement className="w-4 h-4" />;
      default:
        return <MdFitnessCenter className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strength':
        return 'bg-red-100 text-red-800';
      case 'cardio':
        return 'bg-blue-100 text-blue-800';
      case 'flexibility':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeButtonColor = (type: string) => {
    switch (type) {
      case 'strength':
        return 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100';
      case 'cardio':
        return 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100';
      case 'flexibility':
        return 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100';
    }
  };

  if (isEditing) {
    return (
      <EditExerciseForm
        exercise={exercise}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <Card
      ref={node => {
        (drag as any)(node);
        (drop as any)(node);
      }}
      className={`
        p-4
        ${isDragging ? 'opacity-50 shadow-lg' : 'hover:shadow-md'}
        ${isOver ? 'bg-accent/50' : ''}
        transition-all duration-200
      `}
    >
      <div className="flex items-center space-x-3">
        <div className="p-1 hover:bg-muted rounded cursor-grab active:cursor-grabbing">
          <MdDragIndicator className="w-4 h-4 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              {getTypeIcon(exercise.type)}
              <h4 className="font-semibold text-foreground truncate" title={exercise.name}>
                {exercise.name}
              </h4>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(exercise.type)}`}
            >
              {exercise.type}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs">Sets</span>
              <span className="font-medium">{exercise.sets}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs">Reps</span>
              <span className="font-medium">{exercise.reps}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs">
                {exercise.type === 'cardio' ? 'Duration' : 'Weight'}
              </span>
              <span className="font-medium">
                {exercise.type === 'cardio' ? `${exercise.duration} min` : `${exercise.weight} lbs`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <MdEdit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(exercise.id)}
            className="h-8 w-8 hover:bg-red-50"
          >
            <MdDelete className="h-4 w-4" style={{ color: '#EF4444' }} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
