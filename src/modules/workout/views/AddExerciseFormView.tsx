'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Exercise } from '@/types';

interface AddExerciseFormViewProps {
  onAdd: (exercise: Exercise) => void;
  onCancel: () => void;
}

export function AddExerciseFormView({
  onAdd,
  onCancel,
}: AddExerciseFormViewProps) {
  const [formData, setFormData] = useState({
    name: '',
    sets: 3,
    weight: 0,
    reps: 10,
    type: 'strength' as const,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Check if exercise name is required
    if (!formData.name.trim()) {
      newErrors.name = 'Exercise name is required';
    }

    // Check if sets is valid
    if (formData.sets < 1) {
      newErrors.sets = 'Sets must be at least 1';
    }

    // Check if reps is valid
    if (formData.reps < 1) {
      newErrors.reps = 'Reps must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newExercise: Exercise = {
      id: `exercise-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name,
      sets: formData.sets,
      weight: formData.weight,
      reps: formData.reps,
      type: formData.type,
    };

    onAdd(newExercise);

    // Reset form and clear errors
    setFormData({
      name: '',
      sets: 3,
      weight: 0,
      reps: 10,
      type: 'strength',
    });
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg p-4 space-y-4 bg-blue-50"
    >
      <h4 className="font-semibold text-[13px]" style={{ color: '#5A57CB' }}>
        Add New Exercise
      </h4>

      <div>
        <Label htmlFor="exercise-name" className="text-[10px] font-medium">
          Exercise Name
        </Label>
        <Input
          id="exercise-name"
          value={formData.name}
          onChange={e => {
            setFormData(prev => ({ ...prev, name: e.target.value }));
            if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
          }}
          placeholder="e.g., Bench Press"
          required
          className="mt-1 text-[10px]"
          style={{
            borderColor: errors.name ? '#EF4444' : undefined,
            borderWidth: errors.name ? '1px' : undefined
          }}
        />
        {errors.name && (
          <p className="text-[10px] mt-1" style={{ color: '#EF4444' }}>{errors.name}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="sets" className="text-[10px] font-medium">
            Sets
          </Label>
          <Input
            id="sets"
            type="number"
            value={formData.sets}
            onChange={e => {
              setFormData(prev => ({
                ...prev,
                sets: parseInt(e.target.value) || 0,
              }));
              if (errors.sets) setErrors(prev => ({ ...prev, sets: '' }));
            }}
            min="1"
            required
            className="mt-1 text-[10px]"
            style={{
              borderColor: errors.sets ? '#EF4444' : undefined,
              borderWidth: errors.sets ? '1px' : undefined
            }}
          />
          {errors.sets && (
            <p className="text-[10px] mt-1" style={{ color: '#EF4444' }}>{errors.sets}</p>
          )}
        </div>
        <div>
          <Label htmlFor="weight" className="text-[10px] font-medium">
            Weight (lb)
          </Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                weight: parseInt(e.target.value) || 0,
              }))
            }
            min="0"
            required
            className="mt-1 text-[10px]"
          />
        </div>
        <div>
          <Label htmlFor="reps" className="text-[10px] font-medium">
            Reps
          </Label>
          <Input
            id="reps"
            type="number"
            value={formData.reps}
            onChange={e => {
              setFormData(prev => ({
                ...prev,
                reps: parseInt(e.target.value) || 0,
              }));
              if (errors.reps) setErrors(prev => ({ ...prev, reps: '' }));
            }}
            min="1"
            required
            className="mt-1 text-[10px]"
            style={{
              borderColor: errors.reps ? '#EF4444' : undefined,
              borderWidth: errors.reps ? '1px' : undefined
            }}
          />
          {errors.reps && (
            <p className="text-[10px] mt-1" style={{ color: '#EF4444' }}>{errors.reps}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="text-white"
          style={{ backgroundColor: '#5A57CB' }}
        >
          Add Exercise
        </Button>
      </div>
    </form>
  );
}
