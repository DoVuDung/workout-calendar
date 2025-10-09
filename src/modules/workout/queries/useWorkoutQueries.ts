import { useQuery } from '@tanstack/react-query';
import { Workout } from '@/types';

// Query keys
export const workoutKeys = {
  all: ['workouts'] as const,
  detail: (id: string) => [...workoutKeys.all, 'detail', id] as const,
  list: (dayId: string) => [...workoutKeys.all, 'list', dayId] as const,
};

// Get workout by ID
export function useWorkout(workoutId: string) {
  return useQuery({
    queryKey: workoutKeys.detail(workoutId),
    queryFn: async () => {
      // In a real app, this would fetch from API
      // For now, return null as we'll handle this in the parent component
      return null;
    },
    enabled: !!workoutId,
  });
}

// Get workouts for a specific day
export function useWorkoutsForDay(dayId: string) {
  return useQuery({
    queryKey: workoutKeys.list(dayId),
    queryFn: async () => {
      // In a real app, this would fetch from API
      return [];
    },
    enabled: !!dayId,
  });
}
