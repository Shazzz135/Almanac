import { useNavigate } from 'react-router-dom';

export default function AuthButtons() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <button
        onClick={() => navigate('/auth/login')}
        className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base border border-blue-400/60 text-blue-300 font-semibold rounded-lg hover:bg-blue-500/20 hover:border-blue-300 hover:text-blue-100 transition-all duration-200 whitespace-nowrap"
      >
        Login
      </button>
      <button
        onClick={() => navigate('/auth/signup')}
        className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-blue-400 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 whitespace-nowrap"
      >
        Sign Up
      </button>
    </div>
  );
}
