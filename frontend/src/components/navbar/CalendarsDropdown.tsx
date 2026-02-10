import { useRef, useEffect } from 'react';
import { User, Users } from 'lucide-react';
import { useCalendar } from '../../hooks/board/useCalendar';

interface CalendarsDropdownProps {
  dropdownOpen: boolean;
  setDropdownOpen: (v: boolean) => void;
  setShowCreateModal: (v: boolean) => void;
}

export default function CalendarsDropdown({ dropdownOpen, setDropdownOpen, setShowCreateModal }: CalendarsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { calendars, activeCalendarId, setActiveCalendarId, isLoading, error } = useCalendar();

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen, setDropdownOpen]);

  const handleCalendarSelect = (calendarId: string) => {
    setActiveCalendarId(calendarId);
    setDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setDropdownOpen(!dropdownOpen);
        }}
        className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base border border-blue-400/60 text-blue-300 font-semibold rounded-lg hover:bg-blue-500/20 hover:border-blue-300 hover:text-blue-100 transition-all duration-200 whitespace-nowrap flex items-center gap-2"
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
      >
        <span>Calendars</span>
        <svg className={`w-4 h-4 ml-1 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-blue-400/40 rounded-lg shadow-lg z-50 py-2 max-h-96 overflow-y-auto animate-fadeIn" onClick={(e) => e.stopPropagation()}>
          {isLoading ? (
            <div className="px-4 py-3 text-gray-300 text-center">Loading...</div>
          ) : error ? (
            <div className="px-4 py-3 text-red-400 text-center">{error}</div>
          ) : calendars.length === 0 ? (
            <div className="px-4 py-3 text-gray-400 text-center">No calendars found</div>
          ) : (
            <>
              {calendars.map((cal, idx) => (
                <div
                  key={cal._id || idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCalendarSelect(cal._id);
                  }}
                  className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${
                    activeCalendarId === cal._id
                      ? 'bg-blue-500/30 border-l-2 border-blue-400'
                      : 'hover:bg-blue-500/10'
                  }`}
                >
                  <span className="text-white font-medium truncate flex-1">{cal.name}</span>
                  <div className="flex-shrink-0">
                    {cal.type === 'personal' ? (
                      <User className="w-5 h-5 text-blue-300" strokeWidth={2} />
                    ) : (
                      <Users className="w-5 h-5 text-blue-300" strokeWidth={2} />
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
          {calendars.length < 3 && !isLoading && !error && (
            <div className="mt-2 px-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(false);
                  setShowCreateModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition-all duration-200 mt-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Calendar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
