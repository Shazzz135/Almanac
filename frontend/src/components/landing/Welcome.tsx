import { useGradientPulse } from '../../hooks/ui/useGradientPulse';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const gradientPulse = useGradientPulse();
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/auth/signup');
    };

    return (
        <div className="flex-1 w-full md:w-auto flex flex-col justify-center items-center text-center text-white px-3 sm:px-4 md:px-6 py-2 md:py-0">
            <h1 className={`text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 px-2 py-2`}>Welcome to <span className={gradientPulse}>Almanac</span></h1>
            <p className="text-sm sm:text-base md:text-lg text-white px-2 py-1">Organize moments that matter. Never miss what's important.</p>
            <button onClick={handleGetStarted} className="mt-6 px-6 py-2 md:px-8 md:py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200">
                Get Started
            </button>
        </div>
    )
}