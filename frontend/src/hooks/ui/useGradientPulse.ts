import { useEffect } from 'react';

export const useGradientPulse = () => {
    useEffect(() => {
        const styleId = 'gradient-pulse-styles';
        
        // Avoid adding duplicate styles
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                @keyframes gradientPulse {
                    0% {
                        background-position: 0% 50%;
                        opacity: 1;
                    }
                    50% {
                        background-position: 100% 50%;
                        opacity: 0.85;
                    }
                    100% {
                        background-position: 0% 50%;
                        opacity: 1;
                    }
                }
                .gradient-pulse {
                    background: linear-gradient(
                        135deg,
                        #b9d3fd,
                        #6f9af6,
                        #2f5ddc,
                        #153bb8,
                        #012f78
                    );
                    background-size: 200% 200%;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: gradientPulse 3s ease-in-out infinite;
                }
            `;
            document.head.appendChild(style);
        }

        return () => {
            // Clean up if needed
        };
    }, []);

    return 'gradient-pulse';
};
