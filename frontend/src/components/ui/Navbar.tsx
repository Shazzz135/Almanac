
import { useGradientPulse } from '../../hooks/ui/useGradientPulse';
import { useAuth } from '../../hooks/auth/useAuth';
import { useNavigate } from 'react-router-dom';
import logo from '../../../public/Logo.webp';
import { useEffect, useRef, useState } from 'react';
import { getUserCalendar } from '../../services/board/calendar';
import type { Calendar } from '../../services/board/calendar';

export default function Navbar() {
  const pulseClass = useGradientPulse();
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [calLoading, setCalLoading] = useState(false);
  const [calError, setCalError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch calendars when dropdown opens for the first time
  useEffect(() => {
    if (dropdownOpen && calendars.length === 0 && !calLoading) {
      setCalLoading(true);
      getUserCalendar()
        .then((data) => {
          if (data && Array.isArray(data.calendars)) {
            setCalendars(data.calendars);
          } else {
            setCalendars([]);
          }
        })
        .catch(() => {
          setCalError('Failed to load calendars');
        })
        .finally(() => setCalLoading(false));
    }
  }, [dropdownOpen, calendars.length, calLoading]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-transparent backdrop-blur-md border-b border-blue-500/30 flex items-center justify-between px-3 sm:px-4 md:px-8 z-50">
      {/* Logo Section - Left */}
      <div 
        onClick={() => navigate(isAuthenticated ? '/board' : '/')}
        className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity min-w-0"
      >
        <div className={`text-xl sm:text-2xl md:text-3xl font-bold flex-shrink-0`}>
          <img src={logo} alt="Almanac Logo" className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10" />
        </div>
        <div className={`text-2xl sm:text-3xl md:text-4xl font-semibold ${pulseClass} truncate`}>
          Almanac
        </div>
      </div>

      {/* Right Section - Conditional Rendering */}
      <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3">
        {isLoading ? null : (
          !isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/auth/login')}
                className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base border border-blue-400/60 text-blue-300 font-semibold rounded-lg hover:bg-blue-500/20 hover:border-blue-300 hover:text-blue-100 transition-all duration-200 whitespace-nowrap"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/auth/signup')}
                className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-blue-400 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 whitespace-nowrap"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <>
              {/* Calendars Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
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
                            {/* Icon based on type */}
                            {cal.type === 'personal' ? (
                              <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                            ) : (
                              <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2c0-2.21-3.58-4-8-4s-8 1.79-8 4v2h5m4-10a4 4 0 110-8 4 4 0 010 8zm6 8v-2a4 4 0 00-3-3.87" /></svg>
                            )}
                            <span className="text-white font-medium truncate">{cal.name}</span>
                            <span className="ml-auto text-xs text-gray-400 uppercase">{cal.type}</span>
                          </div>
                        ))}
                      </>
                    )}
                    {/* Add Calendar Button */}
                    {calendars.length < 3 && !calLoading && !calError && (
                      <div className="mt-2 px-4">
                        <button
                          onClick={() => {/* TODO: open add calendar modal or navigate */}}
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
              {/* Profile Button */}
              <button 
                onClick={() => navigate('/profile')}
                className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base border border-blue-400/60 text-blue-300 font-semibold rounded-lg hover:bg-blue-500/20 hover:border-blue-300 hover:text-blue-100 transition-all duration-200 whitespace-nowrap"
              >
                Profile
              </button>
            </>
          )
        )}
      </div>
    </nav>
  );
}