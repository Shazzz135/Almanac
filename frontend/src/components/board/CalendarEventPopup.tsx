
import React from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  time?: string;
}

interface CalendarEventPopupProps {
  date: Date;
  events: CalendarEvent[];
  onClose: () => void;
  col: number; // 0-6, Sunday-Saturday
  row: number; // 0-5, for 6 rows
  onCreateEventClick: (date: Date) => void;
}

const CalendarEventPopup: React.FC<CalendarEventPopupProps> = ({ date, events, onClose, onCreateEventClick }) => {
  return (
    <div className="relative">
      <div className="bg-[#181f2a] rounded-xl shadow-xl p-4 w-[300px] max-w-full relative border border-blue-700">
        <button
          className="absolute top-2 right-2 text-blue-300 hover:text-blue-400 text-xl font-bold"
          onClick={onClose}
          aria-label="Close"
          tabIndex={0}
        >
          ×
        </button>
        <div className="mb-2">
          <div className="text-base font-semibold text-blue-400">
            {date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div className="mb-2">
          {events.length === 0 ? (
            <div className="text-blue-200 text-center">No events</div>
          ) : (
            <ul className="space-y-2">
              {events.map(event => (
                <li key={event.id} className="border border-blue-800 rounded px-3 py-2 bg-[#232c3b]">
                  <div className="font-medium text-blue-100">{event.title}</div>
                  {event.time && <div className="text-xs text-blue-300">{event.time}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
          onClick={() => onCreateEventClick(date)}
        >
          Create Event
        </button>
      </div>
    </div>
  );
}

export default CalendarEventPopup;
