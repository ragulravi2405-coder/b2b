import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle2, ShieldCheck, MessageCircle, ExternalLink, CreditCard, AlertCircle, Sparkles, RefreshCw, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, AuthUser } from '@/types';
import { loadRazorpayScript } from '@/lib/razorpay';
import Link from 'next/link';

interface ContactUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onUnlockedSuccess: (profileId: string, whatsappUrl: string) => void;
  isAlreadyUnlocked?: boolean;
  unlockedWhatsappUrl?: string;
  currentUser?: AuthUser | null;
  onOpenAuth?: () => void;
}

export const ContactUnlockModal: React.FC<ContactUnlockModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUnlockedSuccess,
  isAlreadyUnlocked = false,
  unlockedWhatsappUrl,
  currentUser,
  onOpenAuth
}) => {
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(isAlreadyUnlocked);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(unlockedWhatsappUrl || null);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync state whenever target profile or lock status changes
  useEffect(() => {
    setUnlocked(isAlreadyUnlocked);
    setWhatsappUrl(unlockedWhatsappUrl || null);
    setError(null);
    setLoading(false);

    if (isOpen && profile?.id && currentUser?.id && !isAlreadyUnlocked) {
      fetch(`/api/contacts/${profile.id}?userId=${currentUser.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.unlocked) {
            setUnlocked(true);
            const finalUrl = data.whatsappUrl || `https://wa.me/${profile.whatsappNumber}?text=${encodeURIComponent(`Hi ${profile.username}, connected with you on Frndma!`)}`;
            setWhatsappUrl(finalUrl);
            onUnlockedSuccess(profile.id, finalUrl);
          }
        })
        .catch(() => {});
    }
  }, [profile?.id, isAlreadyUnlocked, unlockedWhatsappUrl, isOpen, currentUser?.id]);

  if (!isOpen || !profile) return null;

  const unlockAmount = profile.unlockPrice ?? 299;

  // Open official Razorpay Checkout popup directly (no manual typing, automated verification)
  const handleRazorpayCheckout = async () => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Load Razorpay SDK
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        throw new Error('Could not load Razorpay SDK. Please check your internet connection.');
      }

      // 2. Create order on server
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          profileId: profile.id
        })
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order.');
      }

      if (orderData.alreadyUnlocked) {
        setUnlocked(true);
        setWhatsappUrl(orderData.whatsappUrl);
        onUnlockedSuccess(profile.id, orderData.whatsappUrl);
        setLoading(false);
        return;
      }

      const keyId = orderData.order?.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!keyId || keyId === 'rzp_test_B2BDemoKey123' || !keyId.startsWith('rzp_')) {
        window.open('https://razorpay.me/@ravirahul601', '_blank');
        throw new Error('Razorpay API Key ID is required in .env.local to enable automated popup checkout.');
      }

      // 3. Open official Razorpay Popup Checkout
      const options: any = {
        key: keyId,
        amount: (orderData.order?.amount || unlockAmount) * 100, // paise
        currency: 'INR',
        name: 'Frndma',
        description: `Unlock ${profile.username}'s Contact`,
        order_id: orderData.order?.orderId?.startsWith('order_') ? orderData.order.orderId : undefined,
        handler: async function (response: any) {
          setLoading(true);
          try {
            // Send genuine Razorpay response for verification
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: currentUser.id,
                profileId: profile.id,
                razorpayOrderId: response.razorpay_order_id || orderData.order?.orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed on server.');
            }

            setPaymentReference(response.razorpay_payment_id);

            // Unlocked with celebration
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#6C3BFF', '#FF6B9D', '#00C496', '#FFD700']
            });

            const finalUrl = verifyData.data?.whatsappUrl || `https://wa.me/${profile.whatsappNumber}?text=${encodeURIComponent(`Hi ${profile.username}, connected with you on Frndma!`)}`;
            setUnlocked(true);
            setWhatsappUrl(finalUrl);
            onUnlockedSuccess(profile.id, finalUrl);
          } catch (verifyErr: any) {
            console.error('Verification error:', verifyErr);
            setError(verifyErr.message || 'Verification failed. Please contact support at frndma.com@gmail.com.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        },
        prefill: {
          name: currentUser.username,
          contact: ''
        },
        theme: {
          color: '#6C3BFF'
        }
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on('payment.failed', function (resp: any) {
        setLoading(false);
        setError(`Payment failed: ${resp.error?.description || 'Transaction was declined by bank/gateway.'} Please try again or contact support at frndma.com@gmail.com.`);
      });
      razorpayInstance.open();
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Could not open Razorpay Checkout.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Top Pride Accent Bar */}
        <div className="h-2.5 pride-accent-bar" />

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
            <div className="text-center py-2">
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
                ₹{unlockAmount} INR payment captured successfully. You now have direct access to chat with {profile.username} on WhatsApp.
              </p>

              {/* Transaction Reference Box */}
              <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-1.5">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Product / Service:</span>
                  <span className="font-semibold text-slate-800">Frndma Contact Unlock</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Companion:</span>
                  <span className="font-semibold text-slate-800">{profile.username}</span>
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
                <div className="flex justify-between items-center text-slate-500 pt-1 border-t border-slate-200/60 text-[11px]">
                  <span>Support:</span>
                  <a href="mailto:frndma.com@gmail.com" className="text-[#6C3BFF] font-medium hover:underline">
                    frndma.com@gmail.com
                  </a>
                </div>
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
              {/* Header */}
              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#6C3BFF] flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <span className="px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-[#6C3BFF]">
                  Secure Checkout
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1.5">
                  Unlock {profile.username}&apos;s Contact
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Service: Direct WhatsApp Access with <span className="font-semibold text-slate-800">{profile.username}</span>
                </p>
              </div>

              {/* Itemized Order Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 mb-4 space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Product / Service:</span>
                  <span className="font-semibold text-slate-900">Frndma Contact Unlock</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Selected Profile:</span>
                  <span className="font-semibold text-slate-900">{profile.username} ({profile.orientation})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Currency:</span>
                  <span className="font-semibold text-slate-900">INR (Indian Rupee)</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm">
                  <span className="font-bold text-slate-900">Final Payable Amount:</span>
                  <span className="font-black text-lg text-[#6C3BFF]">₹{unlockAmount} INR</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Includes all applicable taxes. One-time fee for lifetime retained access to this contact.
                </p>
              </div>

              {/* Error / Failure Banner with Retry Option */}
              {error && (
                <div className="mb-4 p-3.5 rounded-xl bg-red-50 text-red-700 text-xs space-y-2 border border-red-200 animate-in fade-in">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                    <div>
                      <p className="font-bold">Transaction Alert</p>
                      <p className="text-[11px] mt-0.5">{error}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-red-200/60 text-[11px]">
                    <button
                      type="button"
                      onClick={handleRazorpayCheckout}
                      className="font-bold text-red-800 underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Retry Payment
                    </button>
                    <a
                      href="mailto:frndma.com@gmail.com"
                      className="text-[#6C3BFF] font-semibold underline"
                    >
                      Contact Support
                    </a>
                  </div>
                </div>
              )}

              {/* Action Flow */}
              {!currentUser ? (
                <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 text-center space-y-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-[#6C3BFF] flex items-center justify-center mx-auto">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Sign Up / Log In Required</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Create an account or log in to pay ₹{unlockAmount} INR and unlock {profile.username}&apos;s verified WhatsApp contact.
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
                /* Instant Automated Razorpay Checkout */
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleRazorpayCheckout}
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#6C3BFF] to-[#E94B99] hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Opening Razorpay Gateway...</span>
                      </div>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Proceed to Pay ₹{unlockAmount} INR via Razorpay</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                    🔒 Payments are securely processed through Razorpay. Frndma does not store your card number, CVV, OTP, or UPI PIN.
                  </p>
                </div>
              )}

              {/* Compliance & Policy Links (Essential for Razorpay website verification) */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
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

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>Support: </span>
                  <a href="mailto:frndma.com@gmail.com" className="text-[#6C3BFF] font-semibold hover:underline">
                    frndma.com@gmail.com
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
