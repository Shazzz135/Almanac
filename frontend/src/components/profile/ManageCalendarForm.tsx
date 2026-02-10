import { useState, useEffect } from 'react';
import { useUser } from '../../hooks/auth/useAuth';
import { useCalendar } from '../../hooks/board/useCalendar';
import { updateCalendar, deleteCalendar } from '../../services/board/calendar';
import { getAllCalendarMembers, updateMemberRole, removeMemberFromCalendar } from '../../services/board/member';
import DeleteCalendarModal from './DeleteCalendarModal';
import ManageMembersTable from './ManageMembersTable';
import CalendarInfoSection from './CalendarInfoSection';
import CalendarActionsSection from './CalendarActionsSection';
import type { Member } from '../../types/board/memberTypes';

interface ManageCalendarFormProps {
  calendarName: string;
  description: string;
  calendarId?: string;
  onCancel: () => void;
}

export default function ManageCalendarForm({
  calendarName,
  description,
  calendarId,
  onCancel,
}: ManageCalendarFormProps) {
  const currentUser = useUser();
  const { refreshCalendars } = useCalendar();
  
  // Calendar info state
  const [name, setName] = useState(calendarName);
  const [desc, setDesc] = useState(description);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Members state
  const [members, setMembers] = useState<Member[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  
  // Staged changes (not yet submitted)
  const [stagedRoleChanges, setStagedRoleChanges] = useState<{ [memberId: string]: string }>({});
  const [stagedRemovals, setStagedRemovals] = useState<Set<string>>(new Set());
  
  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all members on mount
  useEffect(() => {
    if (!calendarId) {
      console.warn('[ManageCalendarForm] No calendarId provided');
      return;
    }

    const fetchMembers = async () => {
      setMembersLoading(true);
      try {
        console.log(`[ManageCalendarForm] Fetching members for calendar ${calendarId}`);
        const fetchedMembers = await getAllCalendarMembers(calendarId);
        console.log(`[ManageCalendarForm] Fetched ${fetchedMembers.length} members`, fetchedMembers);
        setMembers(fetchedMembers);
      } catch (err) {
        console.error('[ManageCalendarForm] Error fetching members:', err);
      } finally {
        setMembersLoading(false);
      }
    };

    fetchMembers();
  }, [calendarId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }

    if (!calendarId) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(`[ManageCalendarForm] Submitting all changes for calendar ${calendarId}`, {
        calendarUpdate: { name, desc },
        stagedRoleChanges,
        stagedRemovals: Array.from(stagedRemovals)
      });

      const changes: string[] = [];

      // 1. Update calendar info
      await updateCalendar(calendarId, name.trim(), desc.trim());
      changes.push('Calendar updated');
      console.log('[ManageCalendarForm] Calendar info updated');

      // 2. Apply staged role changes
      for (const [memberId, newRole] of Object.entries(stagedRoleChanges)) {
        console.log(`[ManageCalendarForm] Applying role change for member ${memberId}`);
        await updateMemberRole(memberId, newRole);
        changes.push(`Member role updated to ${newRole}`);
      }
      console.log('[ManageCalendarForm] Role changes applied');

      // 3. Apply staged removals
      for (const memberId of stagedRemovals) {
        console.log(`[ManageCalendarForm] Applying removal for member ${memberId}`);
        await removeMemberFromCalendar(memberId);
        changes.push('Member removed');
      }
      console.log('[ManageCalendarForm] Removals applied');

      // Clear staged changes after successful submission
      setStagedRoleChanges({});
      setStagedRemovals(new Set());
      console.log('[ManageCalendarForm] All changes submitted successfully');
      
      // Refresh calendar list to show updated data across the app
      console.log('[ManageCalendarForm] Refreshing calendar list after save');
      try {
        await refreshCalendars();
        console.log('[ManageCalendarForm] Calendar list refreshed successfully');
      } catch (refreshErr) {
        console.error('[ManageCalendarForm] Warning: Failed to refresh calendars after save:', refreshErr);
      }
      
      // Close the form
      onCancel();
    } catch (err) {
      console.error('[ManageCalendarForm] Error submitting changes:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRoleChange(memberId: string, newRole: string) {
    if (!memberId || !newRole) {
      console.warn('[ManageCalendarForm] Missing memberId or newRole');
      return;
    }

    console.log(`[ManageCalendarForm] Staging role change for member ${memberId} to role ${newRole}`);
    
    // Stage the change locally (don't call API yet)
    setStagedRoleChanges(prev => ({
      ...prev,
      [memberId]: newRole
    }));
    
    // Update local display
    setMembers(members.map(m => m._id === memberId ? { ...m, role: newRole as any } : m));
  }

  function handleRemoveMember(memberId: string) {
    if (!memberId) {
      console.warn('[ManageCalendarForm] No member ID provided');
      return;
    }

    // Check if trying to remove themselves
    const memberToRemove = members.find(m => m._id === memberId);
    if (memberToRemove && memberToRemove.user_id === currentUser?.id) {
      console.warn('[ManageCalendarForm] Attempted to remove self');
      return;
    }

    console.log(`[ManageCalendarForm] Staging removal for member ${memberId}`);
    
    // Stage the removal locally (don't call API yet)
    setStagedRemovals(prev => new Set(prev).add(memberId));
    
    // Update local display
    setMembers(members.filter(m => m._id !== memberId));
  }

  async function handleDeleteCalendar() {
    if (!calendarId) {
      console.warn('[ManageCalendarForm] No calendar ID provided for deletion');
      return;
    }

    setIsDeleting(true);
    try {
      console.log(`[ManageCalendarForm] Deleting calendar ${calendarId}`);
      await deleteCalendar(calendarId);
      console.log('[ManageCalendarForm] Calendar deleted successfully');
      
      // Refresh calendar list to show updated data across the app
      console.log('[ManageCalendarForm] Refreshing calendar list after delete');
      try {
        await refreshCalendars();
        console.log('[ManageCalendarForm] Calendar list refreshed successfully after delete');
      } catch (refreshErr) {
        console.error('[ManageCalendarForm] Warning: Failed to refresh calendars after delete:', refreshErr);
      }
      
      // Close the form
      onCancel();
    } catch (err) {
      console.error('[ManageCalendarForm] Error deleting calendar:', err);
    } finally {
      setIsDeleting(false);
    }
  }

  const isCurrentUserOwner = members.some(
    m => m.user_id === currentUser?.id && m.role === 'owner'
  );

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Manage Calendar</h2>
        
        <div className="flex flex-col h-[400px]">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto pr-2 mb-4">
            {/* Calendar Info Section */}
            <CalendarInfoSection
              name={name}
              description={desc}
              onNameChange={setName}
              onDescriptionChange={setDesc}
              disabled={isSubmitting}
            />

            {/* Members Section */}
            <ManageMembersTable
              members={members}
              isLoading={membersLoading}
              error={null}
              currentUserId={currentUser?.id}
              isCurrentUserOwner={isCurrentUserOwner}
              updatingRoleId={null}
              removingMemberId={null}
              onRoleChange={handleRoleChange}
              onRemove={handleRemoveMember}
            />
          </div>

          {/* Actions Section */}
          <CalendarActionsSection
            isCurrentUserOwner={isCurrentUserOwner}
            isSubmitting={isSubmitting}
            isDeleting={isDeleting}
            onDeleteClick={() => setDeleteConfirmOpen(true)}
            onCancelClick={onCancel}
          />
        </div>
      </form>

      {/* Delete Confirmation Modal - using extracted component */}
      <DeleteCalendarModal
        open={deleteConfirmOpen}
        calendarName={name}
        isDeleting={isDeleting}
        deleteError={null}
        onClose={() => {
          setDeleteConfirmOpen(false);
        }}
        onConfirm={handleDeleteCalendar}
      />
    </>
  );
}
