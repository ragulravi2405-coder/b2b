import React from 'react';
import {
  User,
  ShieldCheck,
  Lock,
  Heart,
  HelpCircle,
  LogOut,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { AuthUser } from '@/types';

interface UserProfileViewProps {
  user: AuthUser | null;
  onOpenIdentityModal: () => void;
  onLogout: () => void;
  onOpenPricing: () => void;
  onOpenAuth?: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  onOpenIdentityModal,
  onLogout,
  onOpenPricing,
  onOpenAuth
}) => {
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-[#6C3BFF] flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Join Frndma</h3>
          <p className="text-xs text-slate-500 mb-6">
            Sign in or create an account to view and manage your profile, matches, and unlocked contacts.
          </p>
          <button
            onClick={onOpenAuth}
            className="w-full py-3 rounded-2xl bg-[#6C3BFF] hover:bg-[#5828E8] text-white font-bold text-sm shadow-md shadow-purple-200 transition-all"
          >
            Sign In / Sign Up
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100 text-center sm:text-left">
          <div className="relative w-24 h-24 rounded-3xl overflow-hidden bg-slate-100 ring-4 ring-purple-100 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatar}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-black text-slate-900">{user.username}</h2>
              <span className="p-1 rounded-full bg-emerald-100 text-emerald-700" title="18+ Verified Adult">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-500 font-medium">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#6C3BFF] font-bold">
                {user.orientation}
              </span>
              <span>•</span>
              <span>{user.age} years old</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">18+ Confirmed</span>
            </div>

            <p className="text-xs text-slate-600 pt-1">
              {user.bio || 'Easy-going, authentic, and open to genuine friendship and meaningful dates.'}
            </p>
          </div>
        </div>

        {/* Premium Privilege Box */}
        <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-teal-50 border border-purple-200/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
              Contact Unlock System
            </span>
            <h4 className="text-sm font-bold text-slate-900 mt-1">₹299 WhatsApp Unlocks</h4>
            <p className="text-xs text-slate-500">
              Direct access to connect externally with verified men on WhatsApp.
            </p>
          </div>
          <button
            onClick={onOpenPricing}
            className="px-3.5 py-2 rounded-xl bg-[#6C3BFF] text-white text-xs font-bold hover:bg-[#5828E8] shadow-xs transition-colors flex-shrink-0"
          >
            Learn More
          </button>
        </div>

        {/* Privacy & Safety Settings List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Account &amp; Security Controls
          </h4>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs font-bold text-slate-800">Approximate Distance Only</p>
                <p className="text-[11px] text-slate-500">Exact city &amp; location are never broadcast</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Enabled
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#00C496]" />
              <div>
                <p className="text-xs font-bold text-slate-800">Phone Number Shield</p>
                <p className="text-[11px] text-slate-500">Private &amp; hidden from public source</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Secured
            </span>
          </div>

          <button
            onClick={onOpenIdentityModal}
            className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-purple-50/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-[#6C3BFF]" />
              <div>
                <p className="text-xs font-bold text-slate-800">Platform Safety &amp; Guidelines</p>
                <p className="text-[11px] text-slate-500">Verified models &amp; contact safety guide</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Logout */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            Role: <strong className="text-slate-600 capitalize">{user.role}</strong>
          </span>

          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
