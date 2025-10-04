'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Exercise } from '@/types';
import { useState } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';

interface AddExerciseFormProps {
  onAdd: (exercise: Exercise) => void;
  onCancel: () => void;
}

export function AddExerciseForm({ onAdd, onCancel }: AddExerciseFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'strength' as 'strength' | 'cardio' | 'flexibility',
    sets: 3,
    reps: 10,
    weight: 0,
    duration: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const exercise: Exercise = {
      id: `exercise-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      sets: formData.sets,
      reps: formData.reps,
      ...(formData.type === 'cardio'
        ? { duration: formData.duration }
        : { weight: formData.weight }),
    };

    onAdd(exercise);

    // Reset form
    setFormData({
      name: '',
      type: 'strength',
      sets: 3,
      reps: 10,
      weight: 0,
      duration: 0,
    });
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-foreground">Add New Exercise</h4>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <MdClose className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="add-exercise-name">Exercise Name</Label>
            <Input
              id="add-exercise-name"
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="add-exercise-type">Type</Label>
            <select
              id="add-exercise-type"
              value={formData.type}
              onChange={e =>
                setFormData({
                  ...formData,
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

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="add-exercise-sets">Sets</Label>
            <Input
              id="add-exercise-sets"
              type="number"
              value={formData.sets}
              onChange={e =>
                setFormData({
                  ...formData,
                  sets: parseInt(e.target.value) || 0,
                })
              }
              min="1"
              required
            />
          </div>
          <div>
            <Label htmlFor="add-exercise-reps">Reps</Label>
            <Input
              id="add-exercise-reps"
              type="number"
              value={formData.reps}
              onChange={e =>
                setFormData({
                  ...formData,
                  reps: parseInt(e.target.value) || 0,
                })
              }
              min="1"
              required
            />
          </div>
          <div>
            <Label htmlFor="add-exercise-value">
              {formData.type === 'cardio' ? 'Duration (min)' : 'Weight (lbs)'}
            </Label>
            <Input
              id="add-exercise-value"
              type="number"
              value={
                formData.type === 'cardio' ? formData.duration : formData.weight
              }
              onChange={e =>
                setFormData({
                  ...formData,
                  [formData.type === 'cardio' ? 'duration' : 'weight']:
                    parseInt(e.target.value) || 0,
                })
              }
              min="0"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="flex items-center space-x-2">
            <MdAdd className="w-4 h-4" />
            <span>Add Exercise</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}
