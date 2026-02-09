
import { useEffect, useState } from 'react';
import ManageCalendarForm from './ManageCalendarForm';
import Modal from '../ui/Modal';
import { getUserCalendar } from '../../services/board/calendar';
import type { Calendar } from '../../services/board/calendar';

export default function ManageCalendars() {

  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manageIdx, setManageIdx] = useState<number | null>(null);

  useEffect(() => {
    getUserCalendar()
      .then((data) => {
        if (data && Array.isArray(data.calendars)) {
          setCalendars(data.calendars);
        } else {
          setCalendars([]);
        }
      })
      .catch(() => setError('Failed to load calendars'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-900/50 border border-blue-500/30 rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-blue-100 mb-4 text-center">Manage Calendars</h2>
      {loading ? (
        <div className="text-blue-300 text-center">Loading...</div>
      ) : error ? (
        <div className="text-red-400 text-center">{error}</div>
      ) : calendars.length === 0 ? (
        <div className="text-gray-400 text-center">You are not a member of any calendars.</div>
      ) : (
        <ul className="">
          {calendars.map((cal, idx) => (
            <li key={cal._id + '-row'}>
              <div className="flex items-center gap-3 py-3">
                {cal.type === 'personal' ? (
                  <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                ) : (
                  <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2c0-2.21-3.58-4-8-4s-8 1.79-8 4v2h5m4-10a4 4 0 110-8 4 4 0 010 8zm6 8v-2a4 4 0 00-3-3.87" /></svg>
                )}
                <span className="text-white font-medium truncate">{cal.name}</span>
                <span className="ml-auto text-xs text-gray-400 uppercase">{cal.type}</span>
                <button
                  className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-150"
                  onClick={() => setManageIdx(idx)}
                >
                  Manage
                </button>
              </div>
              {idx !== calendars.length - 1 && (
                <div key={cal._id + '-divider'} className="border-t border-blue-500/20 w-full mx-auto" />
              )}
            </li>
          ))}
              {/* Modal for managing calendar */}
              {manageIdx !== null && calendars[manageIdx] && (
                <Modal open={true} disableClickOutside>
                  <ManageCalendarForm
                    calendarName={calendars[manageIdx].name}
                    description={calendars[manageIdx].description || ''}
                    calendarId={calendars[manageIdx]._id}
                    onCancel={() => setManageIdx(null)}
                    onSubmit={(data) => {
                      setCalendars(prev => prev.map((c, i) => i === manageIdx ? { ...c, ...data } : c));
                      setManageIdx(null);
                    }}
                  />
                </Modal>
              )}
        </ul>
      )}
    </div>
  );
}
