
import { useAuth } from '../../hooks/auth/useAuth';
import { useGradientPulse } from '../../hooks/ui/useGradientPulse';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCalendar } from '../../hooks/board/useCalendar';
import { getCurrentMember } from '../../services/board/member';
import { createCalendar } from '../../services/board/calendar';
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
  const pulseClass = useGradientPulse();
  const location = useLocation();
  const { activeCalendarId, refreshCalendars } = useCalendar();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [memberRole, setMemberRole] = useState<'owner' | 'editor' | 'viewer' | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const handleCreateCalendar = async (data: { name: string; description: string }) => {
    try {
      console.log('[Navbar] Creating calendar:', data.name);
      await createCalendar(data.name, data.description);
      console.log('[Navbar] Calendar created successfully, refreshing list');
      await refreshCalendars();
      console.log('[Navbar] Calendar list refreshed');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[Navbar] Failed to create calendar:', errorMsg);
      throw err;
    }
  };

  // Dropdown outside click logic is now handled in CalendarsDropdown subcomponent

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-transparent backdrop-blur-md border-b border-blue-500/30 flex items-center justify-between px-3 sm:px-4 md:px-8 z-50">
      {/* Logo Section - Left */}
      <LogoSection isAuthenticated={isAuthenticated} pulseClass={pulseClass} />

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
                  <InviteUserButton memberRole={memberRole} calendarId={activeCalendarId} />
                  <CalendarsDropdown
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
          onSubmit={handleCreateCalendar}
          onCancel={() => {
            setShowCreateModal(false);
          }}
        />
      </Modal>
    </nav>
  );
}