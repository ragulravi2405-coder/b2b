import React from 'react';
import { Users, MessageSquare, Sparkles, Navigation2, Lock, MessageCircle } from 'lucide-react';
import { MatchRecord, UserProfile } from '@/types';

interface MatchesViewProps {
  matches: MatchRecord[];
  onStartChat: (profile: UserProfile) => void;
  onViewDetails: (profile: UserProfile) => void;
  onExplore: () => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  onStartChat,
  onViewDetails,
  onExplore
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Your Mutual Matches</h2>
          <p className="text-xs text-slate-500 mt-1">
            When two men like each other, it&apos;s a mutual match! Start a conversation anytime.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-purple-100 text-[#6C3BFF] text-xs font-bold">
          {matches.length} Matches
        </span>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6C3BFF] flex items-center justify-center mx-auto mb-3">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Matches Yet</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-5">
            Like profiles in Discover. Liking Arjun, Karthik, or Vikram triggers an immediate mutual match!
          </p>
          <button
            onClick={onExplore}
            className="px-6 py-2.5 rounded-xl bg-[#6C3BFF] text-white text-xs font-bold shadow-md shadow-purple-200 hover:bg-[#5828E8] transition-all"
          >
            Find Men to Match
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {matches.map((item) => {
            const profile = item.profile;
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 ring-2 ring-purple-100 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={profile.avatar}
                        alt={profile.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-900 text-base">
                          {profile.username}, {profile.age}
                        </h4>
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                          {profile.orientation}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <Navigation2 className="w-3 h-3 text-[#00C496] fill-[#00C496]" />
                        <span>{profile.distanceKm} km away</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-[#F7F7FC] p-3 rounded-xl border border-slate-100">
                    &ldquo;{profile.bio}&rdquo;
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onViewDetails(profile)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => onStartChat(profile)}
                    className="flex-1 py-2.5 rounded-xl bg-[#6C3BFF] hover:bg-[#5828E8] text-white text-xs font-bold shadow-md shadow-purple-200 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Start Chat
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
