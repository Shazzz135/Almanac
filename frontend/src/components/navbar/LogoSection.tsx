import { useNavigate } from 'react-router-dom';
const logo = '/Logo.webp';

interface LogoSectionProps {
  isAuthenticated: boolean;
}

export default function LogoSection({ isAuthenticated }: LogoSectionProps) {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(isAuthenticated ? '/board' : '/')}
      className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity min-w-0"
    >
      <div className={`text-xl sm:text-2xl md:text-3xl font-bold flex-shrink-0`}>
        <img src={logo} alt="Almanac Logo" className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10" />
      </div>
      <div className={`text-2xl sm:text-3xl md:text-4xl font-semibold truncate`}>
        Almanac
      </div>
    </div>
  );
}
