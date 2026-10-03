import React, { useEffect } from 'react';
import { X, Heart, MessageSquare, Sparkles, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '@/types';
import Image from 'next/image';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedProfile: UserProfile | null;
  currentUserAvatar: string;
  onStartChat: (profile: UserProfile) => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  isOpen,
  onClose,
  matchedProfile,
  currentUserAvatar,
  onStartChat
}) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#6C3BFF', '#FF6B9D', '#00C496', '#A855F7']
      });
    }
  }, [isOpen]);

  if (!isOpen || !matchedProfile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-100 text-center overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-purple-100 text-[#6C3BFF] text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          Mutual Connection
        </div>

        <h3 className="text-3xl font-black bg-gradient-to-r from-[#6C3BFF] via-[#A855F7] to-[#FF6B9D] bg-clip-text text-transparent">
          It&apos;s a Match! 💜
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
          You and <span className="font-bold text-slate-800">{matchedProfile.username}</span> liked each other.
        </p>

        {/* Intersecting Avatars */}
        <div className="relative flex items-center justify-center my-7 py-2">
          {/* User Avatar */}
          <div className="relative w-24 h-24 rounded-full ring-4 ring-white shadow-xl overflow-hidden -mr-4 z-10 bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUserAvatar}
              alt="You"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Central Heart Badge */}
          <div className="absolute z-20 w-11 h-11 rounded-full bg-gradient-to-r from-[#6C3BFF] to-[#FF6B9D] flex items-center justify-center text-white shadow-lg animate-bounce">
            <Heart className="w-6 h-6 fill-white" />
          </div>

          {/* Matched Profile Avatar */}
          <div className="relative w-24 h-24 rounded-full ring-4 ring-white shadow-xl overflow-hidden -ml-4 z-10 bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={matchedProfile.avatar}
              alt={matchedProfile.username}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-6 px-4">
          Say hi and start a genuine conversation right away!
        </p>

        {/* Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              onClose();
              onStartChat(matchedProfile);
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#6C3BFF] hover:bg-[#5828E8] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-200 transition-all active:scale-[0.98]"
          >
            <MessageSquare className="w-4 h-4" />
            Start Chat with {matchedProfile.username}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
          >
            Keep Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
