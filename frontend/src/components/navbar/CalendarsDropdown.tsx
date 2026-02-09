import { useRef } from 'react';

interface CalendarsDropdownProps {
  calendars: any[];
  calLoading: boolean;
  calError: string | null;
  dropdownOpen: boolean;
  setDropdownOpen: (v: boolean) => void;
  setShowCreateModal: (v: boolean) => void;
}

export default function CalendarsDropdown({ calendars, calLoading, calError, dropdownOpen, setDropdownOpen, setShowCreateModal }: CalendarsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base border border-blue-400/60 text-blue-300 font-semibold rounded-lg hover:bg-blue-500/20 hover:border-blue-300 hover:text-blue-100 transition-all duration-200 whitespace-nowrap flex items-center gap-2"
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
      >
        <span>Calendars</span>
        <svg className={`w-4 h-4 ml-1 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-blue-400/40 rounded-lg shadow-lg z-50 py-2 max-h-96 overflow-y-auto animate-fadeIn">
          {calLoading ? (
            <div className="px-4 py-3 text-gray-300 text-center">Loading...</div>
          ) : calError ? (
            <div className="px-4 py-3 text-red-400 text-center">{calError}</div>
          ) : calendars.length === 0 ? (
            <div className="px-4 py-3 text-gray-400 text-center">No calendars found</div>
          ) : (
            <>
              {calendars.map((cal, idx) => (
                <div key={cal._id || idx} className="flex items-center gap-3 px-4 py-2 hover:bg-blue-500/10 cursor-pointer">
                  {cal.type === 'personal' ? (
                    <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                  ) : (
                    <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2c0-2.21-3.58-4-8-4s-8 1.79-8 4v2h5m4-10a4 4 0 110-8 4 4 0 010 8zm6 8v-2a4 4 0 00-3-3.87" /></svg>
                  )}
                  <span className="text-white font-medium truncate">{cal.name}</span>
                </div>
              ))}
            </>
          )}
          {calendars.length < 3 && !calLoading && !calError && (
            <div className="mt-2 px-4">
              <button
                onClick={() => {
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
