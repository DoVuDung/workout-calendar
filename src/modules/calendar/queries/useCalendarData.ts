import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Day } from '@/types';
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
    queryFn: () => generateCalendarData(currentDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
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
    queryFn: () => {
      // In a real app, this would fetch from API
      const dayData = generateCalendarData(new Date(date)).find(day => day.date === date);
      return dayData;
    },
    enabled: !!date,
  });
}
