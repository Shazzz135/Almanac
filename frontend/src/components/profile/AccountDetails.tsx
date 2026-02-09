import { useAuth } from '../../hooks/auth/useAuth';

export default function AccountDetails() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <>
      {/* Name */}
      <div className="space-y-2">
        <label className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Full Name</label>
        <div className="bg-gray-800/50 border border-blue-500/20 rounded-lg px-4 py-3">
          <p className="text-gray-100 text-lg">{user.name}</p>
        </div>
      </div>
      {/* Email */}
      <div className="space-y-2">
        <label className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Email Address</label>
        <div className="bg-gray-800/50 border border-blue-500/20 rounded-lg px-4 py-3">
          <p className="text-gray-100 text-lg">{user.email}</p>
        </div>
      </div>
      {/* Account Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Member Since</label>
          <div className="bg-gray-800/50 border border-blue-500/20 rounded-lg px-4 py-3">
            <p className="text-gray-100">{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Last Login</label>
          <div className="bg-gray-800/50 border border-blue-500/20 rounded-lg px-4 py-3">
            <p className="text-gray-100">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Never'}</p>
          </div>
        </div>
      </div>
    </>
  );
}
