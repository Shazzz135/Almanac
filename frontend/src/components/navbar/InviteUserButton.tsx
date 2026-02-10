import Modal from '../ui/Modal';
import InviteUserForm from '../board/InviteUserForm';
import { useState } from 'react';
import type { MemberRole } from '../../types/board/memberTypes';

interface InviteUserButtonProps {
  memberRole: MemberRole | null;
  calendarId?: string | null;
}

export default function InviteUserButton({ memberRole, calendarId }: InviteUserButtonProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  if (memberRole !== 'owner' || !calendarId) return null;

  const handleInviteSuccess = () => {
    setShowInviteModal(false);
  };

  return (
    <>
      <button
        className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base border border-blue-400/60 text-blue-300 font-semibold rounded-lg hover:bg-blue-500/20 hover:border-blue-300 hover:text-blue-100 transition-all duration-200 whitespace-nowrap flex items-center gap-0.5"
        onClick={() => setShowInviteModal(true)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <Modal open={showInviteModal} disableClickOutside>
        <InviteUserForm
          calendarId={calendarId}
          onSuccess={handleInviteSuccess}
          onCancel={() => setShowInviteModal(false)}
        />
      </Modal>
    </>
  );
}
