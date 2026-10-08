'use client';

import React, { useState } from 'react';
import { Check, Sparkles, X, Shield, Zap, Lock, CreditCard, Mail, ExternalLink, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planId: string) => void;
  onSubscribe?: (details: any) => void;
  onExplore?: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onSelectPlan, onSubscribe, onExplore }) => {
  const [selectedTier, setSelectedTier] = useState<'per_unlock' | 'vip_monthly'>('vip_monthly');
  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState<string | null>(null);
  const [subSuccess, setSubSuccess] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);

  if (!isOpen) return null;

  const razorpayLink = 'https://razorpay.me/@ravirahul601';

  const handleOpenRazorpay = () => {
    window.open(razorpayLink, '_blank', 'noopener,noreferrer');
  };

  const handleConfirmVIPPayment = async () => {
    setSubLoading(true);
    setSubError(null);

    try {
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user-1',
          profileId: 'subscription_monthly_1499',
          amount: 1499,
          method: 'razorpay_link',
          confirmLinkPayment: true
        })
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        throw new Error(verifyData.error || 'VIP verification failed. Please try again.');
      }

      const generatedRef = verifyData.data?.paymentId || `pay_vip_${Date.now()}`;
      setPaymentReference(generatedRef);
      setSubSuccess(true);
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      if (onSubscribe) {
        onSubscribe({ paymentId: generatedRef });
      }
    } catch (err: any) {
      setSubError(err.message || 'VIP payment verification failed. Please try again.');
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#6C3BFF] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            B2B Companion Access
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Transparent, Fair Pricing
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Choose your preferred plan to connect with genuine, verified companions on B2B.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Pay As You Go */}
          <div
            onClick={() => setSelectedTier('per_unlock')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
              selectedTier === 'per_unlock'
                ? 'border-[#6C3BFF] bg-purple-50/30 shadow-md'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Direct Unlocks
              </span>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedTier === 'per_unlock'
                    ? 'border-[#6C3BFF] bg-[#6C3BFF] text-white'
                    : 'border-slate-300'
                }`}
              >
                {selectedTier === 'per_unlock' && <Check className="w-3 h-3" />}
              </div>
            </div>
            <div className="mb-3">
              <span className="text-3xl font-black text-slate-900">₹499</span>
              <span className="text-xs text-slate-400 ml-1 font-semibold">/ contact</span>
              <div className="text-[11px] text-[#00C496] font-semibold mt-0.5">Flat ₹499 for all verified contacts</div>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                <span>One-time fee per companion</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                <span>Instant WhatsApp number</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                <span>Lifetime permanent access</span>
              </li>
            </ul>
          </div>

          {/* VIP Pass */}
          <div
            onClick={() => setSelectedTier('vip_monthly')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
              selectedTier === 'vip_monthly'
                ? 'border-[#6C3BFF] bg-purple-50/40 shadow-lg'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="absolute -top-3 right-4 px-2.5 py-0.5 bg-gradient-to-r from-[#6C3BFF] to-[#E94B99] text-white text-[10px] font-black rounded-full uppercase tracking-wider shadow-sm">
              Best Value
            </span>
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                VIP Pass
              </span>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedTier === 'vip_monthly'
                    ? 'border-[#6C3BFF] bg-[#6C3BFF] text-white'
                    : 'border-slate-300'
                }`}
              >
                {selectedTier === 'vip_monthly' && <Check className="w-3 h-3" />}
              </div>
            </div>
            <div className="mb-3">
              <span className="text-3xl font-black text-slate-900">₹1,499</span>
              <span className="text-xs text-slate-400 ml-1 font-semibold">/ month</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                <span><strong>10 Contact Unlocks</strong> included</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                <span>Save over 50% vs single unlocks</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                <span>VIP Profile Badge &amp; Priority</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Section */}
        {selectedTier === 'per_unlock' ? (
          <div className="space-y-3">
            <button
              onClick={() => {
                onClose();
                if (onSelectPlan) onSelectPlan('per_unlock');
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#6C3BFF] to-[#8B5CF6] hover:opacity-95 text-white font-bold text-sm shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Profiles &amp; Unlock On-Demand</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center">
              Pay ₹499 only when you choose to unlock a companion.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {subError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {subError}
              </div>
            )}

            {subSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-emerald-900">VIP Pass Activated!</h4>
                <p className="text-xs text-emerald-700">
                  You now have 10 contact unlocks and VIP status on B2B.
                </p>
                {paymentReference && (
                  <p className="text-[11px] font-mono text-emerald-800">
                    Ref: {paymentReference}
                  </p>
                )}
                <button
                  onClick={() => {
                    onClose();
                  }}
                  className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Start Connecting Now &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleOpenRazorpay}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#6C3BFF] to-[#E94B99] hover:opacity-95 text-white font-bold text-sm shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>1. Pay ₹1,499 via Razorpay / UPI</span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </button>

                <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 text-center text-[11px] text-purple-900">
                  <span>Pay link: </span>
                  <a
                    href={razorpayLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline text-[#6C3BFF]"
                  >
                    razorpay.me/@ravirahul601
                  </a>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmVIPPayment}
                  disabled={subLoading}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {subLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Activating VIP Pass...</span>
                    </div>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>2. I Have Paid ₹1,499 — Activate VIP Pass</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer Policy Links */}
        <div className="mt-5 pt-3 border-t border-slate-100 space-y-1.5">
          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 font-medium">
            <Link href="/terms" target="_blank" className="hover:text-[#6C3BFF] underline">
              Terms &amp; Conditions
            </Link>
            <span>•</span>
            <Link href="/privacy" target="_blank" className="hover:text-[#6C3BFF] underline">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/refund" target="_blank" className="hover:text-[#6C3BFF] underline">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
