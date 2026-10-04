import React from 'react';
import { MessageSquare, Navigation2, Lock, Sparkles, CheckCheck } from 'lucide-react';
import { UserProfile } from '@/types';

interface MessagesInboxViewProps {
  conversations: {
    profile: UserProfile;
    lastMessage: string;
    timestamp: string;
    unread: boolean;
  }[];
  onOpenChat: (profile: UserProfile) => void;
  onExplore: () => void;
}

export const MessagesInboxView: React.FC<MessagesInboxViewProps> = ({
  conversations,
  onOpenChat,
  onExplore
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Conversations</h2>
          <p className="text-xs text-slate-500 mt-1">
            Private, secure messages with other verified members on Frndma
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          {conversations.length} Active
        </span>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#00C496] flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Messages Yet</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-5">
            Send a message to any of your matches or discover new men to chat with!
          </p>
          <button
            onClick={onExplore}
            className="px-6 py-2.5 rounded-xl bg-[#6C3BFF] text-white text-xs font-bold shadow-md shadow-purple-200 hover:bg-[#5828E8] transition-all"
          >
            Explore Profiles
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {conversations.map(({ profile, lastMessage, timestamp, unread }) => (
            <div
              key={profile.id}
              onClick={() => onOpenChat(profile)}
              className="p-4 sm:p-5 hover:bg-purple-50/40 cursor-pointer transition-colors flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 ring-2 ring-purple-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.avatar}
                      alt={profile.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {profile.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#00C496] ring-2 ring-white" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{profile.username}</h4>
                    <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                      {profile.orientation}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      • {profile.distanceKm} km away
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5 max-w-sm sm:max-w-md">
                    {lastMessage}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-[11px] text-slate-400 font-medium">{timestamp}</span>
                {unread ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6C3BFF]" />
                ) : (
                  <CheckCheck className="w-4 h-4 text-emerald-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
