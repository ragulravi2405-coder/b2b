import React from 'react';
import { Heart, Sparkles, Navigation2, CheckCircle2, Shield } from 'lucide-react';
import { UserProfile } from '@/types';

interface ProfileCardProps {
  profile: UserProfile;
  isLiked?: boolean;
  onLikeToggle: (profileId: string) => void;
  onViewDetails: (profile: UserProfile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isLiked = false,
  onLikeToggle,
  onViewDetails
}) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Profile Image & Badges Container */}
      <div
        onClick={() => onViewDetails(profile)}
        className="relative w-full aspect-[4/3] bg-slate-100 cursor-pointer overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.avatar}
          alt={profile.username}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Distance Pill — Approximate distance only, NO city/address */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1 shadow-sm">
          <Navigation2 className="w-3 h-3 text-[#00C496] fill-[#00C496]" />
          <span>{profile.distanceKm} km away</span>
        </div>

        {/* Model Status Pill */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            {profile.orientation || 'Male Model'}
          </span>
          {profile.isOnline && (
            <span className="w-2.5 h-2.5 rounded-full bg-[#00C496] ring-2 ring-white shadow-xs" title="Online now" />
          )}
        </div>

        {/* Bottom image overlay with name and age */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex items-end justify-between">
          <div className="flex items-center gap-1.5">
            <h4 className="text-white font-bold text-lg leading-none drop-shadow-sm">
              {profile.username}, {profile.age}
            </h4>
            {profile.isVerified && (
              <CheckCircle2 className="w-4 h-4 text-[#00C496] fill-[#00C496]/20" />
            )}
          </div>
          {profile.unlockPrice !== undefined && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-500 text-white shadow-sm flex items-center gap-0.5 animate-pulse">
              ₹{profile.unlockPrice}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Interests preview pills */}
          <div className="flex flex-wrap gap-1 mb-2.5">
            {profile.interests.slice(0, 3).map((interest, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-purple-50/80 text-[#6C3BFF] text-[10px] font-semibold"
              >
                {interest}
              </span>
            ))}
            {profile.interests.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-medium">
                +{profile.interests.length - 3}
              </span>
            )}
          </div>

          {/* Short bio snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            &ldquo;{profile.bio}&rdquo;
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLikeToggle(profile.id);
            }}
            className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
              isLiked
                ? 'bg-rose-50 border-rose-300 text-rose-500 scale-105'
                : 'border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50/50'
            }`}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart
              className={`w-4 h-4 transition-transform ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''}`}
            />
          </button>

          {/* View Profile Button */}
          <button
            onClick={() => onViewDetails(profile)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-[#6C3BFF] text-white text-xs font-semibold tracking-wide transition-all duration-200 text-center shadow-xs"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};
