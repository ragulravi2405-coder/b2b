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
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import Image from 'next/image';
import { loadRazorpayScript } from '@/lib/razorpay';

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
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(isAlreadyUnlocked ?? false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(unlockedWhatsappUrl ?? null);
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);

  const unlockAmount = 499; // Exactly ₹499

  // Check backend source-of-truth when modal opens
  useEffect(() => {
    if (!isOpen || !profile) return;
    setError(null);
    setLoading(false);
    setVerifying(false);

    if (isAlreadyUnlocked && unlockedWhatsappUrl) {
      setUnlocked(true);
      setWhatsappUrl(unlockedWhatsappUrl);
      return;
    }

    if (!currentUser) {
      setUnlocked(false);
      setWhatsappUrl(null);
      return;
    }

    // Always query the backend for verified authorization
    const checkBackendUnlock = async () => {
      try {
        const res = await fetch(`/api/contacts/${profile.id}?userId=${currentUser.id}`);
        const data = await res.json();
        if (data.success && data.unlocked && !data.locked) {
          setUnlocked(true);
          const finalUrl = data.whatsappUrl || `https://wa.me/${data.whatsappNumber || '919087923641'}?text=${encodeURIComponent(`Hi ${profile.username}, connected with you on B2B!`)}`;
          setWhatsappUrl(finalUrl);
          setWhatsappNumber(data.whatsappNumber || null);
          onUnlockedSuccess(profile.id, finalUrl);
        } else {
          setUnlocked(false);
          setWhatsappUrl(null);
        }
      } catch (err) {
        console.error('Failed to check unlock status', err);
        setUnlocked(false);
        setWhatsappUrl(null);
      }
    };

    checkBackendUnlock();
  }, [isOpen, profile, currentUser, onUnlockedSuccess, isAlreadyUnlocked, unlockedWhatsappUrl]);

  if (!isOpen || !profile) return null;

  // Genuine Razorpay Checkout Flow
  const handleStartRazorpayCheckout = async () => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create official Razorpay Order from the BACKEND
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: profile.id })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment order. Please try again.');
      }

      // If already confirmed unlocked on backend
      if (orderData.alreadyUnlocked && !orderData.locked) {
        setUnlocked(true);
        setWhatsappUrl(orderData.whatsappUrl);
        setWhatsappNumber(orderData.whatsappNumber || null);
        onUnlockedSuccess(profile.id, orderData.whatsappUrl);
        setLoading(false);
        return;
      }

      const order = orderData.order;
      if (!order || !order.orderId) {
        throw new Error('Invalid order response from backend.');
      }

      // 2. Load official Razorpay Checkout SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !(window as any).Razorpay) {
        throw new Error('Razorpay Checkout SDK failed to load. Please check your internet connection.');
      }

      // 3. Open Razorpay Checkout modal with backend order
      const options = {
        key: order.keyId,
        amount: order.amount, // 49900 paise
        currency: order.currency || 'INR',
        name: 'B2B',
        description: `Unlock Contact — ${profile.username}`,
        order_id: order.orderId,
        prefill: {
          name: currentUser.username || '',
          email: currentUser.email || ''
        },
        theme: {
          color: '#6C3BFF'
        },
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          // 4. Payment succeeded on Razorpay! Now submit to BACKEND for cryptographic verification
          setLoading(true);
          setVerifying(true);
          setError(null);

          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                profileId: profile.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success || !verifyData.unlocked) {
              throw new Error(verifyData.error || 'Payment verification failed. Contact remains locked.');
            }

            // 5. Backend verification passed! Genuine unlock
            setPaymentReference(response.razorpay_payment_id);
            const finalUrl =
              verifyData.contact?.whatsappUrl ||
              `https://wa.me/${verifyData.contact?.whatsappNumber || '919087923641'}?text=${encodeURIComponent(`Hi ${profile.username}, connected with you on B2B!`)}`;

            setUnlocked(true);
            setWhatsappUrl(finalUrl);
            setWhatsappNumber(verifyData.contact?.whatsappNumber || null);
            onUnlockedSuccess(profile.id, finalUrl);

            try {
              confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#6C3BFF', '#FF6B9D', '#00C496', '#FFD700']
              });
            } catch (e) {
              // canvas confetti is optional
            }
          } catch (verifyErr: any) {
            console.error('Backend verification error:', verifyErr);
            setError(verifyErr.message || 'Payment verification failed. Contact remains locked.');
          } finally {
            setLoading(false);
            setVerifying(false);
          }
        },
        modal: {
          ondismiss: function () {
            // User closed Razorpay or pressed browser Back: DO NOT UNLOCK!
            setLoading(false);
            setVerifying(false);
            setError('Payment cancelled. Contact remains locked.');
          }
        }
      };

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.on('payment.failed', function (failResp: any) {
        setLoading(false);
        setVerifying(false);
        setError(failResp?.error?.description || 'Payment failed. Contact remains locked.');
      });

      rzpInstance.open();
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Could not start checkout. Please try again.');
      setLoading(false);
      setVerifying(false);
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
            /* Contact Unlocked View (Only shown after GENUINE BACKEND VERIFICATION) */
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
                ₹{unlockAmount} INR payment verified by backend! You now have direct WhatsApp access to chat with {profile.username}.
              </p>

              {/* Transaction Reference Box */}
              <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-1.5">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Product / Platform:</span>
                  <span className="font-semibold text-slate-800">B2B Contact Access</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Companion Name:</span>
                  <span className="font-semibold text-slate-800">{profile.username}</span>
                </div>
                {whatsappNumber && (
                  <div className="flex justify-between items-center text-slate-500">
                    <span>WhatsApp Number:</span>
                    <span className="font-bold text-emerald-600 font-mono text-sm">+{whatsappNumber}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-slate-500">
                  <span>Amount Paid:</span>
                  <span className="font-bold text-slate-900">₹{unlockAmount} INR</span>
                </div>
                {paymentReference && (
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Payment ID:</span>
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
                  Unlock {profile.username}&apos;s Contact
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {profile.age} yrs • {profile.distanceKm} km away • {profile.orientation}
                </p>
              </div>

              {/* Order Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 mb-4 space-y-2 text-xs text-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Product / Service:</span>
                  <span className="font-semibold text-slate-900">B2B Direct WhatsApp Unlock</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Companion:</span>
                  <span className="font-semibold text-slate-900">{profile.username}</span>
                </div>
                {/* STRICT PRIVACY: NEVER SHOW HALF / PARTIAL MOBILE NUMBERS */}
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">WhatsApp Contact:</span>
                  <span className="font-semibold text-purple-700 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Protected (Locked 🔒)
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm">
                  <span className="font-bold text-slate-900">Unlock Fee:</span>
                  <span className="font-black text-xl text-[#6C3BFF]">₹{unlockAmount} INR</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  One-time fee. Instant direct WhatsApp chat access upon verified payment.
                </p>
              </div>

              {/* Error / Cancellation Banner */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-start gap-2 border border-red-200 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                  <div className="flex-1">
                    <p className="font-bold">Notice</p>
                    <p className="text-[11px]">{error}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
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
                  <button
                    type="button"
                    onClick={handleStartRazorpayCheckout}
                    disabled={loading || verifying}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#6C3BFF] via-[#8B5CF6] to-[#00C496] hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                  >
                    {verifying ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Payment with Bank...</span>
                      </div>
                    ) : loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Opening Razorpay Checkout...</span>
                      </div>
                    ) : error ? (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        <span>Try Again — Unlock Contact ₹{unlockAmount}</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Unlock Contact — ₹{unlockAmount}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00C496]" />
                    <span>Official PCI-DSS 256-bit Encrypted Razorpay Checkout</span>
                  </div>
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
