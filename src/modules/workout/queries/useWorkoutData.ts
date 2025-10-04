import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Workout, Exercise } from '@/types';

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

// Create new workout
export function useCreateWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workoutData: Omit<Workout, 'id'>) => {
      // In a real app, this would make an API call
      const newWorkout: Workout = {
        ...workoutData,
        id: `workout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      return newWorkout;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch workout lists
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
    },
  });
}

// Update workout
export function useUpdateWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workout: Workout) => {
      // In a real app, this would make an API call
      return workout;
    },
    onSuccess: (data) => {
      // Update the specific workout in cache
      queryClient.setQueryData(workoutKeys.detail(data.id), data);
      // Invalidate workout lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
    },
  });
}

// Delete workout
export function useDeleteWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workoutId: string) => {
      // In a real app, this would make an API call
      return workoutId;
    },
    onSuccess: (workoutId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: workoutKeys.detail(workoutId) });
      // Invalidate workout lists
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
    },
  });
}

// Move workout between days
export function useMoveWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      workoutId, 
      fromDayId, 
      toDayId 
    }: { 
      workoutId: string; 
      fromDayId: string; 
      toDayId: string; 
    }) => {
      // In a real app, this would make an API call
      return { workoutId, fromDayId, toDayId };
    },
    onSuccess: () => {
      // Invalidate all workout lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
    },
  });
}
