'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Workout, Exercise } from '@/types';
import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MdAdd, MdDelete, MdClose } from 'react-icons/md';
import { AddExerciseFormView } from './AddExerciseFormView';
import { ExerciseItemView } from './ExerciseItemView';
import { DumbbellLoader } from '@/components/ui/DumbbellLoader';

interface WorkoutModalViewProps {
  workout: Workout;
  onClose: () => void;
  onUpdate: (workout: Workout) => void;
  onDelete: (workoutId: string) => void;
  onExerciseDrop: (exerciseId: string, targetWorkoutId: string, targetIndex: number) => void;
  isNewWorkout?: boolean;
}

export function WorkoutModalView({
  workout,
  onClose,
  onUpdate,
  onDelete,
  onExerciseDrop,
  isNewWorkout = false,
}: WorkoutModalViewProps) {
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [workoutData, setWorkoutData] = useState(workout);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Check if workout name is required
    if (!workoutData.name.trim()) {
      newErrors.name = 'Workout name is required';
    }

    // Check if workout name is not the default name
    if (workoutData.name.trim() === 'New Workout') {
      newErrors.name = 'Please enter a proper workout name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [{ isDragging }, drag] = useDrag({
    type: 'workout',
    item: { id: workout.id },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      onUpdate(workoutData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this workout?')) {
      onDelete(workout.id);
    } else {
    }
  };

  const handleAddExercise = (exercise: Exercise) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: [...prev.exercises, exercise],
    }));
    setIsAddingExercise(false);
  };

  const handleUpdateExercise = (exerciseId: string, updatedExercise: Exercise) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === exerciseId ? updatedExercise : ex
      ),
    }));
  };

  const handleDeleteExercise = (exerciseId: string) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId),
    }));
  };

  const handleMoveExercise = (exerciseId: string, targetIndex: number) => {
    const exerciseIndex = workoutData.exercises.findIndex(ex => ex.id === exerciseId);
    if (exerciseIndex === -1) return;

    const newExercises = [...workoutData.exercises];
    const [movedExercise] = newExercises.splice(exerciseIndex, 1);
    newExercises.splice(targetIndex, 0, movedExercise);

    setWorkoutData(prev => ({
      ...prev,
      exercises: newExercises,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-[13px] font-bold" style={{ color: '#5A57CB' }}>
            {isNewWorkout ? 'Add New Workout' : 'Edit Workout'}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {!isNewWorkout && (
              <Button
                size="icon"
                variant="ghost"
                onClick={handleDelete}
                className="h-8 w-8 hover:bg-red-50"
                type="button"
                title="Delete workout"
                aria-label="Delete workout"
                style={{ zIndex: 1000 }}
              >
                <MdDelete className="h-4 w-4" style={{ color: '#EF4444' }} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-black hover:bg-gray-100"
              type="button"
              aria-label="Close modal"
            >
              <MdClose className="h-4 w-4 text-black" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {/* Workout Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="workout-name" className="text-[10px] font-medium">Workout Name</Label>
              <Input
                id="workout-name"
                value={workoutData.name}
                onChange={(e) => {
                  setWorkoutData(prev => ({ ...prev, name: e.target.value }));
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                className="mt-1 h-10"
                style={{
                  borderColor: errors.name ? '#EF4444' : undefined,
                  borderWidth: errors.name ? '1px' : undefined
                }}
                required
              />
              {errors.name && (
                <p className="text-[10px] mt-1" style={{ color: '#EF4444' }}>{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration" className="text-[10px] font-medium">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={workoutData.duration}
                  onChange={(e) => setWorkoutData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  className="mt-1 h-10"
                />
              </div>
              <div>
                <Label htmlFor="difficulty" className="text-[10px] font-medium">Difficulty</Label>
                <select
                  id="difficulty"
                  value={workoutData.difficulty}
                  onChange={(e) => setWorkoutData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                  className="mt-1 w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Exercises */}
          <div>
            <div className="flex items-center justify-between mb-4 !mt-4">
              <h3 className="text-[13px] font-semibold" style={{ color: '#5A57CB' }}>Exercises</h3>
              <Button
                onClick={() => setIsAddingExercise(true)}
                className="flex items-center space-x-2 text-white" 
                style={{ backgroundColor: '#5A57CB' }}
                type="button"
              >
                <MdAdd className="h-4 w-4 text-white" />
                <span>Add Exercise</span>
              </Button>
            </div>

            {isAddingExercise && (
              <AddExerciseFormView
                onAdd={handleAddExercise}
                onCancel={() => setIsAddingExercise(false)}
              />
            )}

            <DndProvider backend={HTML5Backend}>
              <div className="space-y-3">
                {workoutData.exercises.map((exercise, index) => (
                  <ExerciseItemView
                    key={exercise.id}
                    exercise={exercise}
                    index={index}
                    onUpdate={(updatedExercise) => handleUpdateExercise(exercise.id, updatedExercise)}
                    onDelete={() => handleDeleteExercise(exercise.id)}
                    onMove={handleMoveExercise}
                  />
                ))}
              </div>
            </DndProvider>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose} className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="text-white"
              style={{ backgroundColor: '#5A57CB' }}
              type="button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <DumbbellLoader size="sm" message="" />
                  <span>Saving...</span>
                </div>
              ) : (
                isNewWorkout ? 'Create Workout' : 'Save Workout'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
