import React from 'react';
import { Logo } from './Logo';
import {
  Compass,
  Heart,
  Users,
  LogOut,
  Crown,
  User,
  Home
} from 'lucide-react';
import { AuthUser } from '@/types';

interface NavbarProps {
  currentTab: 'discover' | 'matches' | 'likes' | 'profile';
  onSelectTab: (tab: 'discover' | 'matches' | 'likes' | 'profile') => void;
  onGoHome: () => void;
  matchesCount: number;
  likesCount: number;
  currentUser: AuthUser | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenPricing: () => void;
  showHero?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onGoHome,
  matchesCount,
  likesCount,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenPricing,
  showHero = true
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo
          size="md"
          showTagline={false}
          onClick={onGoHome}
        />

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          <button
            onClick={onGoHome}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              currentTab === 'discover' && showHero
                ? 'bg-purple-50 text-[#6C3BFF]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>

          <button
            onClick={() => {
              onSelectTab('discover');
            }}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              currentTab === 'discover' && !showHero
                ? 'bg-purple-50 text-[#6C3BFF]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Compass className="w-4 h-4" />
            Discover
          </button>

          <button
            onClick={() => onSelectTab('matches')}
            className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              currentTab === 'matches'
                ? 'bg-purple-50 text-[#6C3BFF]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            Matches
            {matchesCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#E94B99] text-white text-[10px] font-bold flex items-center justify-center">
                {matchesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('likes')}
            className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              currentTab === 'likes'
                ? 'bg-purple-50 text-[#6C3BFF]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Heart className="w-4 h-4" />
            Likes
            {likesCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                {likesCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Premium Pricing Pill */}
          <button
            onClick={onOpenPricing}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-100 via-pink-100 to-teal-100 hover:from-purple-200 hover:to-teal-200 text-[#6C3BFF] text-xs font-bold flex items-center gap-1.5 transition-all border border-purple-200/60 shadow-xs"
          >
            <Crown className="w-3.5 h-3.5 text-[#E94B99]" />
            <span className="hidden xs:inline">Plans</span>
            <span className="text-[#17152A] font-extrabold">₹299</span>
          </button>

          {/* User Profile / Auth State */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectTab('profile')}
                className="flex items-center gap-2 p-1 pl-2 rounded-2xl hover:bg-slate-50 border border-slate-200/80 transition-all"
              >
                <span className="text-xs font-bold text-slate-800 hidden sm:inline">
                  {currentUser.username}
                </span>
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 ring-2 ring-purple-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.username}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Logout / Switch Account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-slate-700 hover:text-[#6C3BFF] hover:bg-purple-50 text-xs sm:text-sm font-bold border border-slate-200/90 transition-all"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#6C3BFF] hover:bg-[#5828E8] text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-200 transition-all active:scale-[0.98]"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
