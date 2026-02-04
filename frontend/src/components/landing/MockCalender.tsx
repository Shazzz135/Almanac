export default function MockCalender() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    const currentDay = currentDate.getDate();
    
    // Create array of days with previous and next month dates
    const days = [];
    
    // Add previous month's trailing dates
    for (let i = firstDay - 1; i >= 0; i--) {
        days.push({
            day: daysInPrevMonth - i,
            isCurrentMonth: false,
            isPrevMonth: true
        });
    }
    
    // Add current month's dates
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({
            day: i,
            isCurrentMonth: true,
            isPrevMonth: false
        });
    }
    
    // Add next month's leading dates to fill 5 rows (35 cells)
    const totalCells = 35;
    for (let i = 1; days.length < totalCells; i++) {
        days.push({
            day: i,
            isCurrentMonth: false,
            isPrevMonth: false
        });
    }
    
    return (
        <div className="flex-1 w-full md:w-auto flex justify-center items-center px-3 sm:px-4 md:px-6 pb-4 md:pb-0">
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-transparent backdrop-blur-md p-1 sm:p-4 md:p-6 border border-gray-600 rounded-xl">
                {/* Header */}
                <div className="mb-2 sm:mb-6">
                    <h2 className="text-xs sm:text-xl md:text-2xl font-bold text-center px-1 py-1 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                        {monthName} {currentYear}
                    </h2>
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
                                aspect-square flex items-end justify-start p-2 cursor-pointer
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
        </div>
    )
}