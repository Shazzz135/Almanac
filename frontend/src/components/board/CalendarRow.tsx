import React from 'react';
import DateBox from './DateBox';
import type { CalendarDay } from '../../utils/board/getCalendarData';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  color?: string;
  location?: string;
}

interface CalendarRowProps {
  days: CalendarDay[];
  rowNumber: number;
  displayYear: number;
  displayMonth: number;
  currentYear: number;
  currentMonth: number;
  currentDay: number;
  events: CalendarEvent[];
  pulseClass: string;
  onDateClick: (dayObj: CalendarDay, idx: number) => void;
  onCreateEventClick: (date: Date) => void;
}

/**
 * Renders one week of the calendar grid with 7 DateBox components.
 * Handles date calculations for prev/next month dates and event filtering.
 */
const CalendarRow: React.FC<CalendarRowProps> = ({
  days,
  rowNumber,
  displayYear,
  displayMonth,
  currentYear,
  currentMonth,
  currentDay,
  events,
  pulseClass,
  onDateClick,
  onCreateEventClick,
}) => {
  return (
    <>
      {days.map((dayObj, dayIdx) => {
        // Global index for identifying which date box shows the dropdown
        const globalIndex = rowNumber * 7 + dayIdx;
        const col = dayIdx % 7;

        // Check if this date is today
        const isCurrentDay =
          currentMonth === displayMonth &&
          currentYear === displayYear &&
          dayObj.day === currentDay &&
          dayObj.isCurrentMonth;

        // Calculate date string (YYYY-MM-DD) for event filtering
        let dateStr = '';
        if (dayObj.isCurrentMonth) {
          dateStr = new Date(displayYear, displayMonth, dayObj.day)
            .toISOString()
            .slice(0, 10);
        } else if (dayObj.isPrevMonth) {
          const prevMonth = displayMonth === 0 ? 11 : displayMonth - 1;
          const prevYear = displayMonth === 0 ? displayYear - 1 : displayYear;
          dateStr = new Date(prevYear, prevMonth, dayObj.day)
            .toISOString()
            .slice(0, 10);
        } else {
          // Next month
          const nextMonth = displayMonth === 11 ? 0 : displayMonth + 1;
          const nextYear = displayMonth === 11 ? displayYear + 1 : displayYear;
          dateStr = new Date(nextYear, nextMonth, dayObj.day)
            .toISOString()
            .slice(0, 10);
        }

        // ====================================================================
        // FILTER EVENTS FOR THIS DATE
        // ====================================================================
        const dayEvents = events.filter((e) => e.date === dateStr);

        // ====================================================================
        // DETERMINE IF DROPDOWN IS OPEN FOR THIS DATE
        // ====================================================================
        // Removed isDropdownOpen and dropdownIdx logic

        // ====================================================================
        // RENDER DATE BOX
        // ====================================================================
        return (
          <DateBox
            key={globalIndex}
            dayObj={dayObj}
            index={globalIndex}
            row={rowNumber}
            col={col}
            isCurrentDay={isCurrentDay}
            isCurrentMonth={dayObj.isCurrentMonth}
            events={dayEvents}
            pulseClass={pulseClass}
            onDateClick={onDateClick}
            onCreateEventClick={onCreateEventClick}
          />
        );
      })}
    </>
  );
};

export default CalendarRow;
