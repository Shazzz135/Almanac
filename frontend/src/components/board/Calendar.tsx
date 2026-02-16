import { useEffect, useState } from 'react';
import CalendarRow from './CalendarRow';
import Modal from '../ui/Modal';
import EventForm from './EventForm';
import { generateCalendarDays } from '../../utils/board/getCalendarData';
import { useGradientPulse } from '../../hooks/ui/useGradientPulse';
import { useAuth } from '../../hooks/auth/useAuth';
import { useCalendar } from '../../hooks/board/useCalendar';
import type { Calendar as CalendarType } from '../../services/board/calendar';

interface CalendarProps {
  displayMonth: number;
  displayYear: number;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  color?: string;
  location?: string;
}

// Mock event data for February 2026 with visual colors and locations
const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Standup',
    date: '2026-02-02',
    time: '10:00 AM',
    color: '#3b82f6',
    location: 'Meeting Room A',
  },
  {
    id: '2',
    title: 'Project Review',
    date: '2026-02-05',
    time: '2:00 PM',
    color: '#8b5cf6',
    location: 'Zoom',
  },
  {
    id: '3',
    title: 'Doctor Appointment',
    date: '2026-02-07',
    time: '3:30 PM',
    color: '#ec4899',
    location: 'Downtown Medical Center',
  },
  {
    id: '4',
    title: 'Team Meeting',
    date: '2026-02-10',
    time: '10:00 AM',
    color: '#3b82f6',
    location: 'Conference Room',
  },
  {
    id: '5',
    title: 'Lunch with Sarah',
    date: '2026-02-10',
    time: '12:30 PM',
    color: '#06b6d4',
    location: 'Downtown Cafe',
  },
  {
    id: '6',
    title: 'Birthday Party',
    date: '2026-02-12',
    time: '7:00 PM',
    color: '#f59e0b',
    location: 'Community Center',
  },
  {
    id: '7',
    title: 'Project Deadline',
    date: '2026-02-15',
    color: '#ef4444',
  },
  {
    id: '8',
    title: 'Sprint Planning',
    date: '2026-02-16',
    time: '9:00 AM',
    color: '#3b82f6',
    location: 'Virtual - Zoom',
  },
  {
    id: '9',
    title: 'Client Presentation',
    date: '2026-02-18',
    time: '11:00 AM',
    color: '#10b981',
    location: 'Client Office',
  },
  {
    id: '10',
    title: 'Team Lunch',
    date: '2026-02-20',
    time: '12:00 PM',
    color: '#06b6d4',
    location: 'Downtown Restaurant',
  },
  {
    id: '11',
    title: 'Weekly Sync',
    date: '2026-02-24',
    time: '3:00 PM',
    color: '#3b82f6',
    location: 'Meeting Room B',
  },
  {
    id: '12',
    title: 'Code Review Session',
    date: '2026-02-26',
    time: '2:30 PM',
    color: '#8b5cf6',
    location: 'Zoom',
  },
  {
    id: '13',
    title: 'Design Review',
    date: '2026-02-10',
    time: '2:00 PM',
    color: '#06b6d4',
    location: 'Design Studio',
  },
  {
    id: '14',
    title: 'Quarterly Planning',
    date: '2026-02-10',
    time: '4:00 PM',
    color: '#10b981',
    location: 'Conference Hall',
  },
  {
    id: '15',
    title: 'Budget Review',
    date: '2026-02-10',
    time: '5:00 PM',
    color: '#f59e0b',
    location: 'Finance Office',
  },
  {
    id: '16',
    title: 'Website Launch',
    date: '2026-02-17',
    time: '9:00 AM',
    color: '#3b82f6',
    location: 'Office',
  },
  {
    id: '17',
    title: 'Marketing Meeting',
    date: '2026-02-17',
    time: '11:00 AM',
    color: '#ec4899',
    location: 'Zoom',
  },
  {
    id: '18',
    title: 'Brand Strategy',
    date: '2026-02-17',
    time: '1:00 PM',
    color: '#8b5cf6',
    location: 'Conference Room',
  },
  {
    id: '19',
    title: 'Team Building',
    date: '2026-02-17',
    time: '3:00 PM',
    color: '#06b6d4',
    location: 'Outdoor Park',
  },
  {
    id: '20',
    title: '1-on-1 with Manager',
    date: '2026-02-19',
    time: '10:00 AM',
    color: '#10b981',
    location: 'Office',
  },
  {
    id: '21',
    title: 'Dev Standup',
    date: '2026-02-19',
    time: '11:00 AM',
    color: '#3b82f6',
    location: 'Zoom',
  },
  {
    id: '22',
    title: 'Code Review',
    date: '2026-02-19',
    time: '2:00 PM',
    color: '#8b5cf6',
    location: 'GitHub',
  },
  {
    id: '23',
    title: 'Client Call',
    date: '2026-02-19',
    time: '4:00 PM',
    color: '#f59e0b',
    location: 'Zoom',
  },
  {
    id: '24',
    title: 'Retrospective',
    date: '2026-02-21',
    time: '2:00 PM',
    color: '#ec4899',
    location: 'Conference Room',
  },
];

export default function Calendar({ displayMonth, displayYear }: CalendarProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { calendars, activeCalendarId, isLoading: calLoading } = useCalendar();
  const pulseClass = useGradientPulse();
  const [calendar, setCalendar] = useState<CalendarType | null>(null);

  // Get current date info
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();

  // Generate calendar grid
  const days = generateCalendarDays(displayYear, displayMonth);
  const numRows = Math.ceil(days.length / 7);

  // Date modal state
  const [showDateModal, setShowDateModal] = useState(false);
  const [modalDateInfo, setModalDateInfo] = useState<{ date: Date; events: CalendarEvent[] } | null>(null);

  // Event creation modal state
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [eventModalDate, setEventModalDate] = useState<Date | null>(null);

  // Handle day click - opens modal with date info
  function handleDayClick(dayObj: any) {
    let date: Date;
    if (dayObj.isCurrentMonth) {
      date = new Date(displayYear, displayMonth, dayObj.day);
    } else if (dayObj.isPrevMonth) {
      const prevMonth = displayMonth === 0 ? 11 : displayMonth - 1;
      const prevYear = displayMonth === 0 ? displayYear - 1 : displayYear;
      date = new Date(prevYear, prevMonth, dayObj.day);
    } else {
      const nextMonth = displayMonth === 11 ? 0 : displayMonth + 1;
      const nextYear = displayMonth === 11 ? displayYear + 1 : displayYear;
      date = new Date(nextYear, nextMonth, dayObj.day);
    }
    // Find events for this date
    const dateStr = date.toISOString().slice(0, 10);
    const eventsForDate = MOCK_EVENTS.filter(e => e.date === dateStr);
    setModalDateInfo({ date, events: eventsForDate });
    setShowDateModal(true);
  }

  // Close date modal
  function handleDateModalClose() {
    setShowDateModal(false);
    setModalDateInfo(null);
  }

  // Open event creation modal
  function handleCreateEventClick(date: Date) {
    setEventModalDate(date);
    setShowCreateEventModal(true);
  }

  // Submit event form
  function handleEventFormSubmit(event: any) {
    // TODO: Replace with real event creation logic
    // eslint-disable-next-line no-console
    console.log('Event created:', event);
    setShowCreateEventModal(false);
  }

  // Load calendar when mounted or when active calendar changes
  useEffect(() => {
    if (!isAuthenticated || authLoading) {
      setCalendar(null);
      return;
    }

    if (activeCalendarId && calendars.length > 0) {
      const selected = calendars.find((cal) => cal._id === activeCalendarId);
      setCalendar(selected || null);
    } else {
      setCalendar(null);
    }
  }, [isAuthenticated, authLoading, activeCalendarId, calendars]);

  // Wait for calendar data to be loaded before rendering
  const isReadyToRender = !calLoading && calendar !== null;

  if (!isReadyToRender) {
    return (
      <div className="w-fit flex flex-col items-center justify-center">
        <div className="text-2xl text-blue-400">Loading calendar...</div>
      </div>
    );
  }

  return (
    <>
      <div className="w-fit">
        {/* Calendar header - shows name and month/year */}
        <div className="mb-4 flex flex-row items-center justify-between gap-4 w-full px-4">
          <div
            className={`text-4xl font-bold pb-2 underline underline-offset-4 decoration-blue-400 ${pulseClass}`}
          >
            {calendar.name}
          </div>
          <div
            className={`text-4xl font-bold pb-2 underline underline-offset-4 decoration-blue-400 ${pulseClass}`}
          >
            {new Date(displayYear, displayMonth).toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>

        {/* Calendar grid - renders weeks of dates */}
        <div
          className={`grid grid-cols-7 ${
            numRows === 6 ? 'grid-rows-6' : 'grid-rows-5'
          } gap-0 relative`}
        >
          {Array.from({ length: numRows }).map((_, rowIdx) => {
            const rowDays = days.slice(rowIdx * 7, (rowIdx + 1) * 7);
            return (
              <CalendarRow
                key={rowIdx}
                days={rowDays}
                rowNumber={rowIdx}
                displayYear={displayYear}
                displayMonth={displayMonth}
                currentYear={currentYear}
                currentMonth={currentMonth}
                currentDay={currentDay}
                events={MOCK_EVENTS}
                pulseClass={pulseClass}
                onDateClick={handleDayClick}
                onCreateEventClick={handleCreateEventClick}
              />
            );
          })}
        </div>
      </div>

      {/* Date info modal */}
      <Modal open={showDateModal} disableClickOutside={false} onClose={handleDateModalClose}>
        {modalDateInfo && (
          <div className="bg-[#181f2a] rounded-xl shadow-xl p-4 w-full max-w-md border border-blue-700 relative">
            <div className="flex justify-between items-center mb-2">
              <div className="text-base font-semibold text-blue-400">
                {modalDateInfo.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <button
                className="ml-2 text-blue-300 hover:text-blue-400 text-xl font-bold"
                onClick={handleDateModalClose}
                aria-label="Close"
                tabIndex={0}
              >
                ×
              </button>
            </div>
            <div className="mb-2">
              {modalDateInfo.events.length === 0 ? (
                <div className="text-blue-200 text-center">No events</div>
              ) : (
                <ul className="space-y-2">
                  {modalDateInfo.events.map(event => (
                    <li key={event.id} className="text-xs text-white truncate px-2 py-0.5 rounded border-l-2 font-medium" style={{ borderLeftColor: event.color || '#3b82f6', backgroundColor: event.color ? `rgba(${parseInt(event.color.slice(1,3),16)},${parseInt(event.color.slice(3,5),16)},${parseInt(event.color.slice(5,7),16)},0.3)` : 'rgba(59,130,246,0.3)' }}>
                      <span className="font-bold mr-2">{event.title}</span>
                      {event.time && <span className="ml-1 text-blue-200">{event.time}</span>}
                      {event.location && <span className="ml-1 text-blue-200">{event.location}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow"
                onClick={() => {
                  setEventModalDate(modalDateInfo.date);
                  setShowCreateEventModal(true);
                  setShowDateModal(false);
                }}
              >
                Add Event
              </button>
            </div>
          </div>
        )}
      </Modal>
      {/* Event creation modal */}
      <Modal open={showCreateEventModal}>
        <div className="bg-[#181f2a] rounded-xl shadow-xl p-4 w-full max-w-md border border-blue-700">
          <h2 className="text-xl font-bold text-blue-300 mb-4">Create Event</h2>
          {eventModalDate && (
            <EventForm
              defaultDate={eventModalDate}
              onCancel={() => setShowCreateEventModal(false)}
              onSubmit={handleEventFormSubmit}
            />
          )}
        </div>
      </Modal>
    </>
  );
}