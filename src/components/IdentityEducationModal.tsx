import React from 'react';
import { X, Heart, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';

interface IdentityEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IdentityEducationModal: React.FC<IdentityEducationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 pride-accent-bar" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center text-[#6C3BFF]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Understanding Identities</h3>
            <p className="text-xs sm:text-sm text-slate-500">Respectful, inclusive terms on Frndma</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Gay definition */}
          <div className="p-4 rounded-2xl bg-[#F7F7FC] border border-purple-100/80 hover:border-purple-200 transition-all">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-[#6C3BFF]">
                Gay
              </span>
              <span className="text-xs font-medium text-slate-400">• Orientation</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              A man who is romantically, emotionally, or sexually attracted to other men.
            </p>
          </div>

          {/* Bisexual definition */}
          <div className="p-4 rounded-2xl bg-[#F7F7FC] border border-pink-100/80 hover:border-pink-200 transition-all">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-[#E94B99]">
                Bisexual
              </span>
              <span className="text-xs font-medium text-slate-400">• Orientation</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              A person who can experience romantic, emotional, or sexual attraction to more than one gender.
            </p>
          </div>

          {/* Platform Inclusivity Note */}
          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#00C496] flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-teal-900 leading-relaxed">
              <span className="font-semibold">Safe &amp; Affirming Space:</span> Frndma welcomes every adult Indian individual to express their authentic self without fear of judgment, prejudice, or outing.
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#6C3BFF] text-white font-medium hover:bg-[#5828E8] transition-all shadow-md shadow-purple-200"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
