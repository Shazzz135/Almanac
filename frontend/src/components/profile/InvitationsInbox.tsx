import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/auth/useAuth';
import { useCalendar } from '../../hooks/board/useCalendar';
import { authenticatedFetch } from '../../utils/auth/authClient';

interface Invitation {
  _id: string;
  member_id: string;
  calendarName: string;
  calendarDescription?: string;
  calendarType: string;
  inviterName: string;
  inviterEmail?: string;
  role: 'editor' | 'viewer';
  status: 'pending' | 'accepted' | 'declined';
  created_at?: string;
}

export default function InvitationsInbox() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { refreshCalendars } = useCalendar();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || authLoading) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    const fetchInvitations = async () => {
      try {
        const response = await authenticatedFetch('/members/invitations/pending');
        if (!response.ok) {
          throw new Error('Failed to fetch invitations');
        }
        const data = await response.json();
        setInvitations(data.data.invitations || []);
      } catch (err) {
        console.error('Failed to load invitations:', err);
        setError('Failed to load invitations');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, [isAuthenticated, authLoading]);

  const handleAccept = async (memberId: string) => {
    setProcessingId(memberId);
    try {
      const response = await authenticatedFetch(`/members/${memberId}/accept`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to accept invitation');
      }
      setInvitations(invitations.filter(inv => inv._id !== memberId));
      
      // Refresh calendar list to show the newly accepted calendar
      console.log('[InvitationsInbox] Invitation accepted, refreshing calendar list');
      try {
        await refreshCalendars();
        console.log('[InvitationsInbox] Calendar list refreshed successfully');
      } catch (refreshErr) {
        console.error('[InvitationsInbox] Failed to refresh calendars after acceptance:', refreshErr);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to accept invitation';
      console.error('Error accepting invitation:', err);
      setError(errorMsg);
      setTimeout(() => setError(null), 5000);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (memberId: string) => {
    setProcessingId(memberId);
    try {
      const response = await authenticatedFetch(`/members/${memberId}/decline`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to decline invitation');
      }
      setInvitations(invitations.filter(inv => inv._id !== memberId));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to decline invitation';
      console.error('Error declining invitation:', err);
      setError(errorMsg);
      setTimeout(() => setError(null), 5000);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="backdrop-blur-md bg-gray-900/50 border border-blue-500/30 rounded-lg overflow-hidden w-full relative">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 border-b border-blue-500/30 px-8 py-6">
        <h2 className="text-2xl font-bold text-blue-100">Invitations Inbox</h2>
      </div>
      <div className="px-8 py-8">
        {loading ? (
          <div className="text-blue-200">Loading invitations...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : invitations.length === 0 ? (
          <div className="text-gray-400">No pending invitations.</div>
        ) : (
          <ul className="flex flex-col gap-3">
            {invitations.map(invite => (
              <li key={invite._id} className="bg-gray-800 rounded p-4 flex flex-col gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-lg mb-1 truncate">{invite.calendarName}</div>
                  <div className="text-blue-300 text-base mb-0.5 truncate">Invited by: {invite.inviterName}</div>
                  <div className="text-blue-400 text-sm mt-1">Role: {invite.role.charAt(0).toUpperCase() + invite.role.slice(1)}</div>
                  {invite.calendarDescription && (
                    <div className="text-gray-400 text-sm mt-2">{invite.calendarDescription}</div>
                  )}
                </div>
                <div className="flex flex-row gap-3 items-center mt-2 justify-center">
                  <button 
                    onClick={() => handleDecline(invite._id)}
                    disabled={processingId === invite._id}
                    className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base border border-blue-400/60 text-blue-300 font-semibold rounded-lg hover:bg-blue-500/20 hover:border-blue-300 hover:text-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap" 
                    style={{minWidth:'90px'}}
                  >
                    {processingId === invite._id ? 'Processing...' : 'Decline'}
                  </button>
                  <button 
                    onClick={() => handleAccept(invite._id)}
                    disabled={processingId === invite._id}
                    className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-blue-400 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap" 
                    style={{minWidth:'90px'}}
                  >
                    {processingId === invite._id ? 'Processing...' : 'Accept'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
