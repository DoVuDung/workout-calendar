import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Day } from '@/types';
import { apiClient } from '@/lib/api';
import { generateCalendarData } from '@/utils/calendarUtils';

// Query keys
export const calendarKeys = {
  all: ['calendar'] as const,
  week: (date: Date) => [...calendarKeys.all, 'week', date.toISOString()] as const,
  day: (date: string) => [...calendarKeys.all, 'day', date] as const,
};

// Fetch calendar data for a specific week
export function useCalendarData(currentDate: Date) {
  return useQuery({
    queryKey: calendarKeys.week(currentDate),
    queryFn: async () => {
      try {
        // Try to fetch from API first
        const apiDays = await apiClient.getDays();
        
        // Filter to current week
        const startOfWeek = new Date(currentDate);
        const dayOfWeek = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        startOfWeek.setDate(diff);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);


        const currentWeekDays = apiDays.filter(day => {
          const dayDate = new Date(day.date);
          // Set time to 00:00:00 for accurate date comparison
          dayDate.setHours(0, 0, 0, 0);
          startOfWeek.setHours(0, 0, 0, 0);
          endOfWeek.setHours(0, 0, 0, 0);
          
          const isInRange = dayDate >= startOfWeek && dayDate <= endOfWeek;
          
          
          return isInRange;
        });


        // Always generate a complete week (7 days) and merge with API data
        const completeWeek = generateCalendarData(currentDate);
        
        // Merge API data with generated week
        const mergedWeek = completeWeek.map(day => {
          const apiDay = currentWeekDays.find(apiDay => apiDay.date === day.date);
          const result = apiDay || day; // Use API data if available, otherwise use generated (empty) day
          
          
          return result;
        });


        return mergedWeek;
      } catch (error) {
      }
      
      // Fallback to generated data (empty days)
      return generateCalendarData(currentDate, false);
    },
    staleTime: 0, // Always refetch when date changes
    refetchOnWindowFocus: false,
  });
}

// Update calendar data (for drag and drop operations)
export function useUpdateCalendarData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, updatedData }: { date: Date; updatedData: Day[] }) => {
      // In a real app, this would make an API call
      // For now, we'll just update the cache
      return updatedData;
    },
    onSuccess: (data, variables) => {
      // Update the cache with new data
      queryClient.setQueryData(calendarKeys.week(variables.date), data);
    },
  });
}

// Get specific day data
export function useDayData(date: string) {
  return useQuery({
    queryKey: calendarKeys.day(date),
    queryFn: async () => {
      try {
        // Try to fetch from API first
        const dayData = await apiClient.getDay(date);
        if (dayData) {
          return dayData;
        }
      } catch (error) {
      }
      
      // Fallback to generated data (empty day)
      const dayData = generateCalendarData(new Date(date), false).find(day => day.date === date);
      return dayData;
    },
    enabled: !!date,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
