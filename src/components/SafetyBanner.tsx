import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, X } from 'lucide-react';

export const SafetyBanner: React.FC = () => {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-teal-50 border-y border-purple-100/80 px-4 py-2.5 text-xs text-slate-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-full bg-white shadow-xs text-[#6C3BFF]">
            <ShieldCheck className="w-3.5 h-3.5" />
          </span>
          <span>
            <strong className="text-slate-900 font-semibold">Safety First:</strong> Never share passwords, bank OTPs, or financial information with anyone. Report any suspicious behavior immediately.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
