import { QueryClient } from '@tanstack/react-query';

/**
 * Aggressively clear and refetch all calendar-related cache
 * This ensures UI updates properly after move operations
 */
export function forceRefreshCalendarData(queryClient: QueryClient) {
  // Remove all calendar queries from cache
  queryClient.removeQueries({ queryKey: ['calendar'] });
  
  // Invalidate all workout queries
  queryClient.invalidateQueries({ queryKey: ['workouts'] });
  
  // Force refetch all calendar data
  queryClient.refetchQueries({ queryKey: ['calendar'] });
  
  // Also refetch workout queries
  queryClient.refetchQueries({ queryKey: ['workouts'] });
}

/**
 * Clear all cache and force fresh data fetch
 * Use this as a last resort when other methods fail
 */
export function clearAllCache(queryClient: QueryClient) {
  queryClient.clear();
}
