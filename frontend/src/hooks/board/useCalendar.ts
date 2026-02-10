import React from 'react';
import { CalendarContext } from '../../services/board/calendarContext';
import type { CalendarContextType } from '../../services/board/calendarContext';

/**
 * Hook to use calendar context
 * Must be used within a CalendarProvider
 */
export const useCalendar = (): CalendarContextType => {
  const context = React.useContext(CalendarContext);

  if (context === undefined) {
    throw new Error(
      'useCalendar must be used within a CalendarProvider. Make sure to wrap your app with <CalendarProvider>.'
    );
  }

  return context;
};
