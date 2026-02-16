import React from 'react';
// Removed unused CalendarEventPopup import
import type { CalendarDay } from '../../utils/board/getCalendarData';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  color?: string;
  location?: string;
}

interface DateBoxProps {
  dayObj: CalendarDay;
  index: number;
  row: number;
  col: number;
  isCurrentDay: boolean;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
  pulseClass: string;
  onDateClick: (dayObj: CalendarDay, idx: number) => void;
  onCreateEventClick: (date: Date) => void;
}

const DateBox: React.FC<DateBoxProps> = ({
  dayObj,
  index,
  row,
  col,
  isCurrentDay,
  isCurrentMonth,
  events,
  pulseClass,
  onDateClick,
  // Removed unused onCreateEventClick
}) => {
  const borderRight = col !== 6 ? 'border-r border-gray-500' : '';
  const borderBottom = row !== 4 && row !== 5 ? 'border-b border-gray-500' : '';
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const textColor = isCurrentDay 
    ? `${pulseClass} text-blue-400`
    : isCurrentMonth 
      ? 'text-gray-300'
      : 'text-gray-500 opacity-50';
  const bgColor = isCurrentDay ? 'bg-blue-100/15' : '';

  // Show max 3 events with overflow badge
  const eventCount = events.length;
  const visibleEvents = events.slice(0, 3);
  const hasMoreEvents = eventCount > 3;
  const extraEventsCount = eventCount - 3;

  return (
    <div
      className={`h-[101px] w-[144px] flex flex-col items-start justify-between pt-2 pb-2 px-1 ${borderRight} ${borderBottom} ${bgColor} transition-all duration-200 hover:bg-gray-400/10 hover:shadow-md cursor-pointer relative group`}
      onClick={() => onDateClick(dayObj, index)}
    >
      <div className="w-full flex flex-col gap-0.5 flex-1">
        {visibleEvents.map((event) => {
          const hexToRgba = (hex: string, alpha: number) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
          };

          const backgroundColor = event.color 
            ? hexToRgba(event.color, 0.3)
            : 'rgba(59, 130, 246, 0.3)'; // Default blue if no color
          const borderColor = event.color || '#3b82f6';

          return (
            <div
              key={event.id}
              className="text-xs text-white truncate px-2 py-0.5 rounded border-l-2 font-medium"
              style={{
                backgroundColor,
                borderLeftColor: borderColor,
              }}
              title={event.title}
            >
              {event.title}
            </div>
          );
        })}
      </div>

      <div className="w-full flex items-center justify-between">
        <span className={`text-base font-semibold ${textColor}`}>
          {dayObj.day}
          {row === 0 && (
            <span className="ml-1 text-sm text-gray-400 font-normal align-bottom uppercase">
              {daysOfWeek[col]}
            </span>
          )}
        </span>

        {hasMoreEvents && (
          <div className="text-xs text-blue-300 font-semibold px-1">
            +{extraEventsCount}
          </div>
        )}
      </div>

      {/* No dropdown popup, modal is handled in Calendar.tsx */}
    </div>
  );
};

export default DateBox;
