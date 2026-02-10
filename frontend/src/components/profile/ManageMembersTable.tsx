import type { Member } from '../../types/board/memberTypes';

interface ManageMembersTableProps {
  members: Member[];
  isLoading: boolean;
  error: string | null;
  currentUserId?: string;
  isCurrentUserOwner: boolean;
  updatingRoleId: string | null;
  removingMemberId: string | null;
  onRoleChange: (memberId: string, newRole: string) => void;
  onRemove: (memberId: string) => void;
}

export default function ManageMembersTable({
  members,
  isLoading,
  error,
  currentUserId,
  isCurrentUserOwner,
  updatingRoleId,
  removingMemberId,
  onRoleChange,
  onRemove,
}: ManageMembersTableProps) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-blue-200 mb-2">Members</h3>
      {error && (
        <div className="mb-3 p-3 bg-red-600/20 border border-red-500/50 rounded text-red-300 text-sm">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="text-blue-300">Loading members...</div>
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
              {members.map(member => {
                const isOwner = member.role === 'owner';
                const isCurrentMember = member.user_id === currentUserId;
                const canChangeRole = isCurrentUserOwner && !isOwner;
                const canRemove = isCurrentUserOwner && !isOwner;

                return (
                  <tr key={member._id} className="border-b border-gray-700">
                    <td className="px-3 py-2 text-white font-medium">
                      {member.name || '—'}
                      {isCurrentMember && <span className="text-xs text-blue-300 ml-2">(you)</span>}
                    </td>
                    <td className="px-3 py-2 text-white">{member.email || '—'}</td>
                    <td className="px-3 py-2">
                      {isOwner ? (
                        <span className="px-2 py-1 bg-yellow-600/30 border border-yellow-500/50 text-yellow-300 rounded capitalize text-xs font-semibold">
                          {member.role}
                        </span>
                      ) : canChangeRole ? (
                        <select
                          value={member.role}
                          onChange={e => onRoleChange(member._id, e.target.value)}
                          disabled={updatingRoleId === member._id}
                          className="px-2 py-1 bg-gray-700 text-white border border-gray-600 rounded capitalize text-xs focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="editor">Editor</option>
                        </select>
                      ) : (
                        <span className="text-blue-300 capitalize text-xs font-semibold">
                          {member.role}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => onRemove(member._id)}
                        disabled={!canRemove || removingMemberId === member._id}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                        title={
                          isOwner ? 'Owner cannot be removed' :
                          isCurrentMember ? 'You cannot remove yourself' :
                          !isCurrentUserOwner ? 'Only owners can remove members' :
                          'Remove member'
                        }
                      >
                        {removingMemberId === member._id ? 'Removing...' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
