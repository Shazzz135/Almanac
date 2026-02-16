/**
 * Calendar Event Banners
 * Displays events as thin banners on calendar date cells
 * Shows up to 3 events, with a count indicator if there are more
 */

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  color?: string;
}

interface CalendarEventBannersProps {
  events: CalendarEvent[];
}

// Mock color palette for events
const EVENT_COLORS = [
  { bg: 'bg-red-500/20', border: 'border-red-400', text: 'text-red-300' },
  { bg: 'bg-blue-500/20', border: 'border-blue-400', text: 'text-blue-300' },
  { bg: 'bg-green-500/20', border: 'border-green-400', text: 'text-green-300' },
  { bg: 'bg-purple-500/20', border: 'border-purple-400', text: 'text-purple-300' },
  { bg: 'bg-yellow-500/20', border: 'border-yellow-400', text: 'text-yellow-300' },
  { bg: 'bg-pink-500/20', border: 'border-pink-400', text: 'text-pink-300' },
  { bg: 'bg-indigo-500/20', border: 'border-indigo-400', text: 'text-indigo-300' },
  { bg: 'bg-cyan-500/20', border: 'border-cyan-400', text: 'text-cyan-300' },
];

// Function to get a consistent color for an event based on its ID
const getColorForEvent = (eventId: string): (typeof EVENT_COLORS)[0] => {
  const hash = eventId.charCodeAt(0) + eventId.charCodeAt(eventId.length - 1);
  return EVENT_COLORS[hash % EVENT_COLORS.length];
};

export default function CalendarEventBanners({ events }: CalendarEventBannersProps) {
  const displayedEvents = events.slice(0, 3);
  const remainingCount = Math.max(0, events.length - 3);

  return (
    <div className="absolute top-8 left-1 right-1 flex flex-col gap-0.5 pointer-events-none">
      {/* Displayed Event Banners */}
      {displayedEvents.map((event) => {
        const color = getColorForEvent(event.id);
        return (
          <div
            key={event.id}
            className={`
              ${color.bg} ${color.border} ${color.text}
              border border-l-2 rounded px-1.5 py-0.5
              text-xs font-medium truncate
              hover:opacity-100 opacity-90 transition-opacity
              cursor-pointer pointer-events-auto
            `}
            title={event.title}
          >
            {event.title}
          </div>
        );
      })}

      {/* More Events Indicator */}
      {remainingCount > 0 && (
        <div className="text-xs font-semibold text-gray-400 px-1.5 py-0.5 text-right pointer-events-auto">
          +{remainingCount} more
        </div>
      )}
    </div>
  );
}
