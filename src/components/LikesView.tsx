import React from 'react';
import { Heart, Sparkles, Navigation2, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserProfile } from '@/types';

interface LikesViewProps {
  likedProfiles: UserProfile[];
  onViewDetails: (profile: UserProfile) => void;
  onOpenMessage: (profile: UserProfile) => void;
  onExplore: () => void;
}

export const LikesView: React.FC<LikesViewProps> = ({
  likedProfiles,
  onViewDetails,
  onOpenMessage,
  onExplore
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Your Likes &amp; Sent Admirations</h2>
          <p className="text-xs text-slate-500 mt-1">
            Profiles you have liked. If they like you back, it instantly becomes a Match!
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-200">
          {likedProfiles.length} Liked
        </span>
      </div>

      {likedProfiles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Likes Yet</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-5">
            Browse through the Discover feed and hit the heart on profiles that match your vibe!
          </p>
          <button
            onClick={onExplore}
            className="px-6 py-2.5 rounded-xl bg-[#6C3BFF] text-white text-xs font-bold shadow-md shadow-purple-200 hover:bg-[#5828E8] transition-all"
          >
            Explore Profiles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {likedProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div
                onClick={() => onViewDetails(profile)}
                className="cursor-pointer"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatar}
                    alt={profile.username}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/60 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1">
                    <Navigation2 className="w-2.5 h-2.5 text-[#00C496] fill-[#00C496]" />
                    <span>{profile.distanceKm} km away</span>
                  </div>
                  <span
                    className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs ${
                      profile.orientation === 'Gay' ? 'bg-[#6C3BFF]' : 'bg-[#E94B99]'
                    }`}
                  >
                    {profile.orientation}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {profile.username}, {profile.age}
                  </h4>
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                  {profile.bio}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => onViewDetails(profile)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  View Profile
                </button>
                <button
                  onClick={() => onOpenMessage(profile)}
                  className="flex-1 py-2 rounded-xl bg-[#6C3BFF] hover:bg-[#5828E8] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
