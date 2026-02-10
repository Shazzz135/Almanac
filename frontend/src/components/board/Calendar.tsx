import { useEffect, useState } from 'react';
import { generateCalendarDays } from '../../utils/board/getCalendarData';
import { useGradientPulse } from '../../hooks/ui/useGradientPulse';
import { useAuth } from '../../hooks/auth/useAuth';
import { useCalendar } from '../../hooks/board/useCalendar';
import type { Calendar as CalendarType } from '../../services/board/calendar';

interface CalendarProps {
    displayMonth: number;
    displayYear: number;
}

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
        <div className="w-fit">
            <div className=" mb-4 flex flex-row items-center justify-between gap-4 w-full px-4">
                <div className={`text-4xl font-bold pb-2 underline underline-offset-4 decoration-blue-400 ${pulseClass}`}>
                    {calendar.name}
                </div>
                <div className={`text-4xl font-bold pb-2 underline underline-offset-4 decoration-blue-400 ${pulseClass}`}>
                    {new Date(displayYear, displayMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </div>
            </div>
            <div className={`grid grid-cols-7 ${numRows === 6 ? 'grid-rows-6' : 'grid-rows-5'} gap-0`}>
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
                    return (
                        <div
                            key={idx}
                            className={`h-[101px] w-[144px] flex items-end justify-start pt-1 pb-2.5 px-3 ${borderRight} ${borderBottom} ${isActive ? 'bg-blue-100/15' : ''} transition-all duration-200 hover:bg-gray-400/10 hover:shadow-md cursor-pointer`}
                        >
                            <span className={`text-base font-semibold ${isActive ? pulseClass + ' text-blue-400' : dayObj.isCurrentMonth ? 'text-gray-300' : 'text-gray-500 opacity-50'}`}>
                                {dayObj.day}
                                {row === 0 && (
                                    <span className="ml-1 text-sm text-gray-400 font-normal align-bottom uppercase">
                                        {daysOfWeek[col]}
                                    </span>
                                )}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}