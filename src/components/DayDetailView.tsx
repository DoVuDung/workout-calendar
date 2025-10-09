'use client';

import { Button } from '@/components/ui/button';
import { Day, Exercise, Workout } from '@/types';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MdAdd, MdMoreHoriz } from 'react-icons/md';
import { AddExerciseForm } from './AddExerciseForm';
import { ExerciseItem } from './ExerciseItem';

interface DayDetailViewProps {
  day: Day;
  onWorkoutUpdate: (workout: Workout) => void;
  onExerciseDrop: (activeExerciseId: string, overExerciseId: string, workoutId: string) => void;
}

export function DayDetailView({
  day,
  onWorkoutUpdate,
  onExerciseDrop,
}: DayDetailViewProps) {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(
    day.workouts[0] || null
  );
  const [showAddExercise, setShowAddExercise] = useState(false);

  const date = new Date(day.date);
  const dayName = date
    .toLocaleDateString('en-US', { weekday: 'short' })
    .toUpperCase();
  const dayNumber = date.getDate();

  const handleAddExercise = (exercise: Exercise) => {
    if (selectedWorkout) {
      const updatedWorkout = {
        ...selectedWorkout,
        exercises: [...selectedWorkout.exercises, exercise],
      };
      onWorkoutUpdate(updatedWorkout);
      setSelectedWorkout(updatedWorkout);
    }
    setShowAddExercise(false);
  };

  const handleUpdateExercise = (updatedExercise: Exercise) => {
    if (selectedWorkout) {
      const updatedWorkout = {
        ...selectedWorkout,
        exercises: selectedWorkout.exercises.map(ex =>
          ex.id === updatedExercise.id ? updatedExercise : ex
        ),
      };
      onWorkoutUpdate(updatedWorkout);
      setSelectedWorkout(updatedWorkout);
    }
  };

  const handleDeleteExercise = (exerciseId: string) => {
    if (selectedWorkout) {
      const updatedWorkout = {
        ...selectedWorkout,
        exercises: selectedWorkout.exercises.filter(ex => ex.id !== exerciseId),
      };
      onWorkoutUpdate(updatedWorkout);
      setSelectedWorkout(updatedWorkout);
    }
  };

  const handleExerciseDrop = (
    activeExerciseId: string,
    overExerciseId: string
  ) => {
    if (selectedWorkout) {
      onExerciseDrop(activeExerciseId, overExerciseId, selectedWorkout.id);
    }
  };

  const formatSetInfo = (exercise: Exercise) => {
    if (exercise.type === 'cardio') {
      return `${exercise.duration} min`;
    }

    const sets = [];
    for (let i = 0; i < exercise.sets; i++) {
      sets.push(`${exercise.weight} lb x ${exercise.reps}`);
    }
    return sets.join(', ');
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Day Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">{dayName}</h1>
        <div className="flex items-center space-x-4">
          <span className="text-4xl font-bold text-gray-800">
            {dayNumber}
          </span>
        </div>
      </div>

      {/* Workout Card */}
      {selectedWorkout && (
        <div className="rounded-lg p-6 mb-6">
          {/* Workout Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-blue-600">
                {selectedWorkout.name}
              </h2>
              <Button size="icon" variant="ghost" className="rounded-full">
                <MdMoreHoriz className="w-4 h-4 text-blue-600" />
              </Button>
            </div>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full border-blue-500"
            >
              <MdAdd className="w-4 h-4 text-blue-600" />
            </Button>
          </div>

          {/* Exercises */}
          <DndProvider backend={HTML5Backend}>
            <div className="space-y-3">
              {selectedWorkout.exercises.map((exercise) => (
                <ExerciseItem
                  key={exercise.id}
                  exercise={exercise}
                  onUpdate={handleUpdateExercise}
                  onDelete={handleDeleteExercise}
                  onDrop={handleExerciseDrop}
                />
              ))}

              {/* Add Exercise Button */}
              {showAddExercise ? (
                <AddExerciseForm
                  onAdd={handleAddExercise}
                  onCancel={() => setShowAddExercise(false)}
                />
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-12 border-dashed border-2 border-blue-500 hover:border-blue-600 text-blue-600"
                  onClick={() => setShowAddExercise(true)}
                >
                  <MdAdd className="w-4 h-4 mr-2 text-white" />
                  Add Exercise
                </Button>
              )}
            </div>
          </DndProvider>
        </div>
      )}

      {/* No Workout State */}
      {!selectedWorkout && (
        <div className="bg-gray-100 rounded-lg p-12 text-center border-2 border-blue-500">
          <div className="text-gray-600">
            <h3 className="text-lg font-medium mb-2">No workout planned</h3>
            <p className="text-[13px] mb-4">Add a workout to get started</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <MdAdd className="w-4 h-4 mr-2 text-white" />
              Add Workout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
