import { useState, useEffect } from 'react';

interface InviteUserFormProps {
  onSubmit: (users: Array<{email: string, role: 'editor' | 'viewer'}>) => void;
  onCancel: () => void;
}

export default function InviteUserForm({ onSubmit, onCancel }: InviteUserFormProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'editor' | 'viewer'>('viewer');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<Array<{email: string, role: 'editor' | 'viewer'}>>([]);
  const [members, setMembers] = useState<string[]>([]);

  // Fetch members on mount
  useEffect(() => {
    // @ts-ignore - get activeCalendarId from parent or context
    const calendarId = window.activeCalendarId || '';
    if (calendarId) {
      import('../../services/board/getMembers').then(mod => {
        mod.getAllMembers(calendarId).then(memberList => {
          setMembers(memberList.map(m => m.email || ''));
        });
      });
    }
  }, []);

  function handleDeleteUser(idx: number) {
    setUsers(users => users.filter((_, i) => i !== idx));
  }
  const [inviteError, setInviteError] = useState('');

  function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    if (members.includes(email)) {
      setError('User is already a member or invited');
      return;
    }
    if (users.some(u => u.email === email)) {
      setError('User already added');
      return;
    }
    setError('');
    setUsers([...users, { email, role }]);
    setEmail('');
    setRole('viewer');
  }

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (users.length === 0) {
      setInviteError('Add at least one user');
      return;
    }
    setInviteError('');
    // Send all users to parent
    onSubmit(users);
    setUsers([]);
  }

  return (
    <form className="flex flex-col gap-4 p-4 bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-white mb-2 text-center">Invite User</h2>
      <div className="flex gap-2 items-end">
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-gray-300 font-medium">User Email <span className="text-red-400">*</span></span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            placeholder="Enter user email"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-300 font-medium">Role</span>
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              className={`px-4 py-2 rounded font-semibold border ${role === 'editor' ? 'bg-blue-600 text-white border-blue-400' : 'bg-gray-800 text-blue-300 border-blue-700'} transition-all duration-200`}
              onClick={() => setRole('editor')}
            >
              Editor
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded font-semibold border ${role === 'viewer' ? 'bg-blue-600 text-white border-blue-400' : 'bg-gray-800 text-blue-300 border-blue-700'} transition-all duration-200`}
              onClick={() => setRole('viewer')}
            >
              Viewer
            </button>
          </div>
        </div>
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <button type="button" onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded transition-all mt-2">Add User</button>
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
                className="ml-3 px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-all"
                onClick={() => handleDeleteUser(idx)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      {inviteError && <div className="text-red-400 text-sm mt-2">{inviteError}</div>}
      <div className="flex gap-2 mt-2 justify-end">
        <button type="button" onClick={onCancel} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded transition-all">Cancel</button>
        <button type="button" onClick={handleInvite} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded transition-all">Send Invite</button>
      </div>
    </form>
  );
}
