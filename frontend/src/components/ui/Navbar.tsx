import { useGradientPulse } from '../../hooks/ui/useGradientPulse';
import { useAuth } from '../../hooks/auth/useAuth';
import { useNavigate } from 'react-router-dom';
import logo from '../../../public/Logo.webp';

export default function Navbar() {
  const pulseClass = useGradientPulse();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-transparent backdrop-blur-md border-b border-blue-500/30 flex items-center justify-between px-3 sm:px-4 md:px-8 z-50">
      {/* Logo Section - Left */}
      <div 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity min-w-0"
      >
        <div className={`text-xl sm:text-2xl md:text-3xl font-bold flex-shrink-0`}>
          <img src={logo} alt="Almanac Logo" className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10" />
        </div>
        <div className={`text-2xl sm:text-3xl md:text-4xl font-semibold ${pulseClass} truncate`}>
          Almanac
        </div>
      </div>

      {/* Right Section - Conditional Rendering */}
      <div className="flex-shrink-0">
        {!isAuthenticated ? (
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
        ) : (
          <button 
            onClick={() => navigate('/profile')}
            className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base border border-blue-400/60 text-blue-300 font-semibold rounded-lg hover:bg-blue-500/20 hover:border-blue-300 hover:text-blue-100 transition-all duration-200 whitespace-nowrap"
          >
            Profile
          </button>
        )}
      </div>
    </nav>
  );
}