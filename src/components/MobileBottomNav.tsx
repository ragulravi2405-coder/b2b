import React from 'react';
import { Home, Compass, Heart, Users, User } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'discover' | 'matches' | 'likes' | 'profile';
  onSelectTab: (tab: 'discover' | 'matches' | 'likes' | 'profile') => void;
  onGoHome: () => void;
  matchesCount: number;
  likesCount: number;
  showHero?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onGoHome,
  matchesCount,
  likesCount,
  showHero = true
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-2 safe-area-bottom shadow-lg">
      <div className="flex items-center justify-around">
        {/* Home Button */}
        <button
          onClick={onGoHome}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
            currentTab === 'discover' && showHero ? 'text-[#6C3BFF]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 transition-transform ${currentTab === 'discover' && showHero ? 'scale-110 stroke-[2.5]' : ''}`} />
          <span className={`text-[10px] mt-1 tracking-tight ${currentTab === 'discover' && showHero ? 'font-bold' : 'font-medium'}`}>
            Home
          </span>
          {currentTab === 'discover' && showHero && (
            <span className="w-1 h-1 rounded-full bg-[#6C3BFF] mt-0.5" />
          )}
        </button>

        {/* Discover Button */}
        <button
          onClick={() => onSelectTab('discover')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
            currentTab === 'discover' && !showHero ? 'text-[#6C3BFF]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className={`w-5 h-5 transition-transform ${currentTab === 'discover' && !showHero ? 'scale-110 stroke-[2.5]' : ''}`} />
          <span className={`text-[10px] mt-1 tracking-tight ${currentTab === 'discover' && !showHero ? 'font-bold' : 'font-medium'}`}>
            Discover
          </span>
          {currentTab === 'discover' && !showHero && (
            <span className="w-1 h-1 rounded-full bg-[#6C3BFF] mt-0.5" />
          )}
        </button>

        {/* Likes Button */}
        <button
          onClick={() => onSelectTab('likes')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
            currentTab === 'likes' ? 'text-[#6C3BFF]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 transition-transform ${currentTab === 'likes' ? 'scale-110 stroke-[2.5]' : ''}`} />
            {likesCount > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1 min-w-[15px] h-[15px] rounded-full bg-[#E94B99] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {likesCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] mt-1 tracking-tight ${currentTab === 'likes' ? 'font-bold' : 'font-medium'}`}>
            Likes
          </span>
          {currentTab === 'likes' && (
            <span className="w-1 h-1 rounded-full bg-[#6C3BFF] mt-0.5" />
          )}
        </button>

        {/* Matches Button */}
        <button
          onClick={() => onSelectTab('matches')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
            currentTab === 'matches' ? 'text-[#6C3BFF]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Users className={`w-5 h-5 transition-transform ${currentTab === 'matches' ? 'scale-110 stroke-[2.5]' : ''}`} />
            {matchesCount > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1 min-w-[15px] h-[15px] rounded-full bg-[#E94B99] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {matchesCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] mt-1 tracking-tight ${currentTab === 'matches' ? 'font-bold' : 'font-medium'}`}>
            Matches
          </span>
          {currentTab === 'matches' && (
            <span className="w-1 h-1 rounded-full bg-[#6C3BFF] mt-0.5" />
          )}
        </button>

        {/* Profile Button */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
            currentTab === 'profile' ? 'text-[#6C3BFF]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className={`w-5 h-5 transition-transform ${currentTab === 'profile' ? 'scale-110 stroke-[2.5]' : ''}`} />
          <span className={`text-[10px] mt-1 tracking-tight ${currentTab === 'profile' ? 'font-bold' : 'font-medium'}`}>
            Profile
          </span>
          {currentTab === 'profile' && (
            <span className="w-1 h-1 rounded-full bg-[#6C3BFF] mt-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};
