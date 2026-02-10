import { useState, useEffect } from 'react';
import { inviteUserToCalendar } from '../../services/board/inviteService';
import { getAllMembers } from '../../services/board/getMembers';

interface InviteUserFormProps {
  calendarId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function InviteUserForm({ calendarId, onSuccess, onCancel }: InviteUserFormProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'editor' | 'viewer'>('viewer');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [users, setUsers] = useState<Array<{email: string, role: 'editor' | 'viewer'}>>([]);
  const [members, setMembers] = useState<string[]>([]);
  const [inviting, setInviting] = useState(false);

  // Fetch existing members on mount
  useEffect(() => {
    if (calendarId) {
      getAllMembers(calendarId).then(memberList => {
        setMembers(memberList.map(m => m.email || ''));
      }).catch(err => {
        console.error('Failed to fetch members:', err);
      });
    }
  }, [calendarId]);

  const handleDeleteUser = (idx: number) => {
    setUsers(users => users.filter((_, i) => i !== idx));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      setTimeout(() => setError(''), 5000);
      return;
    }
    if (members.includes(email)) {
      setError('User is already a member or invited');
      setTimeout(() => setError(''), 5000);
      return;
    }
    if (users.some(u => u.email === email)) {
      setError('User already added');
      setTimeout(() => setError(''), 5000);
      return;
    }
    setError('');
    setSuccessMessage('');
    setUsers([...users, { email, role }]);
    setEmail('');
    setRole('viewer');
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (users.length === 0) {
      setError('Add at least one user');
      setTimeout(() => setError(''), 5000);
      return;
    }

    setInviting(true);
    setError('');
    setSuccessMessage('');

    try {
      // Invite each user
      for (const user of users) {
        await inviteUserToCalendar(calendarId, user.email, user.role);
      }
      
      const msg = '✓ Successfully invited ' + users.length + ' user(s)';
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(''), 3000);
      setUsers([]);
      setEmail('');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to send invites';
      setError(errorMsg);
      setTimeout(() => setError(''), 5000);
    } finally {
      setInviting(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 p-4 bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-white mb-2 text-center">Invite User</h2>
      
      {successMessage && (
        <div className="bg-green-900/20 border border-green-500 text-green-300 px-4 py-2 rounded">
          {successMessage}
        </div>
      )}
      
      <div className="flex gap-2 items-end">
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-gray-300 font-medium">User Email <span className="text-red-400">*</span></span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            placeholder="Enter user email"
            disabled={inviting}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-300 font-medium">Role</span>
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              className={`px-4 py-2 rounded font-semibold border transition-all duration-200 ${role === 'editor' ? 'bg-blue-600 text-white border-blue-400' : 'bg-gray-800 text-blue-300 border-blue-700'}`}
              onClick={() => setRole('editor')}
              disabled={inviting}
            >
              Editor
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded font-semibold border transition-all duration-200 ${role === 'viewer' ? 'bg-blue-600 text-white border-blue-400' : 'bg-gray-800 text-blue-300 border-blue-700'}`}
              onClick={() => setRole('viewer')}
              disabled={inviting}
            >
              Viewer
            </button>
          </div>
        </div>
      </div>
      
      {error && <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-2 rounded text-sm">{error}</div>}
      <button 
        type="button" 
        onClick={handleAddUser} 
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded transition-all mt-2"
        disabled={inviting}
      >
        Add User
      </button>
      
      {/* Display added users */}
      {users.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-3 mt-2 flex flex-col gap-2">
          <span className="text-blue-200 font-semibold mb-1">Users to Invite:</span>
          {users.map((u, idx) => (
            <div key={idx} className="flex items-center justify-between bg-gray-900 rounded px-3 py-2">
              <span className="text-white">{u.email}</span>
              <span className="text-blue-400 font-medium">{u.role.charAt(0).toUpperCase() + u.role.slice(1)}</span>
              <button
                type="button"
                className="ml-3 px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-all disabled:opacity-50"
                onClick={() => handleDeleteUser(idx)}
                disabled={inviting}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex gap-2 mt-2 justify-end">
        <button 
          type="button" 
          onClick={onCancel} 
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded transition-all"
          disabled={inviting}
        >
          Cancel
        </button>
        <button 
          type="button" 
          onClick={handleInvite} 
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded transition-all"
          disabled={inviting}
        >
          {inviting ? 'Sending...' : 'Send Invite'}
        </button>
      </div>
    </form>
  );
}
