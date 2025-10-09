import { useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarKeys } from '../../calendar/queries/useCalendarData';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { workoutKeys } from './useWorkoutQueries';

// Delete workout (DELETE)
export function useDeleteWorkout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ workoutId, dayDate }: { workoutId: string; dayDate: string }) => {
      await apiClient.deleteWorkout(dayDate, workoutId);
      return workoutId;
    },
    onSuccess: (workoutId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: workoutKeys.detail(workoutId) });
      // Invalidate workout lists
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
      // Also invalidate calendar data to sync with day views
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
      
      toast({
        title: "Workout Deleted",
        description: "The workout has been deleted successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete workout. Please try again.",
        variant: "destructive",
      });
    },
  });
}