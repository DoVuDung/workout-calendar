'use client';

import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Exercise } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  MdDragIndicator,
  MdEdit,
  MdDelete,
  MdCheck,
  MdClose,
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
  const [editedExercise, setEditedExercise] = useState<Exercise>(exercise);

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

  const handleSave = () => {
    onUpdate(editedExercise);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedExercise(exercise);
    setIsEditing(false);
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

  if (isEditing) {
    return (
      <Card className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="exercise-name">Exercise Name</Label>
            <Input
              id="exercise-name"
              type="text"
              value={editedExercise.name}
              onChange={e =>
                setEditedExercise({
                  ...editedExercise,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="exercise-type">Type</Label>
            <select
              id="exercise-type"
              value={editedExercise.type}
              onChange={e =>
                setEditedExercise({
                  ...editedExercise,
                  type: e.target.value as 'strength' | 'cardio' | 'flexibility',
                })
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-[13px] ring-offset-background file:border-0 file:bg-transparent file:text-[13px] file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="flexibility">Flexibility</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="exercise-sets">Sets</Label>
            <Input
              id="exercise-sets"
              type="number"
              value={editedExercise.sets}
              onChange={e =>
                setEditedExercise({
                  ...editedExercise,
                  sets: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="exercise-reps">Reps</Label>
            <Input
              id="exercise-reps"
              type="number"
              value={editedExercise.reps}
              onChange={e =>
                setEditedExercise({
                  ...editedExercise,
                  reps: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="exercise-value">
              {editedExercise.type === 'cardio'
                ? 'Duration (min)'
                : 'Weight (lbs)'}
            </Label>
            <Input
              id="exercise-value"
              type="number"
              value={
                editedExercise.type === 'cardio'
                  ? editedExercise.duration || 0
                  : editedExercise.weight || 0
              }
              onChange={e =>
                setEditedExercise({
                  ...editedExercise,
                  [editedExercise.type === 'cardio' ? 'duration' : 'weight']:
                    parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <MdClose className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSave}>
            <MdCheck className="w-4 h-4" />
          </Button>
        </div>
      </Card>
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

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-foreground">{exercise.name}</h4>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(exercise.type)}`}
            >
              {exercise.type}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[13px] text-muted-foreground">
            <span>{exercise.sets} sets</span>
            <span>{exercise.reps} reps</span>
            {exercise.type === 'cardio' ? (
              <span>{exercise.duration} min</span>
            ) : (
              <span>{exercise.weight} lbs</span>
            )}
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
          >
            <MdDelete className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
