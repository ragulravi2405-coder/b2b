'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, AuthUser } from '@/types';
import {
  X,
  Lock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  CreditCard,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import Image from 'next/image';

interface ContactUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  currentUser: AuthUser | null;
  onUnlockedSuccess: (profileId: string, whatsappUrl: string) => void;
  onOpenAuth?: () => void;
  isAlreadyUnlocked?: boolean;
  unlockedWhatsappUrl?: string;
}

export const ContactUnlockModal: React.FC<ContactUnlockModalProps> = ({
  isOpen,
  onClose,
  profile,
  currentUser,
  onUnlockedSuccess,
  onOpenAuth,
  isAlreadyUnlocked,
  unlockedWhatsappUrl
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(isAlreadyUnlocked ?? false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(unlockedWhatsappUrl ?? null);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [openedRazorpay, setOpenedRazorpay] = useState(false);

  const unlockAmount = profile?.unlockPrice ?? 499;
  const razorpayPaymentLink = 'https://razorpay.me/@ravirahul601';

  // Check if contact is already unlocked when opening
  useEffect(() => {
    if (!isOpen || !profile) return;
    setError(null);
    setOpenedRazorpay(false);

    if (isAlreadyUnlocked && unlockedWhatsappUrl) {
      setUnlocked(true);
      setWhatsappUrl(unlockedWhatsappUrl);
      return;
    }

    if (!currentUser) return;

    const checkUnlocked = async () => {
      try {
        const res = await fetch(`/api/contacts/${profile.id}?userId=${currentUser.id}`);
        const data = await res.json();
        if (data.success && data.unlocked) {
          setUnlocked(true);
          const finalUrl = data.whatsappUrl || `https://wa.me/${data.whatsappNumber || '919087923641'}?text=${encodeURIComponent(`Hi ${profile.username}, connected with you on B2B!`)}`;
          setWhatsappUrl(finalUrl);
          onUnlockedSuccess(profile.id, finalUrl);
        } else {
          setUnlocked(false);
          setWhatsappUrl(null);
        }
      } catch (err) {
        console.error('Failed to check unlock status', err);
      }
    };

    checkUnlocked();
  }, [isOpen, profile, currentUser, onUnlockedSuccess, isAlreadyUnlocked, unlockedWhatsappUrl]);

  if (!isOpen || !profile) return null;

  // Pay on Razorpay & Unlock Contact in one seamless action
  const handlePayAndUnlock = async () => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    // Open Razorpay payment link
    window.open(razorpayPaymentLink, '_blank', 'noopener,noreferrer');
    setLoading(true);
    setError(null);

    try {
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          profileId: profile.id,
          amount: unlockAmount,
          method: 'razorpay_link',
          confirmLinkPayment: true
        })
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        throw new Error(verifyData.error || 'Payment verification failed. Please try again.');
      }

      const generatedRef = verifyData.data?.paymentId || `pay_b2b_${Date.now()}`;
      setPaymentReference(generatedRef);

      // Celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#6C3BFF', '#FF6B9D', '#00C496', '#FFD700']
        });
      } catch (e) {
        // ignore if canvas confetti is blocked
      }

      const finalUrl = verifyData.data?.whatsappUrl || `https://wa.me/919087923641?text=${encodeURIComponent(`Hi ${profile.username}, connected with you on B2B!`)}`;
      setUnlocked(true);
      setWhatsappUrl(finalUrl);
      onUnlockedSuccess(profile.id, finalUrl);
    } catch (err: any) {
      console.error('Unlock error:', err);
      setError(err.message || 'Could not verify payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Top Gradient Accent Bar */}
        <div className="h-2.5 bg-gradient-to-r from-[#6C3BFF] via-[#A855F7] to-[#00C496]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7">
          {unlocked && whatsappUrl ? (
            /* Contact Unlocked View (Payment Success State) */
            <div className="text-center py-2 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#00C496] flex items-center justify-center mx-auto mb-3 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Payment Success • Contact Unlocked
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                Connect with {profile.username}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                ₹{unlockAmount} INR payment confirmed! You now have direct WhatsApp access to chat with {profile.username}.
              </p>

              {/* Transaction Reference Box */}
              <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-1.5">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Product / Platform:</span>
                  <span className="font-semibold text-slate-800">B2B Contact Unlock</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Contact Name:</span>
                  <span className="font-semibold text-slate-800">{profile.username}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>WhatsApp Number:</span>
                  <span className="font-bold text-emerald-600 font-mono text-sm">+91 90879 23641</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Amount Paid:</span>
                  <span className="font-bold text-slate-900">₹{unlockAmount} INR</span>
                </div>
                {paymentReference && (
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Payment Ref:</span>
                    <span className="font-mono text-[11px] font-semibold text-purple-700">{paymentReference}</span>
                  </div>
                )}
              </div>

              {/* Direct WhatsApp Open Button */}
              <div className="mt-5 space-y-2.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                  Chat with {profile.username} on WhatsApp
                  <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
                </a>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Close &amp; Back to Feed
                </button>
              </div>
            </div>
          ) : (
            /* Locked Checkout View */
            <div>
              {/* Header with Avatar */}
              <div className="text-center mb-4">
                <div className="relative w-20 h-20 mx-auto mb-2 rounded-2xl overflow-hidden shadow-md border-2 border-purple-200">
                  <Image
                    src={profile.avatar || '/profiles/south-indian-1.jpg'}
                    alt={profile.username}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <span className="px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-[#6C3BFF]">
                  B2B Verified Contact
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1.5">
                  Unlock {profile.username}&apos;s WhatsApp
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {profile.age} yrs • {profile.distanceKm} km away • {profile.orientation}
                </p>
              </div>

              {/* Order Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 mb-4 space-y-2 text-xs text-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Product / Service:</span>
                  <span className="font-semibold text-slate-900">B2B Direct Contact Access</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Companion:</span>
                  <span className="font-semibold text-slate-900">{profile.username}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Direct WhatsApp:</span>
                  <span className="font-semibold text-emerald-700">Verified (+91 90879 ••••••)</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm">
                  <span className="font-bold text-slate-900">Unlock Fee:</span>
                  <span className="font-black text-xl text-[#6C3BFF]">₹{unlockAmount} INR</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  One-time fee. Instant direct WhatsApp chat access.
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-start gap-2 border border-red-200 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                  <div>
                    <p className="font-bold">Notice</p>
                    <p className="text-[11px]">{error}</p>
                  </div>
                </div>
              )}

              {/* Single-Click Seamless Razorpay Flow */}
              {!currentUser ? (
                <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 text-center space-y-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-[#6C3BFF] flex items-center justify-center mx-auto">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Sign Up / Log In Required</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Log in to pay ₹{unlockAmount} INR and unlock {profile.username}&apos;s verified WhatsApp.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="w-full py-3 rounded-xl bg-[#6C3BFF] hover:bg-[#5828E8] text-white font-bold text-xs shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Sign Up / Log In to Unlock</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Single Action: Pay & Unlock Contact */}
                  <button
                    type="button"
                    onClick={handlePayAndUnlock}
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#6C3BFF] via-[#8B5CF6] to-[#00C496] hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Unlocking Contact...</span>
                      </div>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Pay ₹{unlockAmount} &amp; Unlock Contact</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-center text-[11px] text-purple-900">
                    <span>Official Razorpay Payment: </span>
                    <a
                      href={razorpayPaymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline text-[#6C3BFF]"
                    >
                      razorpay.me/@ravirahul601
                    </a>
                    <span className="block text-[10px] text-slate-500 mt-0.5">
                      Supports GPay, PhonePe, Paytm, UPI ID &amp; Cards
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                    🔒 Direct instant access. Click to pay on Razorpay and chat immediately on WhatsApp.
                  </p>
                </div>
              )}

              {/* Policy & Support */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-center">
                <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 font-medium">
                  <Link href="/terms" target="_blank" className="hover:text-[#6C3BFF] underline">
                    Terms
                  </Link>
                  <span>•</span>
                  <Link href="/privacy" target="_blank" className="hover:text-[#6C3BFF] underline">
                    Privacy
                  </Link>
                  <span>•</span>
                  <Link href="/refund" target="_blank" className="hover:text-[#6C3BFF] underline">
                    Refund Policy
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
