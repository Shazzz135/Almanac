

import { useAuth } from '../../hooks/auth/useAuth';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getUserCalendar } from '../../services/board/calendar';
import type { Calendar } from '../../services/board/calendar';
import { getCurrentMember } from '../../services/board/member';
import Modal from './Modal';
import CreateCalendarForm from '../board/CreateCalendarForm';
import LogoSection from '../navbar/LogoSection';
import AuthButtons from '../navbar/AuthButtons';
import InviteUserButton from '../navbar/InviteUserButton';
import CalendarsDropdown from '../navbar/CalendarsDropdown';
import ProfileButton from '../navbar/ProfileButton';
import ToCalendarButton from '../navbar/ToCalendarButton';

export default function Navbar() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [calLoading, setCalLoading] = useState(false);
  const [calError, setCalError] = useState<string | null>(null);
  const [activeCalendarId, setActiveCalendarId] = useState<string | null>(null);
  const [memberRole, setMemberRole] = useState<'owner' | 'editor' | 'viewer' | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch calendars and member role on mount
  useEffect(() => {
    if (!calLoading && calendars.length === 0) {
      setCalLoading(true);
      getUserCalendar()
        .then((data) => {
          if (data && Array.isArray(data.calendars)) {
            setCalendars(data.calendars);
            // Set active calendar to first one (or customize as needed)
            if (data.calendars.length > 0) {
              setActiveCalendarId(data.calendars[0]._id);
            }
          } else {
            setCalendars([]);
            setActiveCalendarId(null);
          }
        })
        .catch(() => {
          setCalError('Failed to load calendars');
        })
        .finally(() => setCalLoading(false));
    }
  }, [calendars.length, calLoading]);

  // Fetch member role for active calendar
  useEffect(() => {
    if (activeCalendarId) {
      getCurrentMember(activeCalendarId).then((member) => {
        setMemberRole(member?.role || null);
      });
    } else {
      setMemberRole(null);
    }
  }, [activeCalendarId]);

  // Dropdown outside click logic is now handled in CalendarsDropdown subcomponent

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-transparent backdrop-blur-md border-b border-blue-500/30 flex items-center justify-between px-3 sm:px-4 md:px-8 z-50">
      {/* Logo Section - Left */}
      <LogoSection isAuthenticated={isAuthenticated} />

      {/* Right Section - Conditional Rendering */}
      <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3">
        {isLoading ? null : (
          !isAuthenticated ? (
            <AuthButtons />
          ) : (
            <>
              {/* Hide InviteUserButton and CalendarsDropdown on profile page */}
              {location.pathname !== '/profile' && (
                <>
                  <InviteUserButton memberRole={memberRole} />
                  <CalendarsDropdown
                    calendars={calendars}
                    calLoading={calLoading}
                    calError={calError}
                    dropdownOpen={dropdownOpen}
                    setDropdownOpen={setDropdownOpen}
                    setShowCreateModal={setShowCreateModal}
                  />
                </>
              )}
              {location.pathname === '/profile' ? <ToCalendarButton /> : <ProfileButton />}
            </>
          )
        )}
      </div>
      {/* Create Calendar Modal */}
      <Modal open={showCreateModal} disableClickOutside>
        <CreateCalendarForm
          onSubmit={() => {}}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </nav>
  );
}