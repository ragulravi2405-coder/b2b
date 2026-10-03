import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Crown, Zap, ArrowRight, MessageCircle, CreditCard, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { loadRazorpayScript } from '@/lib/razorpay';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExplore: () => void;
  onSubscribe?: (details: { paymentId: string }) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onExplore, onSubscribe }) => {
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'subscription'>('single');
  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState<string | null>(null);
  const [subSuccess, setSubSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubError(null);
      setSubSuccess(false);
      setSubLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRazorpayVIPCheckout = async () => {
    setSubLoading(true);
    setSubError(null);

    try {
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        throw new Error('Could not load Razorpay SDK. Please check your internet connection.');
      }

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!keyId || keyId === 'rzp_test_B2BDemoKey123' || !keyId.startsWith('rzp_')) {
        window.open('https://razorpay.me/@ravirahul601', '_blank');
        throw new Error('Razorpay API Key ID is required in .env.local to enable automated popup checkout. Please configure NEXT_PUBLIC_RAZORPAY_KEY_ID in .env.local.');
      }

      const options: any = {
        key: keyId,
        amount: 1499 * 100, // ₹1,499 in paise
        currency: 'INR',
        name: 'B2B Connect VIP',
        description: 'VIP Unlimited Pass (10 Unlocks + VIP Badge)',
        handler: async function (response: any) {
          setSubLoading(true);
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: 'current-user-1',
                profileId: 'subscription_monthly_1499',
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
              throw new Error(verifyData.error || 'VIP verification failed on server.');
            }

            setSubSuccess(true);
            confetti({
              particleCount: 150,
              spread: 90,
              origin: { y: 0.6 }
            });
            if (onSubscribe) {
              onSubscribe({ paymentId: response.razorpay_payment_id });
            }
          } catch (err: any) {
            setSubError(err.message || 'VIP verification failed.');
          } finally {
            setSubLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setSubLoading(false);
          }
        },
        theme: {
          color: '#E94B99'
        }
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on('payment.failed', function (resp: any) {
        setSubLoading(false);
        setSubError(`Payment failed: ${resp.error?.description || 'Transaction was declined.'}`);
      });
      razorpayInstance.open();
    } catch (err: any) {
      setSubError(err.message || 'Could not open Razorpay checkout.');
      setSubLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden">
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6C3BFF] via-[#E94B99] to-[#00C496] rounded-t-3xl" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-purple-50 text-[#6C3BFF] mb-3">
            <Crown className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Real Contacts</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Choose how you would like to connect with genuine, verified male models &amp; companions.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
          <button
            onClick={() => setSelectedPlan('single')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              selectedPlan === 'single'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Pay Per Contact (₹299)
          </button>
          <button
            onClick={() => setSelectedPlan('subscription')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              selectedPlan === 'subscription'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>VIP Pass (₹1,499)</span>
            <span className="text-[10px] bg-emerald-100 text-[#00C496] px-1.5 py-0.2 rounded-full font-black">
              SAVE 50%
            </span>
          </button>
        </div>

        {/* Plan Content */}
        {selectedPlan === 'single' ? (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border-2 border-purple-200 bg-purple-50/30 relative">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-black text-slate-900 text-base">Pay-Per-Contact</h3>
                  <p className="text-xs text-slate-500">Pay only for the profiles you like</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">₹299</span>
                  <span className="text-xs text-slate-500 block">/ contact</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 mb-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                  <span>Verified WhatsApp direct number</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                  <span>One-time payment with lifetime access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                  <span>Strictly paid access — no automatic unlocks</span>
                </li>
              </ul>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Strictly paid access. Every profile contact is locked until paid individually via Razorpay.
            </p>

            <button
              onClick={() => {
                onClose();
                onExplore();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#6C3BFF] to-[#E94B99] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>Explore Profiles &amp; Unlock</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border-2 border-[#E94B99] bg-pink-50/20 relative">
              <div className="absolute -top-3 right-4 bg-gradient-to-r from-[#E94B99] to-[#6C3BFF] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                Best Value
              </div>

              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-black text-slate-900 text-base">VIP Unlimited Pass</h3>
                  <p className="text-xs text-slate-500">10 contact unlocks + VIP Badge</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-xs text-slate-400 line-through">₹2,990</span>
                    <span className="text-2xl font-black text-slate-900">₹1,499</span>
                  </div>
                  <span className="text-xs text-emerald-600 font-bold block">Save ₹1,491</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 mb-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                  <span><strong>10 Contact Unlocks</strong> (₹149/contact instead of ₹299)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                  <span>VIP Gold Crown on your profile</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                  <span>Razorpay secured payment (UPI, Cards, GPay, PhonePe)</span>
                </li>
              </ul>
            </div>

            {subError && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl flex items-center gap-2 border border-red-200 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{subError}</span>
              </div>
            )}

            {subSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-700 text-center font-bold text-sm rounded-2xl border border-emerald-200 animate-in fade-in">
                ₹1,499 Payment Verified! VIP Access Activated 🎉
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleRazorpayVIPCheckout}
                  disabled={subLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#E94B99] to-[#6C3BFF] hover:opacity-95 text-white font-bold text-sm shadow-md shadow-pink-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {subLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Opening Razorpay Gateway...</span>
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pay ₹1,499 via Razorpay to Activate</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  🔒 Opens official Razorpay gateway. VIP activates immediately upon payment.
                </p>
              </div>
            )}
          </div>
        )}

        <p className="text-[11px] text-slate-400 mt-4 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00C496]" />
          Secured by Razorpay
        </p>
      </div>
    </div>
  );
};
