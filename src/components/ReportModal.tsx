import React, { useState } from 'react';
import { X, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '@/types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onReportSubmitted: (reason: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  profile,
  onReportSubmitted
}) => {
  const [reason, setReason] = useState('Underage suspicion');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !profile) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportedProfileId: profile.id,
          reason,
          details
        })
      });
      setSubmitted(true);
      onReportSubmitted(reason);
      setTimeout(() => {
        setSubmitted(false);
        setDetails('');
        onClose();
      }, 1600);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-[#00C496] mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-900">Report Received</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Thank you for keeping Frndma safe. Our moderation team will investigate {profile.username}&apos;s profile promptly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Report {profile.username}</h3>
                <p className="text-xs text-slate-500">All reports are strictly confidential</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Select Reason</label>
                <div className="space-y-2">
                  {[
                    'Underage suspicion (under 18)',
                    'Inappropriate or explicit content',
                    'Commercial / Spam / Solicitation',
                    'Impersonation or fake profile',
                    'Harassment or abusive behavior'
                  ].map((item) => (
                    <label
                      key={item}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                        reason === item ? 'border-[#6C3BFF] bg-purple-50/50 text-[#6C3BFF]' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        value={item}
                        checked={reason === item}
                        onChange={() => setReason(item)}
                        className="text-[#6C3BFF] focus:ring-purple-500"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Additional Details (Optional)</label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide any additional context for our moderation team..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6C3BFF] focus:ring-2 focus:ring-purple-100 resize-none"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-50 transition-all shadow-md shadow-red-100"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
