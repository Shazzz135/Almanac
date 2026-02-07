import { useAuth } from '../hooks/auth/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <div className="backdrop-blur-md bg-gray-900/50 border border-blue-500/30 rounded-lg p-8 flex items-center justify-center min-h-96">
          <div className="text-blue-300 text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <div className="backdrop-blur-md bg-gray-900/50 border border-blue-500/30 rounded-lg p-8 text-center">
          <p className="text-blue-300 mb-4">Please log in to view your profile</p>
          <button
            onClick={() => navigate('/auth/login')}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-blue-400 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Profile Card */}
      <div className="backdrop-blur-md bg-gray-900/50 border border-blue-500/30 rounded-lg overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 border-b border-blue-500/30 px-8 py-6">
          <h1 className="text-3xl font-bold text-blue-100">Account Details</h1>
          <p className="text-blue-300/70 mt-1">View and manage your profile information</p>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-6">
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-blue-500/20">
            <button
              onClick={() => navigate('/board')}
              className="flex-1 px-6 py-3 border border-blue-400/60 text-blue-300 font-semibold rounded-lg hover:bg-blue-500/20 hover:border-blue-300 hover:text-blue-100 transition-all duration-200"
            >
              Back to Board
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg hover:from-red-500 hover:to-red-400 hover:shadow-lg hover:shadow-red-500/50 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
