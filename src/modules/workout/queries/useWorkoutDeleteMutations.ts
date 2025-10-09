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
      console.log('Mutation: Deleting workout', workoutId, 'from day', dayDate);
      await apiClient.deleteWorkout(dayDate, workoutId);
      console.log('Mutation: Delete completed successfully');
      return workoutId;
    },
    onSuccess: (workoutId) => {
      console.log('Mutation: onSuccess called for workout', workoutId);
      // Remove from cache
      queryClient.removeQueries({ queryKey: workoutKeys.detail(workoutId) });
      // Invalidate workout lists
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
      // Also invalidate calendar data to sync with day views
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
      console.log('Mutation: Cache invalidated');
      
      toast({
        title: "Workout Deleted",
        description: "The workout has been deleted successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      console.error('Mutation: Delete failed with error:', error);
      toast({
        title: "Error",
        description: "Failed to delete workout. Please try again.",
        variant: "destructive",
      });
    },
  });
}