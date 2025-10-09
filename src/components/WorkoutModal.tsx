'use client';

import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Workout, Exercise } from '@/types';
import { ExerciseItem } from './ExerciseItem';
import { AddExerciseForm } from './AddExerciseForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MdClose, MdAdd, MdDelete } from 'react-icons/md';

interface WorkoutModalProps {
  workout: Workout;
  onClose: () => void;
  onUpdate: (workout: Workout) => void;
  onDelete: (workoutId: string) => void;
  onExerciseDrop: (activeExerciseId: string, overExerciseId: string) => void;
}

export function WorkoutModal({
  workout,
  onClose,
  onUpdate,
  onDelete,
  onExerciseDrop,
}: WorkoutModalProps) {
  const [editedWorkout, setEditedWorkout] = useState<Workout>(workout);
  const [showAddExercise, setShowAddExercise] = useState(false);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleExerciseDrop = (
    activeExerciseId: string,
    overExerciseId: string
  ) => {
    const activeIndex = editedWorkout.exercises.findIndex(
      ex => ex.id === activeExerciseId
    );
    const overIndex = editedWorkout.exercises.findIndex(
      ex => ex.id === overExerciseId
    );

    if (activeIndex !== -1 && overIndex !== -1) {
      const newExercises = [...editedWorkout.exercises];
      const [movedExercise] = newExercises.splice(activeIndex, 1);
      newExercises.splice(overIndex, 0, movedExercise);

      setEditedWorkout({
        ...editedWorkout,
        exercises: newExercises,
      });
    }
  };

  const handleAddExercise = (exercise: Exercise) => {
    setEditedWorkout({
      ...editedWorkout,
      exercises: [...editedWorkout.exercises, exercise],
    });
    setShowAddExercise(false);
  };

  const handleUpdateExercise = (updatedExercise: Exercise) => {
    setEditedWorkout({
      ...editedWorkout,
      exercises: editedWorkout.exercises.map(ex =>
        ex.id === updatedExercise.id ? updatedExercise : ex
      ),
    });
  };

  const handleDeleteExercise = (exerciseId: string) => {
    setEditedWorkout({
      ...editedWorkout,
      exercises: editedWorkout.exercises.filter(ex => ex.id !== exerciseId),
    });
  };

  const handleSave = () => {
    onUpdate(editedWorkout);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${workout.color}`}></div>
            <h2 className="text-xl font-bold text-foreground" title={workout.name}>
              {truncateText(workout.name, 30)}
            </h2>
            <span
              className={`px-2 py-1 rounded-full text-[13px] font-medium border ${getDifficultyColor(workout.difficulty)}`}
            >
              {workout.difficulty}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (confirm('Are you sure you want to delete this workout?')) {
                  onDelete(workout.id);
                  onClose();
                }
              }}
              className="h-8 w-8 hover:bg-red-50"
              aria-label="Delete workout"
            >
              <MdDelete className="h-4 w-4" style={{ color: '#EF4444' }} />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close modal">
              <MdClose className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Workout Info */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workout-name">Workout Name</Label>
                <Input
                  id="workout-name"
                  type="text"
                  value={editedWorkout.name}
                  onChange={e =>
                    setEditedWorkout({
                      ...editedWorkout,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="workout-duration">Duration (minutes)</Label>
                <Input
                  id="workout-duration"
                  type="number"
                  value={editedWorkout.duration}
                  onChange={e =>
                    setEditedWorkout({
                      ...editedWorkout,
                      duration: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Exercises */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Exercises
              </h3>
              <Button
                onClick={() => setShowAddExercise(true)}
                className="flex items-center space-x-2"
              >
                <MdAdd className="text-white" />
                <span>Add Exercise</span>
              </Button>
            </div>

            {showAddExercise && (
              <div className="mb-4">
                <AddExerciseForm
                  onAdd={handleAddExercise}
                  onCancel={() => setShowAddExercise(false)}
                />
              </div>
            )}

            <DndProvider backend={HTML5Backend}>
              <div className="space-y-3">
                {editedWorkout.exercises.map(exercise => (
                  <ExerciseItem
                    key={exercise.id}
                    exercise={exercise}
                    onUpdate={handleUpdateExercise}
                    onDelete={handleDeleteExercise}
                    onDrop={handleExerciseDrop}
                  />
                ))}
              </div>
            </DndProvider>

            {editedWorkout.exercises.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No exercises added yet.</p>
                <p className="text-[13px]">
                  Click "Add Exercise" to get started.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-muted/50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </Card>
    </div>
  );
}
