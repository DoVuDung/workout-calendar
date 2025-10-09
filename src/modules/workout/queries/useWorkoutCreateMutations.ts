import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Workout } from '@/types';
import { calendarKeys } from '../../calendar/queries/useCalendarData';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { workoutKeys } from './useWorkoutQueries';

// Create new workout (POST)
export function useCreateWorkout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ workoutData, dayDate }: { workoutData: Omit<Workout, 'id'>; dayDate: string }) => {
      return apiClient.createWorkout(dayDate, workoutData);
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch workout lists
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
      // Also invalidate calendar data to sync with day views
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
      
      toast({
        title: "Workout Created",
        description: `"${variables.workoutData.name}" has been created successfully.`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create workout. Please try again.",
        variant: "destructive",
      });
    },
  });
}