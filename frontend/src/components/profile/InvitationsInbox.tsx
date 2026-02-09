import { useEffect, useState } from 'react';

interface Invitation {
  _id: string;
  calendarName: string;
  inviterName: string;
  role: 'editor' | 'viewer';
  status: 'pending' | 'accepted' | 'declined';
}

export default function InvitationsInbox() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock invitation for visual testing
    setTimeout(() => {
      setInvitations([
        {
          _id: 'mock1',
          calendarName: 'Team Project Calendar',
          inviterName: 'Alice Johnson',
          role: 'editor',
          status: 'pending',
        },
      ]);
      setLoading(false);
    }, 300);
    // Uncomment for real API call
    // fetch('/api/invitations')
    //   .then(res => res.json())
    //   .then(data => {
    //     setInvitations(data.invitations || []);
    //     setLoading(false);
    //   })
    //   .catch(() => {
    //     setError('Failed to load invitations');
    //     setLoading(false);
    //   });
  }, []);

  return (
    <div className="backdrop-blur-md bg-gray-900/50 border border-blue-500/30 rounded-lg overflow-hidden w-full">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 border-b border-blue-500/30 px-8 py-6">
        <h2 className="text-2xl font-bold text-blue-100">Invitations Inbox</h2>
      </div>
      <div className="px-8 py-8">
        {loading ? (
          <div className="text-blue-200">Loading...</div>
        ) : invitations.length === 0 ? (
          <div className="text-gray-400">No invitations found.</div>
        ) : (
          <ul className="flex flex-col gap-3">
            {invitations.map(invite => (
              <li key={invite._id} className="bg-gray-800 rounded p-4 flex flex-col gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-lg mb-1 truncate">{invite.calendarName}</div>
                  <div className="text-blue-300 text-base mb-0.5 truncate">Invited by: {invite.inviterName}</div>
                  <div className="text-blue-400 text-sm mt-1">Role: {invite.role.charAt(0).toUpperCase() + invite.role.slice(1)}</div>
                </div>
                <div className="flex flex-row gap-3 items-center mt-2 justify-center">
                  {invite.status === 'pending' ? (
                    <>
                      <button className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base border border-blue-400/60 text-blue-300 font-semibold rounded-lg hover:bg-blue-500/20 hover:border-blue-300 hover:text-blue-100 transition-all duration-200 whitespace-nowrap" style={{minWidth:'90px'}}>Decline</button>
                      <button className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-blue-400 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 whitespace-nowrap" style={{minWidth:'90px'}}>Accept</button>
                    </>
                  ) : (
                    <span className={`font-semibold text-sm ${invite.status === 'accepted' ? 'text-blue-400' : 'text-blue-300'}`}>{invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
