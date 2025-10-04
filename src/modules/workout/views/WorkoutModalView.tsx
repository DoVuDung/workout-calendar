'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Workout, Exercise } from '@/types';
import { useDrag, useDrop } from 'react-dnd';
import { MdAdd, MdDelete, MdClose } from 'react-icons/md';
import { AddExerciseFormView } from './AddExerciseFormView';
import { ExerciseItemView } from './ExerciseItemView';

interface WorkoutModalViewProps {
  workout: Workout;
  onClose: () => void;
  onUpdate: (workout: Workout) => void;
  onDelete: (workoutId: string) => void;
  onExerciseDrop: (exerciseId: string, targetWorkoutId: string, targetIndex: number) => void;
}

export function WorkoutModalView({
  workout,
  onClose,
  onUpdate,
  onDelete,
  onExerciseDrop,
}: WorkoutModalViewProps) {
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [workoutData, setWorkoutData] = useState(workout);

  const [{ isDragging }, drag] = useDrag({
    type: 'workout',
    item: { id: workout.id },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleSave = () => {
    onUpdate(workoutData);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this workout?')) {
      onDelete(workout.id);
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
          <CardTitle className="text-2xl font-bold">Edit Workout</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDelete}
              className="h-8 w-8 "
              type="button"
            >
              <MdDelete className="h-4 w-4 text-red-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-black hover:bg-gray-100"
              type="button"
            >
              <MdClose className="h-4 w-4 text-black" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {/* Workout Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="workout-name" className="text-sm font-medium">Workout Name</Label>
              <Input
                id="workout-name"
                value={workoutData.name}
                onChange={(e) => setWorkoutData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={workoutData.duration}
                  onChange={(e) => setWorkoutData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  className="mt-1 h-10"
                />
              </div>
              <div>
                <Label htmlFor="difficulty" className="text-sm font-medium">Difficulty</Label>
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
              <h3 className="text-lg font-semibold">Exercises</h3>
              <Button
                onClick={() => setIsAddingExercise(true)}
                className="flex items-center space-x-2 text-white" 
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

            <div className="space-y-3">
              {workoutData.exercises.map((exercise, index) => (
                <ExerciseItemView
                  key={exercise.id}
                  exercise={exercise}
                  index={index}
                  onUpdate={(updatedExercise) => handleUpdateExercise(exercise.id, updatedExercise)}
                  onDelete={() => handleDeleteExercise(exercise.id)}
                  onMove={(targetIndex) => handleMoveExercise(exercise.id, targetIndex)}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose} className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="color-black"
              type="button"
            >
              Save Workout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
