import { useState, useEffect } from 'react';
import { useModalFormLayout } from '../../hooks/ui/useModalFormLayout';
import { getAllMembers } from '../../services/board/getMembers';
import type { Member } from '../../services/board/getMembers';

interface ManageCalendarFormProps {
  calendarName: string;
  description: string;
  calendarId?: string;
  onSubmit: (data: { name: string; description: string }) => void;
  onCancel: () => void;
}

export default function ManageCalendarForm({ calendarName, description, calendarId, onSubmit, onCancel }: ManageCalendarFormProps) {
  const ModalFormLayout = useModalFormLayout();
  const [name, setName] = useState(calendarName);
  const [desc, setDesc] = useState(description);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);
  // MOCK DATA for visual testing
  useEffect(() => {
    setMembersLoading(false);
    setMembersError(null);
    setMembers([
      {
        user_id: '1',
        calendar_id: calendarId || 'mock',
        role: 'owner',
        name: 'Alice Owner',
        email: 'alice@example.com',
        accepted: true,
      },
      {
        user_id: '2',
        calendar_id: calendarId || 'mock',
        role: 'editor',
        name: 'Bob Editor',
        email: 'bob@example.com',
        accepted: true,
      },
      {
        user_id: '3',
        calendar_id: calendarId || 'mock',
        role: 'viewer',
        name: 'Charlie Viewer',
        email: 'charlie@example.com',
        accepted: true,
      },
    ]);
  }, [calendarId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setError(null);
    onSubmit({ name: name.trim(), description: desc.trim() });
  }

  return (
    <ModalFormLayout
      title="Manage Calendar"
      error={error}
      onCancel={onCancel}
      onSubmitText="Save Changes"
      onSubmit={handleSubmit}
    >
      <label className="flex flex-col gap-1">
        <span className="text-gray-300 font-medium">Name <span className="text-red-400">*</span></span>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="Calendar name"
          required
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-gray-300 font-medium">Description</span>
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 min-h-[60px]"
          placeholder="Optional description"
        />
      </label>

      {/* Member Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-blue-200 mb-2">Members</h3>
        {membersLoading ? (
          <div className="text-blue-300">Loading members...</div>
        ) : membersError ? (
          <div className="text-red-400">{membersError}</div>
        ) : members.length === 0 ? (
          <div className="text-gray-400">No members found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-800 text-gray-300">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.user_id} className="border-b border-gray-700">
                    <td className="px-3 py-2 text-white">{member.name || '—'}</td>
                    <td className="px-3 py-2 text-white">{member.email || '—'}</td>
                    <td className="px-3 py-2 text-blue-300 capitalize">{member.role}</td>
                    <td className="px-3 py-2">
                      <button
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                        // TODO: Implement remove member logic
                        disabled={member.role === 'owner'}
                        title={member.role === 'owner' ? 'Owner cannot be removed' : 'Remove member'}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ModalFormLayout>
  );
}
