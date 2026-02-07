export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        .x-glow:hover {
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
        }
        .github-glow:hover {
          filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.8));
        }
        .website-glow:hover {
          filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.8));
        }
        .linkedin-glow:hover {
          filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.8));
        }
      `}</style>
      <footer className="w-full bg-transparent border-t border-blue-500/30 mt-12 sm:mt-16 md:mt-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-500">
          <p>&copy; {currentYear} Almanac. All rights reserved.</p>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* X (formerly Twitter) */}
            <a 
              href="https://x.com/Shazzz135" 
              target="_blank"
              rel="noopener noreferrer"
              className="x-glow hover:text-gray-100 hover:scale-110 transition-all duration-200"
              aria-label="X"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.694-5.858 6.694H2.88l7.644-8.74L.88 2.25h6.677l4.622 6.11 5.065-6.11zM17.15 18.348h1.824L6.84 3.956H4.897l12.253 14.392z"/>
              </svg>
            </a>
            
            {/* GitHub */}
            <a 
              href="https://github.com/Shazzz135" 
              target="_blank"
              rel="noopener noreferrer"
              className="github-glow hover:text-purple-300 hover:scale-110 transition-all duration-200"
              aria-label="GitHub"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            
            {/* Website */}
            <a 
              href="https://www.shazzz.tech/" 
              target="_blank"
              rel="noopener noreferrer"
              className="website-glow hover:text-red-400 hover:scale-110 transition-all duration-200"
              aria-label="Website"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </a>
            
            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/nick-shahbaz-b258b8241/" 
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-glow hover:text-blue-300 hover:scale-110 transition-all duration-200"
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 382 382" xmlns="http://www.w3.org/2000/svg">
                <path d="M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889C0,366.529,15.471,382,34.555,382h312.889 C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056 H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806 c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1 s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73 c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079 c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426 c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472 L341.91,330.654L341.91,330.654z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
