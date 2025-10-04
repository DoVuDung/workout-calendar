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

export function AddExerciseFormView({ onAdd, onCancel }: AddExerciseFormViewProps) {
  const [formData, setFormData] = useState({
    name: '',
    sets: 3,
    weight: 0,
    reps: 10,
    type: 'strength' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newExercise: Exercise = {
      id: `exercise-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name,
      sets: formData.sets,
      weight: formData.weight,
      reps: formData.reps,
      type: formData.type,
    };

    onAdd(newExercise);
    
    // Reset form
    setFormData({
      name: '',
      sets: 3,
      weight: 0,
      reps: 10,
      type: 'strength',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-4 bg-blue-50">
      <h4 className="font-semibold text-[13px]">Add New Exercise</h4>
      
      <div>
        <Label htmlFor="exercise-name">Exercise Name</Label>
        <Input
          id="exercise-name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Bench Press"
          required
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="sets">Sets</Label>
          <Input
            id="sets"
            type="number"
            value={formData.sets}
            onChange={(e) => setFormData(prev => ({ ...prev, sets: parseInt(e.target.value) || 0 }))}
            min="1"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="weight">Weight (lb)</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
            min="0"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="reps">Reps</Label>
          <Input
            id="reps"
            type="number"
            value={formData.reps}
            onChange={(e) => setFormData(prev => ({ ...prev, reps: parseInt(e.target.value) || 0 }))}
            min="1"
            required
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="text-black">
          Add Exercise
        </Button>
      </div>
    </form>
  );
}
