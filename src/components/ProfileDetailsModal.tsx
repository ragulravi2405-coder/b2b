import React from 'react';
import {
  X,
  Heart,
  MessageSquare,
  Lock,
  Navigation2,
  CheckCircle2,
  ShieldAlert,
  Ban,
  HelpCircle,
  Sparkles,
  Check,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { UserProfile } from '@/types';

interface ProfileDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  isLiked?: boolean;
  isContactUnlocked?: boolean;
  unlockedWhatsappUrl?: string;
  onLikeToggle: (profileId: string) => void;
  onOpenMessage: (profile: UserProfile) => void;
  onOpenUnlockPayment: (profile: UserProfile) => void;
  onOpenReport: (profile: UserProfile) => void;
  onOpenIdentityEducation: () => void;
  onBlockUser: (profileId: string) => void;
}

export const ProfileDetailsModal: React.FC<ProfileDetailsModalProps> = ({
  isOpen,
  onClose,
  profile,
  isLiked = false,
  isContactUnlocked = false,
  unlockedWhatsappUrl,
  onLikeToggle,
  onOpenMessage,
  onOpenUnlockPayment,
  onOpenReport,
  onOpenIdentityEducation,
  onBlockUser
}) => {
  if (!isOpen || !profile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md backdrop-blur-md transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Single Profile Photo */}
          <div className="md:col-span-6 bg-slate-100 p-4 sm:p-6 flex flex-col justify-between">
            <div>
              {/* Main Photo (Single View Only) */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-sm bg-white mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.avatar}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />

                {/* Approximate Distance Pill */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                  <Navigation2 className="w-3.5 h-3.5 text-[#00C496] fill-[#00C496]" />
                  <span>{profile.distanceKm} km away</span>
                </div>

                {/* Identity Tag */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
                      profile.orientation === 'Gay' ? 'bg-[#6C3BFF]' : 'bg-[#E94B99]'
                    }`}
                  >
                    {profile.orientation}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons on Photo column */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => onLikeToggle(profile.id)}
                className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  isLiked
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'bg-white border border-slate-200 hover:bg-rose-50 text-slate-700 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenMessage(profile);
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-white border border-slate-200 hover:bg-purple-50 text-slate-700 hover:text-[#6C3BFF] font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </button>
            </div>
          </div>

          {/* Right Column: Profile Information & Contact Unlock */}
          <div className="md:col-span-6 p-5 sm:p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Header Title & Status */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-slate-900">
                      {profile.username}, {profile.age}
                    </h3>
                    {profile.isVerified && (
                      <span title="Verified Adult Profile">
                        <CheckCircle2 className="w-5 h-5 text-[#00C496]" />
                      </span>
                    )}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-[#6C3BFF]">
                    {profile.orientation || 'Male Model'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span>{profile.distanceKm} km away</span>
                  <span>•</span>
                  <span className="text-[#00C496] font-medium">{profile.lastActive || 'Active'}</span>
                </div>
              </div>

              {/* About Me */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  About Me
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-[#F7F7FC] p-3.5 rounded-2xl border border-slate-100">
                  {profile.bio}
                </p>
              </div>

              {/* Looking For */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Looking For
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {profile.lookingFor.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-purple-50 text-[#6C3BFF] text-xs font-medium border border-purple-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Interests
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {profile.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>


              {/* Contact Unlock Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 via-white to-pink-50 border border-purple-200 shadow-xs">
                {isContactUnlocked ? (
                  <div>
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs mb-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>WhatsApp Contact Unlocked</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">
                      You have lifetime unlocked access to connect with {profile.username} on WhatsApp!
                    </p>
                    {unlockedWhatsappUrl && (
                      <a
                        href={unlockedWhatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        Chat on WhatsApp
                        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                      </a>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#6C3BFF]" />
                        <span className="font-bold text-xs text-slate-900">Contact Details Locked</span>
                      </div>
                      <span className="text-xs font-extrabold text-[#6C3BFF]">₹{profile.unlockPrice ?? 299}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Unlock {profile.username}&apos;s verified WhatsApp details to continue connecting outside B2B.
                    </p>
                    <button
                      onClick={() => onOpenUnlockPayment(profile)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#6C3BFF] to-[#E94B99] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Unlock Contact — ₹{profile.unlockPrice ?? 299}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Safety & Moderation Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <button
                onClick={() => onOpenReport(profile)}
                className="flex items-center gap-1.5 hover:text-red-600 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Report Profile
              </button>

              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to block ${profile.username}? They will no longer appear in your feed.`)) {
                    onBlockUser(profile.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 hover:text-slate-700 transition-colors"
              >
                <Ban className="w-3.5 h-3.5" />
                Block User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
