'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Exercise } from '@/types';
import { useDrag, useDrop } from 'react-dnd';
import { MdDelete, MdMoreVert } from 'react-icons/md';

interface ExerciseItemViewProps {
  exercise: Exercise;
  index: number;
  onUpdate: (exercise: Exercise) => void;
  onDelete: () => void;
  onMove: (exerciseId: string, targetIndex: number) => void;
}

export function ExerciseItemView({
  exercise,
  index,
  onUpdate,
  onDelete,
  onMove,
}: ExerciseItemViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [exerciseData, setExerciseData] = useState(exercise);

  const [{ isDragging }, drag] = useDrag({
    type: 'exercise',
    item: { id: exercise.id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'exercise',
    drop: (item: { id: string, index: number }) => {
      if (item.id !== exercise.id) {
        onMove(item.id, index);
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleSave = () => {
    onUpdate(exerciseData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setExerciseData(exercise);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
        <div>
          <Label htmlFor={`exercise-name-${exercise.id}`}>Exercise Name</Label>
          <Input
            id={`exercise-name-${exercise.id}`}
            value={exerciseData.name}
            onChange={(e) => setExerciseData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor={`sets-${exercise.id}`}>Sets</Label>
            <Input
              id={`sets-${exercise.id}`}
              type="number"
              value={exerciseData.sets}
              onChange={(e) => setExerciseData(prev => ({ ...prev, sets: parseInt(e.target.value) || 0 }))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={`weight-${exercise.id}`}>Weight (lb)</Label>
            <Input
              id={`weight-${exercise.id}`}
              type="number"
              value={exerciseData.weight}
              onChange={(e) => setExerciseData(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={`reps-${exercise.id}`}>Reps</Label>
            <Input
              id={`reps-${exercise.id}`}
              type="number"
              value={exerciseData.reps}
              onChange={(e) => setExerciseData(prev => ({ ...prev, reps: parseInt(e.target.value) || 0 }))}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={node => {
        (drag as any)(node);
        (drop as any)(node);
      }}
      className={`
        border border-gray-200 rounded-lg p-4 flex items-center justify-between bg-white
        ${isDragging ? 'opacity-50' : 'hover:bg-gray-50'}
        ${isOver ? 'bg-blue-50 border-blue-300' : ''}
      `}
    >
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <MdMoreVert className="text-gray-400 cursor-move" />
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-sm truncate" title={exercise.name}>
            {exercise.name}
          </h4>
          <p className="text-sm text-gray-600">
            {exercise.sets} sets × {exercise.weight} lb × {exercise.reps} reps
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          type="button"
        >
          <MdDelete className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
