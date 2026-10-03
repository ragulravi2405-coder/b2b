import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Heart, Lock } from 'lucide-react';

interface FooterProps {
  onOpenIdentityModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenIdentityModal }) => {
  return (
    <footer className="bg-white border-t border-slate-200/80 mt-16 pb-20 md:pb-8">
      {/* Pride Accent Line */}
      <div className="h-1 pride-accent-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-3">
            <Logo size="md" showTagline={true} />
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              B2B is a private, modern social and dating connection platform designed exclusively for adult Indian men who identify as Gay or Bisexual.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#00C496]" />
              <span>Real Men. Real Connections. No Pretense.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Community &amp; Safety
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li>
                <button onClick={onOpenIdentityModal} className="hover:text-[#6C3BFF] transition-colors">
                  Learn About Identities
                </button>
              </li>
              <li>
                <span className="hover:text-[#6C3BFF] cursor-pointer">Safety Guidelines</span>
              </li>
              <li>
                <span className="hover:text-[#6C3BFF] cursor-pointer">Privacy &amp; Data Shield</span>
              </li>
              <li>
                <span className="hover:text-[#6C3BFF] cursor-pointer">Contact Moderation</span>
              </li>
            </ul>
          </div>

          {/* 18+ Disclaimer Box */}
          <div className="md:col-span-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
              <Lock className="w-3.5 h-3.5 text-[#6C3BFF]" />
              <span>18+ Adults Only Platform</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Strictly for consenting adults 18 years or older. Exact locations and phone numbers are never publicly broadcast.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} B2B Platform. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Crafted with pride &amp; respect for the Indian LGBTQ+ community</span>
            <Heart className="w-3 h-3 text-[#FF6B9D] fill-[#FF6B9D]" />
          </div>
        </div>
      </div>
    </footer>
  );
};
