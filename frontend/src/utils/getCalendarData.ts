// Utility to generate calendar days for a given month/year
export interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isPrevMonth: boolean;
}

export function generateCalendarDays(year: number, month: number, totalCells = 35): CalendarDay[] {
  // month: 0-indexed (0 = January)
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days: CalendarDay[] = [];

  // Add previous month's trailing dates
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPrevMonth: true,
    });
  }

  // Add current month's dates
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      isPrevMonth: false,
    });
  }

  // Add next month's leading dates to fill totalCells
  for (let i = 1; days.length < totalCells; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      isPrevMonth: false,
    });
  }

  return days;
}
