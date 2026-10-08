'use client';

import React, { useState } from 'react';
import { PolicyNavbar } from '@/components/PolicyNavbar';
import { Footer } from '@/components/Footer';
import {
  CheckCircle2,
  ShieldCheck,
  Crown,
  CreditCard,
  Lock,
  ArrowRight,
  HelpCircle,
  Sparkles,
  AlertCircle,
  FileText,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { loadRazorpayScript } from '@/lib/razorpay';
import confetti from 'canvas-confetti';

export default function PricingPage() {
  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState<string | null>(null);
  const [subSuccess, setSubSuccess] = useState(false);

  const handleVIPPayment = async () => {
    window.open('https://razorpay.me/@ravirahul601', '_blank', 'noopener,noreferrer');
  };

  const handleConfirmVIP = () => {
    window.location.href = '/?tab=discover';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <PolicyNavbar />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          {/* Header Card */}
          <div className="text-center mb-10">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-[#6C3BFF]">
              Transparent Pricing &amp; Service Plans
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Simple, Transparent Pricing. Zero Hidden Fees.
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
              Every profile on B2B is curated. Browse profiles freely and pay strictly when you choose to unlock direct verified WhatsApp contact details.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Plan 1: Individual Contact Unlock */}
            <div className="bg-white rounded-3xl p-8 border-2 border-slate-200/80 shadow-xs flex flex-col justify-between relative">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-[#6C3BFF]">
                    Individual Contact Unlock
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    One-Time Purchase
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-4xl font-black text-slate-900">₹499</span>
                  <span className="text-xs text-slate-500 font-semibold">INR (All Taxes Included)</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Best for connecting with specific individuals. Single one-time payment for direct, permanent access to that companion&apos;s verified WhatsApp number.
                </p>

                <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                    <span>Instant access to verified WhatsApp contact number</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                    <span>Direct WhatsApp chat button with pre-filled greeting</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                    <span>One-time payment — lifetime retained access on your account</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                    <span>18% GST and all applicable charges included in ₹499</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                    <span>Eligible for refund in case of technical failure</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 space-y-3">
                <Link
                  href="/"
                  className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <span>Select Companion &amp; Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <Link href="/refund" className="hover:text-[#6C3BFF] underline">
                    Refund Policy
                  </Link>
                  <span>Processed via Razorpay</span>
                  <Link href="/terms" className="hover:text-[#6C3BFF] underline">
                    Terms &amp; Conditions
                  </Link>
                </div>
              </div>
            </div>

            {/* Plan 2: VIP Pass Bundle */}
            <div className="bg-white rounded-3xl p-8 border-2 border-[#6C3BFF] shadow-lg shadow-purple-100/50 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-100 to-pink-100 text-[#6C3BFF]">
                    VIP Pass Bundle
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    10 Unlocks Included
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-4xl font-black text-slate-900">₹1,499</span>
                  <span className="text-xs text-slate-500 font-semibold">INR (All Taxes Included)</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Ideal for members seeking multiple verified connections across major Indian cities with priority support and an exclusive VIP profile badge.
                </p>

                <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                    <span><strong>10 Contact Unlocks</strong> (₹149.90 per contact unlock)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                    <span>Exclusive VIP Gold Crown Badge displayed on your profile</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                    <span>Priority customer support queue for quick resolutions</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                    <span>All applicable taxes and processing charges included</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                    <span>One-time charge — no automatic recurring renewals</span>
                  </div>
                </div>
              </div>

              {subError && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{subError}</span>
                </div>
              )}

              {subSuccess ? (
                <div className="mt-6 p-4 bg-emerald-50 text-emerald-800 text-center font-bold text-xs sm:text-sm rounded-2xl border border-emerald-200">
                  ₹1,499 Payment Verified! Your VIP Pass has been activated 🎉
                </div>
              ) : (
                <div className="mt-8 pt-4 border-t border-slate-100 space-y-2.5">
                  <button
                    type="button"
                    onClick={handleConfirmVIP}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#6C3BFF] to-[#E94B99] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-200 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Choose VIP Pass — ₹1,499 / Month</span>
                  </button>
                  <p className="text-[11px] text-slate-400 text-center">
                    Enjoy up to 10 contact unlocks and priority matching.
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <Link href="/refund" className="hover:text-[#6C3BFF] underline">
                      Refund Policy
                    </Link>
                    <span>Instant Digital Fulfillment</span>
                    <Link href="/terms" className="hover:text-[#6C3BFF] underline">
                      Terms &amp; Conditions
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Trust & Transparency Section */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs mb-10">
            <div className="text-center max-w-lg mx-auto mb-8">
              <h2 className="text-xl font-bold text-slate-900">Trust &amp; Transparency Guarantee</h2>
              <p className="text-xs text-slate-500 mt-1">
                We believe in straightforward pricing and bank-grade payment security.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Trust Box 1 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6C3BFF] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Secure Payments</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Payments are securely processed through Razorpay. We never store your card numbers, CVV, OTP, or UPI PIN.
                </p>
              </div>

              {/* Trust Box 2 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00C496] flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Transparent Pricing</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Clear, upfront INR pricing with zero hidden charges, zero surprises, and no unauthorized recurring debits.
                </p>
              </div>

              {/* Trust Box 3 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Customer Support</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Dedicated customer support desk reachable at <a href="mailto:B2B.com@gmail.com" className="text-[#6C3BFF] font-semibold underline">B2B.com@gmail.com</a> for billing or technical help.
                </p>
              </div>

              {/* Trust Box 4 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#FF6B9D] flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Privacy Protected</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Direct contact details are shielded behind encrypted security and unlocked only upon verified payment.
                </p>
              </div>
            </div>
          </div>

          {/* Product Specifications & Compliance Details */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Service Specifications &amp; Billing Terms</h2>
              <p>
                B2B is an online digital discovery platform connecting adult Indian individuals with verified companions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800 text-xs block">Delivery Method</span>
                <span className="text-xs text-slate-600">Instant digital access delivered immediately upon payment capture via Razorpay.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800 text-xs block">Currency &amp; Taxes</span>
                <span className="text-xs text-slate-600">All prices are quoted in Indian Rupees (INR) and inclusive of all applicable taxes.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800 text-xs block">Accepted Payment Methods</span>
                <span className="text-xs text-slate-600">UPI (Google Pay, PhonePe, Paytm, BHIM), Debit &amp; Credit Cards (Visa, Mastercard, RuPay), Net Banking.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-800 text-xs block">Customer Support &amp; Disputes</span>
                <span className="text-xs text-slate-600">Email: <a href="mailto:B2B.com@gmail.com" className="text-[#6C3BFF] underline">B2B.com@gmail.com</a> | Active Mon – Sat (9 AM – 8 PM IST)</span>
              </div>
            </div>

            {/* HTTPS Security Seal */}
            <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#00C496] flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">HTTPS &amp; 256-Bit SSL Encryption Active</h4>
                  <p className="text-[11px] text-slate-500">Every connection, checkout session, and API payload is end-to-end encrypted.</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200">
                HTTPS Verified 🔒
              </span>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
