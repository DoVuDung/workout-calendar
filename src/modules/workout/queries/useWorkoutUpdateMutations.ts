import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Workout } from '@/types';
import { calendarKeys } from '../../calendar/queries/useCalendarData';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { workoutKeys } from './useWorkoutQueries';

// Update workout (PUT)
export function useUpdateWorkout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ workout, dayDate }: { workout: Workout; dayDate: string }) => {
      return apiClient.updateWorkout(dayDate, workout);
    },
    onSuccess: (data) => {
      // Update the specific workout in cache
      queryClient.setQueryData(workoutKeys.detail(data.id), data);
      // Invalidate workout lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
      // Also invalidate calendar data to sync with day views
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
      
      toast({
        title: "Workout Updated",
        description: `"${data.name}" has been updated successfully.`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update workout. Please try again.",
        variant: "destructive",
      });
    },
  });
}

// Move workout between days (PUT)
export function useMoveWorkout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
      await apiClient.moveWorkout(workoutId, fromDayId, toDayId);
      return { workoutId, fromDayId, toDayId };
    },
    onSuccess: () => {
      // Invalidate all workout lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
      // Also invalidate calendar data to sync with day views
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
      // Force refetch of calendar data
      queryClient.refetchQueries({ queryKey: calendarKeys.all });
      
      toast({
        title: "Workout Moved",
        description: "Workout has been moved successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to move workout. Please try again.",
        variant: "destructive",
      });
    },
  });
}

// Reorder workout within the same day (PUT)
export function useReorderWorkout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      dayDate, 
      workoutId, 
      targetIndex 
    }: { 
      dayDate: string; 
      workoutId: string; 
      targetIndex: number; 
    }) => {
      await apiClient.reorderWorkout(dayDate, workoutId, targetIndex);
      return { dayDate, workoutId, targetIndex };
    },
    onSuccess: () => {
      // Invalidate all workout lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
      // Also invalidate calendar data to sync with day views
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
      // Force refetch of calendar data
      queryClient.refetchQueries({ queryKey: calendarKeys.all });
      
      toast({
        title: "Workout Reordered",
        description: "Workout has been reordered successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to reorder workout. Please try again.",
        variant: "destructive",
      });
    },
  });
}

// Move exercise within a workout (PUT)
export function useMoveExercise() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      dayDate, 
      workoutId, 
      exerciseId, 
      targetIndex 
    }: { 
      dayDate: string; 
      workoutId: string; 
      exerciseId: string; 
      targetIndex: number; 
    }) => {
      await apiClient.moveExercise(dayDate, workoutId, exerciseId, targetIndex);
      return { dayDate, workoutId, exerciseId, targetIndex };
    },
    onSuccess: () => {
      // Invalidate all workout lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
      // Also invalidate calendar data to sync with day views
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
      // Force refetch of calendar data
      queryClient.refetchQueries({ queryKey: calendarKeys.all });
      
      toast({
        title: "Exercise Moved",
        description: "Exercise has been reordered successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to move exercise. Please try again.",
        variant: "destructive",
      });
    },
  });
}