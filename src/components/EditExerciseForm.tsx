'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Exercise } from '@/types';
import { useState } from 'react';
import { MdEdit, MdClose, MdFitnessCenter, MdDirectionsRun, MdSelfImprovement } from 'react-icons/md';

interface EditExerciseFormProps {
  exercise: Exercise;
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
}

export function EditExerciseForm({ exercise, onSave, onCancel }: EditExerciseFormProps) {
  const [formData, setFormData] = useState({
    name: exercise.name,
    type: exercise.type,
    sets: exercise.sets,
    reps: exercise.reps,
    weight: exercise.weight || 0,
    duration: exercise.duration || 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Exercise name is required';
    }

    if (formData.sets < 1) {
      newErrors.sets = 'Sets must be at least 1';
    }

    if (formData.reps < 1) {
      newErrors.reps = 'Reps must be at least 1';
    }

    if (formData.type === 'cardio' && formData.duration < 1) {
      newErrors.duration = 'Duration must be at least 1 minute';
    }

    if (formData.type !== 'cardio' && formData.weight < 0) {
      newErrors.weight = 'Weight cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const updatedExercise: Exercise = {
        ...exercise,
        name: formData.name.trim(),
        type: formData.type,
        sets: formData.sets,
        reps: formData.reps,
        ...(formData.type === 'cardio'
          ? { duration: formData.duration }
          : { weight: formData.weight }),
      };

      onSave(updatedExercise);
    } finally {
      setIsSaving(false);
    }
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

  return (
    <Card className="p-6 border-2 border-primary/30 bg-gradient-to-br from-background to-primary/5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <MdEdit className="w-5 h-5 text-primary" />
          </div>
          <h4 className="text-lg font-semibold text-foreground">Edit Exercise</h4>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCancel}
          className="hover:bg-destructive/10 hover:text-destructive"
        >
          <MdClose className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Exercise Name */}
        <div className="space-y-2">
          <Label htmlFor="edit-exercise-name" className="text-sm font-medium">
            Exercise Name
          </Label>
          <Input
            id="edit-exercise-name"
            type="text"
            value={formData.name}
            onChange={e => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            placeholder="e.g., Push-ups, Running, Yoga"
            className={`transition-all duration-200 ${
              errors.name ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
            required
          />
          {errors.name && (
            <p className="text-sm text-destructive animate-in slide-in-from-top-1">
              {errors.name}
            </p>
          )}
        </div>

        {/* Exercise Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Exercise Type</Label>
          <div className="grid grid-cols-3 gap-3">
            {(['strength', 'cardio', 'flexibility'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, type });
                  if (errors.type) setErrors({ ...errors, type: '' });
                }}
                className={`
                  flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-all duration-200
                  ${formData.type === type 
                    ? `${getTypeButtonColor(type)} border-current shadow-md scale-105` 
                    : 'border-border bg-background hover:bg-muted'
                  }
                `}
              >
                {getTypeIcon(type)}
                <span className="text-sm font-medium capitalize">{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sets and Reps */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-exercise-sets" className="text-sm font-medium">
              Sets
            </Label>
            <Input
              id="edit-exercise-sets"
              type="number"
              value={formData.sets}
              onChange={e => {
                setFormData({
                  ...formData,
                  sets: parseInt(e.target.value) || 0,
                });
                if (errors.sets) setErrors({ ...errors, sets: '' });
              }}
              min="1"
              className={`transition-all duration-200 ${
                errors.sets ? 'border-destructive focus-visible:ring-destructive' : ''
              }`}
              required
            />
            {errors.sets && (
              <p className="text-sm text-destructive animate-in slide-in-from-top-1">
                {errors.sets}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-exercise-reps" className="text-sm font-medium">
              Reps
            </Label>
            <Input
              id="edit-exercise-reps"
              type="number"
              value={formData.reps}
              onChange={e => {
                setFormData({
                  ...formData,
                  reps: parseInt(e.target.value) || 0,
                });
                if (errors.reps) setErrors({ ...errors, reps: '' });
              }}
              min="1"
              className={`transition-all duration-200 ${
                errors.reps ? 'border-destructive focus-visible:ring-destructive' : ''
              }`}
              required
            />
            {errors.reps && (
              <p className="text-sm text-destructive animate-in slide-in-from-top-1">
                {errors.reps}
              </p>
            )}
          </div>
        </div>

        {/* Weight/Duration */}
        <div className="space-y-2">
          <Label htmlFor="edit-exercise-value" className="text-sm font-medium">
            {formData.type === 'cardio' ? 'Duration (minutes)' : 'Weight (lbs)'}
          </Label>
          <Input
            id="edit-exercise-value"
            type="number"
            value={
              formData.type === 'cardio' ? formData.duration : formData.weight
            }
            onChange={e => {
              setFormData({
                ...formData,
                [formData.type === 'cardio' ? 'duration' : 'weight']:
                  parseInt(e.target.value) || 0,
              });
              const field = formData.type === 'cardio' ? 'duration' : 'weight';
              if (errors[field]) setErrors({ ...errors, [field]: '' });
            }}
            min="0"
            placeholder={formData.type === 'cardio' ? 'e.g., 30' : 'e.g., 50'}
            className={`transition-all duration-200 ${
              errors[formData.type === 'cardio' ? 'duration' : 'weight'] 
                ? 'border-destructive focus-visible:ring-destructive' 
                : ''
            }`}
          />
          {(errors.duration || errors.weight) && (
            <p className="text-sm text-destructive animate-in slide-in-from-top-1">
              {errors[formData.type === 'cardio' ? 'duration' : 'weight']}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t relative z-10">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="hover:bg-muted text-foreground border-border hover:text-foreground min-h-[40px] px-6"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSaving}
            className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground min-h-[40px] px-6"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <MdEdit className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}
