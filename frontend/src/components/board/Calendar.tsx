import { useEffect, useState } from 'react';
import CalendarEventPopup from './CalendarEventPopup';
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

// Mocked event data for demonstration
const MOCK_EVENTS = [
    { id: '1', title: 'Team Meeting', date: '2026-02-10', time: '10:00 AM' },
    { id: '2', title: 'Doctor Appointment', date: '2026-02-12', time: '3:00 PM' },
    { id: '3', title: 'Birthday Party', date: '2026-02-10', time: '7:00 PM' },
    { id: '4', title: 'Project Deadline', date: '2026-02-15' },
];

export default function Calendar({ displayMonth, displayYear }: CalendarProps) {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { calendars, activeCalendarId, isLoading: calLoading } = useCalendar();
    const pulseClass = useGradientPulse();
    const [calendar, setCalendar] = useState<CalendarType | null>(null);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate();
    const days = generateCalendarDays(displayYear, displayMonth);
    const numRows = days.length / 7;
    const isCurrentMonth = displayMonth === currentMonth && displayYear === currentYear;

    // Dropdown state
    const [dropdownIdx, setDropdownIdx] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    // Board-level event creation modal
    const [showCreateEventModal, setShowCreateEventModal] = useState(false);
    const [eventModalDate, setEventModalDate] = useState<Date | null>(null);

    // Find events for a given date (YYYY-MM-DD)
    function getEventsForDate(date: Date) {
        const key = date.toISOString().slice(0, 10);
        return MOCK_EVENTS.filter(e => e.date === key);
    }

    // Handle day click
    function handleDayClick(dayObj: any, idx: number) {
        // Allow popups for all days, even those not in the current month
        // Calculate the correct date for prev/next month days
        let date: Date;
        if (dayObj.isCurrentMonth) {
            date = new Date(displayYear, displayMonth, dayObj.day);
        } else if (dayObj.isPrevMonth) {
            // Previous month
            const prevMonth = displayMonth === 0 ? 11 : displayMonth - 1;
            const prevYear = displayMonth === 0 ? displayYear - 1 : displayYear;
            date = new Date(prevYear, prevMonth, dayObj.day);
        } else {
            // Next month
            const nextMonth = displayMonth === 11 ? 0 : displayMonth + 1;
            const nextYear = displayMonth === 11 ? displayYear + 1 : displayYear;
            date = new Date(nextYear, nextMonth, dayObj.day);
        }
        setSelectedDate(date);
        setDropdownIdx(idx === dropdownIdx ? null : idx);
    }

    useEffect(() => {
        // Only set calendar if user is authenticated and auth has finished loading
        if (!isAuthenticated || authLoading) {
            setCalendar(null);
            return;
        }

        // Find and set the active calendar
        if (activeCalendarId && calendars.length > 0) {
            const selected = calendars.find(cal => cal._id === activeCalendarId);
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
                <div className=" mb-4 flex flex-row items-center justify-between gap-4 w-full px-4">
                    <div className={`text-4xl font-bold pb-2 underline underline-offset-4 decoration-blue-400 ${pulseClass}`}>
                        {calendar.name}
                    </div>
                    <div className={`text-4xl font-bold pb-2 underline underline-offset-4 decoration-blue-400 ${pulseClass}`}>
                        {new Date(displayYear, displayMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </div>
                </div>
                <div className={`grid grid-cols-7 ${numRows === 6 ? 'grid-rows-6' : 'grid-rows-5'} gap-0 relative`}>
                    {days.map((dayObj, idx) => {
                        // Calculate row and column
                        const row = Math.floor(idx / 7);
                        const col = idx % 7;
                        // Only show right border if not last column, and bottom border if not last row
                        const borderRight = col !== 6 ? 'border-r border-gray-500' : '';
                        const borderBottom = row !== (numRows - 1) ? 'border-b border-gray-500' : '';
                        const isActive = isCurrentMonth && dayObj.isCurrentMonth && dayObj.day === currentDay;
                        // Days of week labels
                        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        const isDropdownOpen = dropdownIdx === idx && selectedDate;
                        return (
                            <div
                                key={idx}
                                className={`h-[101px] w-[144px] flex items-end justify-start pt-1 pb-2.5 px-3 ${borderRight} ${borderBottom} ${isActive ? 'bg-blue-100/15' : ''} transition-all duration-200 hover:bg-gray-400/10 hover:shadow-md cursor-pointer relative`}
                                onClick={() => handleDayClick(dayObj, idx)}
                            >
                                <span className={`text-base font-semibold ${isActive ? pulseClass + ' text-blue-400' : dayObj.isCurrentMonth ? 'text-gray-300' : 'text-gray-500 opacity-50'}`}>
                                    {dayObj.day}
                                    {row === 0 && (
                                        <span className="ml-1 text-sm text-gray-400 font-normal align-bottom uppercase">
                                            {daysOfWeek[col]}
                                        </span>
                                    )}
                                </span>
                                {isDropdownOpen && selectedDate && (
                                    <div
                                      className={`absolute z-50 ${col <= 3 ? 'left-0' : 'right-0'} ${row <= 2 ? 'top-full mt-8' : 'bottom-full mb-8'}`}
                                    >
                                        <CalendarEventPopup
                                            date={selectedDate}
                                            events={getEventsForDate(selectedDate)}
                                            onClose={() => setDropdownIdx(null)}
                                            col={col}
                                            row={row}
                                            onCreateEventClick={(date) => {
                                                setEventModalDate(date);
                                                setShowCreateEventModal(true);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <Modal open={showCreateEventModal}>
                <div className="bg-[#181f2a] rounded-xl shadow-xl p-4 w-full max-w-md border border-blue-700">
                    <h2 className="text-xl font-bold text-blue-300 mb-4">Create Event</h2>
                    {eventModalDate && (
                        <EventForm
                            defaultDate={eventModalDate}
                            onCancel={() => setShowCreateEventModal(false)}
                            onSubmit={(event) => {
                                // TODO: Replace with real event creation logic
                                // eslint-disable-next-line no-console
                                console.log('Event created:', event);
                                setShowCreateEventModal(false);
                            }}
                        />
                    )}
                </div>
            </Modal>
        </>
    );
}