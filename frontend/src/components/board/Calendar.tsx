import { generateCalendarDays } from '../../utils/getCalendarData';

export default function Calendar() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate();
    const days = generateCalendarDays(currentYear, currentMonth);
    return (
        <div className="scale-150 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-transparent">
            {/* Title and Month */}
            <div className="grid grid-cols-7 gap-0 sm:gap-2 mb-1 sm:mb-4">
                
            </div>
            {/* Weekday labels */}
            <div className="grid grid-cols-7 gap-0 sm:gap-2 mb-1 sm:mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-blue-400 py-0.5 sm:py-2 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7">
                {days.map((dayObj, index) => (
                    <div
                        key={index}
                        className={`
                            aspect-square flex items-end justify-start p-1 cursor-pointer
                            transition-all duration-200
                            ${dayObj.day 
                                ? 'hover:bg-gray-700/20'
                                : ''
                            }
                            ${dayObj.isCurrentMonth && dayObj.day === currentDay
                                ? 'text-blue-400 font-bold' 
                                : dayObj.isCurrentMonth
                                ? 'text-gray-300 hover:text-white'
                                : 'text-gray-500 opacity-50'
                            }
                            ${index % 7 !== 6 ? 'border-r border-gray-600/50' : ''}
                            ${Math.floor(index / 7) < 4 ? 'border-b border-gray-600/50' : ''}
                        `}
                    >
                        <span className="text-xs md:text-sm font-semibold">{dayObj.day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}