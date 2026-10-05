import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Crown, ArrowRight, CreditCard, AlertCircle, Sparkles, RefreshCw, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';
import { loadRazorpayScript } from '@/lib/razorpay';
import Link from 'next/link';

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
  const [paymentReference, setPaymentReference] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSubError(null);
      setSubSuccess(false);
      setSubLoading(false);
      setPaymentReference(null);
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

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_Tk6HPEGS2HVr0h';
      if (!keyId || !keyId.startsWith('rzp_')) {
        window.open('https://razorpay.me/@ravirahul601', '_blank');
        throw new Error('Razorpay API Key ID is required to enable automated popup checkout.');
      }

      const options: any = {
        key: keyId,
        amount: 1499 * 100, // ₹1,499 in paise
        currency: 'INR',
        name: 'Frndma',
        description: 'VIP Pass (10 Contact Unlocks + VIP Badge)',
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

            setPaymentReference(response.razorpay_payment_id);
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
            setSubError(err.message || 'VIP payment verification failed. Please contact support at frndma.com@gmail.com.');
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
          color: '#6C3BFF'
        }
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on('payment.failed', function (resp: any) {
        setSubLoading(false);
        setSubError(`Payment failed: ${resp.error?.description || 'Transaction was declined by bank/gateway.'} Please try again or contact support at frndma.com@gmail.com.`);
      });
      razorpayInstance.open();
    } catch (err: any) {
      setSubError(err.message || 'Could not open Razorpay checkout.');
      setSubLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] overflow-y-auto">
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
          <div className="inline-flex p-3 rounded-2xl bg-purple-50 text-[#6C3BFF] mb-2.5">
            <Crown className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Verified Contacts</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Choose your preferred plan to connect with genuine, verified companions on Frndma.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
          <button
            onClick={() => setSelectedPlan('single')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              selectedPlan === 'single'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Pay Per Contact (₹299 INR)
          </button>
          <button
            onClick={() => setSelectedPlan('subscription')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedPlan === 'subscription'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>VIP Pass (₹1,499 INR)</span>
            <span className="text-[10px] bg-purple-100 text-[#6C3BFF] px-1.5 py-0.2 rounded-full font-bold">
              10 Unlocks
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
                  <p className="text-xs text-slate-500">Pay only for the profiles you select</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">₹299</span>
                  <span className="text-xs text-slate-500 block font-semibold">INR (All taxes incl.)</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 mb-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                  <span>Instant verified WhatsApp contact unlock</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                  <span>Direct chat button with pre-filled greeting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                  <span>One-time fee — permanent retained access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                  <span>Refund protected under technical failure policy</span>
                </li>
              </ul>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              Browse profiles freely and pay ₹299 INR on-demand when ready to unlock a companion.
            </p>

            <button
              onClick={() => {
                onClose();
                onExplore();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#6C3BFF] to-[#E94B99] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
            >
              <span>Explore Profiles &amp; Unlock</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border-2 border-[#6C3BFF] bg-purple-50/20 relative">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-black text-slate-900 text-base">VIP Pass Bundle</h3>
                  <p className="text-xs text-slate-500">10 contact unlocks + VIP Profile Badge</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">₹1,499</span>
                  <span className="text-xs text-slate-500 block font-semibold">INR (All taxes incl.)</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 mb-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                  <span><strong>10 Contact Unlocks</strong> (₹149.90/contact)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                  <span>VIP Gold Crown Badge on your profile</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                  <span>Priority customer support queue</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                  <span>Instant activation upon payment capture</span>
                </li>
              </ul>
            </div>

            {subError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-start gap-2 border border-red-200 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                <div className="flex-1">
                  <p className="font-bold">Transaction Notice</p>
                  <p className="text-[11px] mt-0.5">{subError}</p>
                </div>
              </div>
            )}

            {subSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 text-center rounded-2xl border border-emerald-200 animate-in fade-in space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#00C496] mx-auto" />
                <p className="font-bold text-sm">₹1,499 Payment Verified! VIP Access Activated 🎉</p>
                {paymentReference && (
                  <p className="text-[11px] text-slate-500 font-mono">Payment Ref: {paymentReference}</p>
                )}
                <p className="text-[11px] text-slate-500">
                  Confirmation sent to your account. Support: frndma.com@gmail.com
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onExplore();
                  }}
                  className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Start Using VIP Credits &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleRazorpayVIPCheckout}
                  disabled={subLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#6C3BFF] to-[#E94B99] hover:opacity-95 text-white font-bold text-sm shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {subLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Opening Razorpay Gateway...</span>
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Proceed to Pay ₹1,499 INR via Razorpay</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                  🔒 Payments are securely processed through Razorpay. Frndma never stores your card credentials or UPI PIN.
                </p>
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

          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
            <Mail className="w-3 h-3 text-slate-400" />
            <span>Support: </span>
            <a href="mailto:frndma.com@gmail.com" className="text-[#6C3BFF] font-semibold hover:underline">
              frndma.com@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
