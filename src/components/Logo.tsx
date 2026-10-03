import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  onClick
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
    >
      {/* Interconnected Heart & Men Connection Mark */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            <linearGradient id="b2bGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#6C3BFF" />
              <stop offset="60%" stop-color="#A855F7" />
              <stop offset="100%" stop-color="#FF6B9D" />
            </linearGradient>
            <linearGradient id="b2bGradSecondary" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#00C496" />
              <stop offset="100%" stop-color="#6C3BFF" />
            </linearGradient>
          </defs>

          {/* Connected loop 1: Left Node / Person */}
          <path
            d="M17 19C19.7614 19 22 16.7614 22 14C22 11.2386 19.7614 9 17 9C14.2386 9 12 11.2386 12 14C12 16.7614 14.2386 19 17 19Z"
            fill="url(#b2bGradPrimary)"
          />
          {/* Connected loop 2: Right Node / Person */}
          <path
            d="M31 19C33.7614 19 36 16.7614 36 14C36 11.2386 33.7614 9 31 9C28.2386 9 26 11.2386 26 14C26 16.7614 28.2386 19 31 19Z"
            fill="url(#b2bGradPrimary)"
          />

          {/* Intertwined Heart Body */}
          <path
            d="M24 38.5C24 38.5 11 30.5 11 22C11 17.5 14.5 14 19 14C21.2 14 23.2 14.9 24 16.4C24.8 14.9 26.8 14 29 14C33.5 14 37 17.5 37 22C37 30.5 24 38.5 24 38.5Z"
            stroke="url(#b2bGradPrimary)"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Central bonding spark */}
          <circle cx="24" cy="23" r="2.8" fill="url(#b2bGradSecondary)" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight ${textSizes[size]} bg-gradient-to-r from-[#6C3BFF] via-[#8B5CF6] to-[#FF6B9D] bg-clip-text text-transparent`}>
            B2B
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00C496]"></span>
        </div>
        {showTagline && (
          <span className="text-[10px] sm:text-xs font-medium text-slate-500 tracking-wide uppercase">
            Real Men. Real Connections.
          </span>
        )}
      </div>
    </div>
  );
};
