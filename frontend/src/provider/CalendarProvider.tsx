/**
 * Calendar Provider Component
 * Wraps your app and provides calendar state to all children
 * 
 * Usage in main.tsx or App.tsx:
 * <AuthProvider>
 *   <CalendarProvider>
 *     <App />
 *   </CalendarProvider>
 * </AuthProvider>
 */

import React, { useState, useEffect } from 'react';
import { CalendarContext } from '../services/board/calendarContext';
import type { CalendarContextType, CalendarProviderProps, Calendar } from '../services/board/calendarContext';
import { getUserCalendar } from '../services/board/calendar';
import { useAuth } from '../hooks/auth/useAuth';

export const CalendarProvider: React.FC<CalendarProviderProps> = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [activeCalendarId, setActiveCalendarId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to fetch calendars
  const fetchCalendars = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUserCalendar();
      if (data && Array.isArray(data.calendars)) {
        setCalendars(data.calendars);
        
        // Check if currently active calendar still exists
        const activeCalendarExists = data.calendars.some(cal => cal._id === activeCalendarId);
        
        if (data.calendars.length === 0) {
          // No calendars left, clear active
          setActiveCalendarId(null);
        } else if (!activeCalendarExists) {
          // Active calendar was removed, switch to first available
          console.log('[CalendarProvider] Active calendar no longer exists, switching to first calendar');
          setActiveCalendarId(data.calendars[0]._id);
        }
        // If active calendar still exists, keep it as-is
      } else {
        setCalendars([]);
        setActiveCalendarId(null);
      }
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to fetch calendars:', errorMsg);
      setError('Failed to load calendars');
      setCalendars([]);
      setActiveCalendarId(null);
      // Re-throw so caller knows there was an error
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh calendars function to be exposed via context
  const refreshCalendars = async () => {
    console.log('[CalendarProvider] Refreshing calendars...');
    try {
      await fetchCalendars();
      console.log('[CalendarProvider] Calendars refreshed successfully');
    } catch (err) {
      console.error('[CalendarProvider] Failed to refresh calendars:', err);
      throw err;
    }
  };

  // Fetch calendars when user authenticates
  useEffect(() => {
    if (!isAuthenticated || authLoading) {
      setCalendars([]);
      setActiveCalendarId(null);
      return;
    }

    fetchCalendars();
  }, [isAuthenticated, authLoading]);

  const value: CalendarContextType = {
    calendars,
    activeCalendarId,
    setActiveCalendarId,
    isLoading,
    error,
    refreshCalendars,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};
