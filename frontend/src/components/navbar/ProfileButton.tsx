import { useNavigate } from 'react-router-dom';

export default function ProfileButton() {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate('/profile')}
      className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base border border-blue-400/60 text-blue-300 font-semibold rounded-lg hover:bg-blue-500/20 hover:border-blue-300 hover:text-blue-100 transition-all duration-200 whitespace-nowrap"
    >
      My Profile →
    </button>
  );
}
