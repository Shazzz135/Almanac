import { useState, useEffect } from 'react';
import ManageCalendarForm from './ManageCalendarForm';
import RemoveCalendarModal from './RemoveCalendarModal';
import CalendarListItem from './CalendarListItem';
import Modal from '../ui/Modal';
import { useCalendar } from '../../hooks/board/useCalendar';
import { getCurrentMember, removeMemberFromCalendar } from '../../services/board/member';
import type { Member } from '../../types/board/memberTypes';

export default function ManageCalendars() {
  const { calendars, isLoading, refreshCalendars } = useCalendar();
  const [manageIdx, setManageIdx] = useState<number | null>(null);
  const [memberRoles, setMemberRoles] = useState<{ [key: string]: Member | null }>({});
  const [rolesLoading, setRolesLoading] = useState(false);
  const [removeConfirmIdx, setRemoveConfirmIdx] = useState<number | null>(null);
  const [removing, setRemoving] = useState(false);



  // Fetch user's role for each calendar
  useEffect(() => {
    if (calendars.length === 0) {
      setMemberRoles({});
      return;
    }

    setRolesLoading(true);
    Promise.all(
      calendars.map((cal) =>
        getCurrentMember(cal._id)
          .then((member) => {
            console.log(`✓ Fetched member for calendar ${cal.name}:`, member);
            return { calendarId: cal._id, member };
          })
          .catch((err) => {
            console.error(`✗ Error fetching member for calendar ${cal.name}:`, err);
            return { calendarId: cal._id, member: null };
          })
      )
    )
      .then((results) => {
        const roles: { [key: string]: Member | null } = {};
        results.forEach(({ calendarId, member }) => {
          roles[calendarId] = member;
        });
        setMemberRoles(roles);
        console.log('Member roles loaded:', roles);
      })
      .finally(() => setRolesLoading(false));
  }, [calendars]);

  const isOwner = (calendarId: string) => {
    return memberRoles[calendarId]?.role === 'owner';
  };

  const handleRemoveCalendar = async (idx: number) => {
    const cal = calendars[idx];
    const member = memberRoles[cal._id];

    console.log('Remove calendar attempt:', { calendar: cal.name, member });

    if (!member?._id) {
      console.error('Cannot remove: member not found or missing _id');
      return;
    }

    setRemoving(true);
    try {
      console.log(`Deleting member ${member._id} from calendar ${cal.name}...`);
      await removeMemberFromCalendar(member._id);
      console.log('✓ Member deleted successfully');
      
      // Mark as successful and close modal
      setRemoveConfirmIdx(null);
      
      console.log('✓ Remove modal will close');
      
      // Refresh the calendar list after removal
      console.log('Refreshing calendar list...');
      try {
        await refreshCalendars();
        console.log('✓ Calendars refreshed successfully');
      } catch (refreshErr) {
        console.error('[WARNING] Failed to refresh calendars after removal, but removal succeeded:', refreshErr);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Error removing calendar:', { error: err, errorMsg });
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="bg-gray-900/50 border border-blue-500/30 rounded-lg p-6 mt-8 relative">
      <h2 className="text-2xl font-bold text-blue-100 mb-4 text-center">Manage Calendars</h2>
      {isLoading || rolesLoading ? (
        <div className="text-blue-300 text-center">Loading...</div>
      ) : calendars.length === 0 ? (
        <div className="text-gray-400 text-center">You are not a member of any calendars.</div>
      ) : (
        <ul className="">
          {calendars.map((cal, idx) => (
            <CalendarListItem
              key={cal._id}
              calendar={cal}
              isOwner={isOwner(cal._id)}
              isRemoving={removing}
              isLast={idx === calendars.length - 1}
              onManage={() => setManageIdx(idx)}
              onRemove={() => setRemoveConfirmIdx(idx)}
            />
          ))}
          {/* Modal for managing calendar */}
          {manageIdx !== null && calendars[manageIdx] && (
            <Modal open={true} disableClickOutside>
              <ManageCalendarForm
                calendarName={calendars[manageIdx].name}
                description={calendars[manageIdx].description || ''}
                calendarId={calendars[manageIdx]._id}
                onCancel={() => setManageIdx(null)}
              />
            </Modal>
          )}
        </ul>
      )}
      {/* Confirmation Modal for removing calendar - using extracted component */}
      {removeConfirmIdx !== null && calendars[removeConfirmIdx] && (
        <RemoveCalendarModal
          open={true}
          calendarName={calendars[removeConfirmIdx].name}
          isRemoving={removing}
          error={null}
          success={false}
          onClose={() => {
            setRemoveConfirmIdx(null);
          }}
          onConfirm={() => handleRemoveCalendar(removeConfirmIdx)}
        />
      )}
    </div>
  );
}
