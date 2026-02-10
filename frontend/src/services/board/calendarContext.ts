import { createContext } from 'react';

export interface Calendar {
  _id: string;
  name: string;
  description?: string;
  type: string;
  owner_id: string;
}

export interface CalendarContextType {
  calendars: Calendar[];
  activeCalendarId: string | null;
  setActiveCalendarId: (id: string | null) => void;
  isLoading: boolean;
  error: string | null;
  refreshCalendars: () => Promise<void>;
}

export interface CalendarProviderProps {
  children: React.ReactNode;
}

export const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);
