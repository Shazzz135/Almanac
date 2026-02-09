import { useEffect, useState } from 'react';
import { generateCalendarDays } from '../../utils/board/getCalendarData';
import { useGradientPulse } from '../../hooks/ui/useGradientPulse';
import { getUserCalendar } from '../../services/board/calendar';
import type { Calendar as CalendarType } from '../../services/board/calendar';

interface CalendarProps {
    displayMonth: number;
    displayYear: number;
}

export default function Calendar({ displayMonth, displayYear }: CalendarProps) {
    const pulseClass = useGradientPulse();
    const [calendar, setCalendar] = useState<CalendarType | null>(null);
    const [loading, setLoading] = useState(true);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate();
    const days = generateCalendarDays(displayYear, displayMonth);
    const numRows = days.length / 7;
    const isCurrentMonth = displayMonth === currentMonth && displayYear === currentYear;

    useEffect(() => {
        getUserCalendar()
            .then((data) => {
                if (data && Array.isArray(data.calendars) && data.calendars.length > 0) {
                    setCalendar(data.calendars[0]);
                } else {
                    setCalendar(null);
                }
            })
            .catch(() => setCalendar(null))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="w-fit">
            <div className=" mb-4 flex flex-row items-center justify-between gap-4 w-full px-4">
                <div className={`text-4xl font-bold pb-2 underline underline-offset-4 decoration-blue-400 ${pulseClass}`}>
                    {loading ? 'Loading...' : calendar?.name || 'My Calendar'}
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