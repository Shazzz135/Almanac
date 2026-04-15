import { useEffect, useState } from 'react';
import CalendarRow from './CalendarRow';
import Modal from '../ui/Modal';
import EventForm from './EventForm';
import { generateCalendarDays } from '../../utils/board/getCalendarData';
import { useGradientPulse } from '../../hooks/ui/useGradientPulse';
import { useAuth } from '../../hooks/auth/useAuth';
import { useCalendar } from '../../hooks/board/useCalendar';
import type { Calendar as CalendarType } from '../../services/board/calendar';
import { createEvent, getEventsByCalendar, deleteEventFromServer } from '../../services/board/events';
import { getCurrentMember } from '../../services/board/member';
import type { Event } from '../../services/board/events';
import type { MemberRole } from '../../types/board/memberTypes';

interface CalendarProps {
  displayMonth: number;
  displayYear: number;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  description?: string;
  color?: string;
  location?: string;
  allDay?: boolean;
}

export default function Calendar({ displayMonth, displayYear }: CalendarProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { calendars, activeCalendarId, isLoading: calLoading } = useCalendar();
  const pulseClass = useGradientPulse();
  const [calendar, setCalendar] = useState<CalendarType | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [userRole, setUserRole] = useState<MemberRole | null>(null);

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

  // Delete confirmation modal state
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showLoadingDummy, setShowLoadingDummy] = useState(true);

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
    const eventsForDate = events
      .filter(e => {
        const eventDate = new Date(e.start).toISOString().slice(0, 10);
        return eventDate === dateStr;
      })
      .map(e => ({
        id: e._id,
        title: e.title,
        description: e.description,
        date: dateStr,
        time: e.allDay ? undefined : new Date(e.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        color: e.color,
        location: e.location,
        allDay: e.allDay,
      }));
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
  async function handleEventFormSubmit(event: any) {
    try {
      if (!activeCalendarId) {
        console.error('[Calendar] No calendar selected');
        return;
      }

      // Check if user has permission to create events
      if (userRole === 'viewer') {
        alert('Viewers cannot create events.');
        return;
      }
      
      console.log('[Calendar] Creating event:', event);
      await createEvent(activeCalendarId, event);
      console.log('[Calendar] Event created successfully');
      
      // Refresh events without showing loading indicator
      fetchEvents(activeCalendarId, false);
      setShowCreateEventModal(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create event';
      console.error('[Calendar] Error creating event:', errorMsg);
      alert('Failed to create event: ' + errorMsg);
    }
  }

  // Handle event deletion
  async function handleConfirmDelete() {
    if (!eventToDelete || !modalDateInfo) return;

    // Check if user has permission to delete events
    if (userRole === 'viewer') {
      alert('Viewers cannot delete events.');
      setShowDeleteConfirmModal(false);
      setEventToDelete(null);
      return;
    }

    setIsDeleting(true);
    try {
      console.log('[Calendar] Deleting event:', eventToDelete.id);
      await deleteEventFromServer(eventToDelete.id);
      console.log('[Calendar] Event deleted successfully');
      
      // Refresh calendar silently
      if (activeCalendarId) {
        await fetchEvents(activeCalendarId, false);
      }
      
      // Update modal with new events list (remove deleted event)
      const dateStr = modalDateInfo.date.toISOString().slice(0, 10);
      const updatedEventsForDate = events
        .filter(e => e._id !== eventToDelete.id) // Remove deleted event
        .filter(e => {
          const eventDate = new Date(e.start).toISOString().slice(0, 10);
          return eventDate === dateStr;
        })
        .map(e => ({
          id: e._id,
          title: e.title,
          description: e.description,
          date: dateStr,
          time: e.allDay ? undefined : new Date(e.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          color: e.color,
          location: e.location,
          allDay: e.allDay,
        }));
      
      setModalDateInfo({ date: modalDateInfo.date, events: updatedEventsForDate });
      
      // Close delete confirm modal
      setShowDeleteConfirmModal(false);
      setEventToDelete(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete event';
      console.error('[Calendar] Error deleting event:', errorMsg);
      alert('Failed to delete event: ' + errorMsg);
    } finally {
      setIsDeleting(false);
    }
  }

  // Load calendar when mounted or when active calendar changes
  useEffect(() => {
    if (!isAuthenticated || authLoading) {
      setCalendar(null);
      setEvents([]);
      return;
    }

    if (activeCalendarId && calendars.length > 0) {
      const selected = calendars.find((cal) => cal._id === activeCalendarId);
      setCalendar(selected || null);
      
      // Fetch events for the selected calendar
      if (selected) {
        setShowLoadingDummy(true);
        fetchEvents(selected._id);
      }
    } else {
      setCalendar(null);
      setEvents([]);
    }
  }, [isAuthenticated, authLoading, activeCalendarId, calendars]);

  // Fetch user's role for the calendar
  useEffect(() => {
    if (!activeCalendarId) {
      setUserRole(null);
      return;
    }

    const calendarId = activeCalendarId;

    async function loadUserRole() {
      try {
        const member = await getCurrentMember(calendarId);
        if (member) {
          console.log('[Calendar] User role for calendar:', member.role);
          setUserRole(member.role);
        } else {
          console.log('[Calendar] No member found for calendar');
          setUserRole(null);
        }
      } catch (err) {
        console.error('[Calendar] Error fetching user role:', err);
        setUserRole(null);
      }
    }

    loadUserRole();
  }, [activeCalendarId]);

  // Fetch events for a calendar
  async function fetchEvents(calendarId: string, showLoading: boolean = true) {
    setEventsLoading(true);
    if (showLoading) {
      setShowLoadingDummy(true);
    }
    const startTime = Date.now();
    try {
      const fetchedEvents = await getEventsByCalendar(calendarId);
      console.log('[Calendar] Events fetched:', fetchedEvents.length, 'events');
      
      // Ensure at least 1 second of loading display (only if showing loading)
      if (showLoading) {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < 1000) {
          await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
        }
      }
      
      setEvents(fetchedEvents);
      setShowLoadingDummy(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch events';
      console.error('[Calendar] Error fetching events:', errorMsg);
      setEvents([]);
      setShowLoadingDummy(false);
    } finally {
      setEventsLoading(false);
    }
  }

  // Wait for calendar data to be loaded before rendering
  const isReadyToRender = !calLoading && calendar !== null && !eventsLoading && !showLoadingDummy;

  if (!isReadyToRender) {
    return (
      <div className="w-fit flex flex-col items-center justify-center h-screen">
        <div className="text-3xl text-blue-400 font-semibold">Loading calendar...</div>
      </div>
    );
  }

  return (
    <>
      <div className="w-fit">
        {/* Calendar header - shows name and month/year */}
        <div className="mb-4 flex flex-row items-center justify-between gap-4 w-full px-4">
          <div
            className="text-4xl font-bold pb-2 underline underline-offset-4 decoration-blue-400"
          >
            {calendar.name}
          </div>
          <div
            className="text-4xl font-bold pb-2 underline underline-offset-4 decoration-blue-400"
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
                events={events.map(e => ({
                  id: e._id,
                  title: e.title,
                  description: e.description,
                  date: new Date(e.start).toISOString().slice(0, 10),
                  time: e.allDay ? undefined : new Date(e.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                  color: e.color,
                  location: e.location,
                  allDay: e.allDay,
                }))}
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
          <div className="bg-[#181f2a] rounded-xl shadow-xl p-8 w-full max-w-2xl border border-blue-700 relative">
            <div className="flex justify-between items-center mb-4">
              <div className="text-2xl font-semibold text-blue-400">
                {modalDateInfo.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <button
                className="ml-2 text-blue-300 hover:text-blue-400 text-3xl font-bold"
                onClick={handleDateModalClose}
                aria-label="Close"
                tabIndex={0}
              >
                ×
              </button>
            </div>
            <div className="mb-4 max-h-96 overflow-y-auto overflow-x-hidden">
              {modalDateInfo.events.length === 0 ? (
                <div className="text-blue-200 text-center text-lg">No events</div>
              ) : (
                <ul className="space-y-4 pr-2">
                  {modalDateInfo.events.map(event => (
                    <li 
                      key={event.id} 
                      className="text-base text-white rounded border-l-4 font-medium flex items-start justify-between gap-3" 
                      style={{ borderLeftColor: event.color || '#3b82f6', backgroundColor: event.color ? `rgba(${parseInt(event.color.slice(1,3),16)},${parseInt(event.color.slice(3,5),16)},${parseInt(event.color.slice(5,7),16)},0.3)` : 'rgba(59,130,246,0.3)' }}
                    >
                      <div className="px-4 py-2 flex-1">
                        <div className="font-bold flex items-center gap-2 text-lg">
                          <span>{event.title}</span>
                          {event.allDay ? (
                            <span className="font-normal italic text-blue-200">All Day</span>
                          ) : (
                            event.time && <span className="font-normal text-blue-200 text-base">{event.time}</span>
                          )}
                        </div>
                        {event.location && (
                          <div className="text-blue-200 text-sm mt-1">{event.location}</div>
                        )}
                        {event.description && (
                          <div className="text-blue-100 text-sm mt-2 not-italic">{event.description}</div>
                        )}
                      </div>
                      {(userRole === 'owner' || userRole === 'editor') && (
                        <button
                          onClick={() => {
                            setEventToDelete(event);
                            setShowDeleteConfirmModal(true);
                          }}
                          className="px-3 py-1 text-red-300 hover:text-red-400 hover:bg-red-900/30 rounded transition-colors flex-shrink-0 mt-1 text-xl"
                          aria-label="Delete event"
                          title="Delete event"
                        >
                          ✕
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {(userRole === 'owner' || userRole === 'editor') && (
              <div className="flex justify-end mt-6">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded shadow text-lg"
                  onClick={() => {
                    setEventModalDate(modalDateInfo.date);
                    setShowCreateEventModal(true);
                    setShowDateModal(false);
                  }}
                >
                  Add Event
                </button>
              </div>
            )}
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

      {/* Delete confirmation modal */}
      <Modal open={showDeleteConfirmModal} disableClickOutside={true}>
        <div className="bg-[#181f2a] rounded-xl shadow-xl p-6 w-full max-w-md border border-red-700">
          <h2 className="text-xl font-bold text-red-400 mb-4">Delete Event?</h2>
          <p className="text-blue-200 mb-2">
            Are you sure you want to delete this event?
          </p>
          {eventToDelete && (
            <div className="bg-[#232c3b] rounded p-3 mb-4 text-sm">
              <p className="font-semibold text-blue-300">{eventToDelete.title}</p>
              {eventToDelete.time && <p className="text-blue-200">{eventToDelete.time}</p>}
              {eventToDelete.location && <p className="text-blue-200">{eventToDelete.location}</p>}
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setShowDeleteConfirmModal(false);
                setEventToDelete(null);
              }}
              disabled={isDeleting}
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}