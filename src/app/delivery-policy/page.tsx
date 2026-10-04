import React from 'react';
import { PolicyNavbar } from '@/components/PolicyNavbar';
import { Footer } from '@/components/Footer';
import { Zap, CheckCircle2, ShieldCheck, Mail, Clock, Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Digital Delivery & Fulfillment Policy | Frndma',
  description: 'Digital service fulfillment and delivery policy for Frndma. Learn how instant online access works for contact unlocks.'
};

export default function DeliveryPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <PolicyNavbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 mb-8">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
              Service Fulfillment
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Digital Delivery &amp; Fulfillment Policy
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Effective Date: October 2026 • Platform: Frndma
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              This policy explains how services and digital unlocks are fulfilled and delivered to users on the <strong>Frndma</strong> online digital platform.
            </p>
          </div>

          {/* Body */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {/* 1. Online Digital Nature */}
            <section className="space-y-3 p-5 rounded-2xl bg-blue-50/60 border border-blue-100 text-blue-950">
              <div className="flex items-center gap-2 font-bold text-sm text-blue-900">
                <Zap className="w-5 h-5 text-blue-600" />
                <span>1. 100% Digital Online Services — No Physical Goods Shipped</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Frndma operates exclusively as an online digital matchmaking and companion discovery service platform. <strong>We do NOT sell, pack, or ship physical goods.</strong> Accordingly, there are no physical postal deliveries, courier dispatches, or shipping charges applicable to transactions on Frndma.
              </p>
            </section>

            {/* 2. Instant Digital Delivery */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">2. How Digital Delivery Works</h2>
              <p>
                When you make a payment on Frndma (whether for an individual contact unlock at ₹299 INR or a VIP pass at ₹1,499 INR):
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Instant Delivery Timeline:</strong> Digital fulfillment is <strong>instantaneous</strong>. Immediately upon authorization and capture of your payment by Razorpay (typically within 1 to 5 seconds), our database decrypts the companion&apos;s verified WhatsApp contact number and displays a clickable WhatsApp chat button on your screen.
                </li>
                <li>
                  <strong>Account Status Update:</strong> If purchasing a VIP Pass, your profile is instantly granted the VIP Gold Badge and 10 contact unlock credits without requiring any manual intervention.
                </li>
                <li>
                  <strong>Electronic Receipt:</strong> An electronic confirmation showing the Razorpay payment ID, timestamp, and transaction summary is made available immediately in your session and sent to your registered email upon request.
                </li>
              </ul>
            </section>

            {/* 3. Delivery Confirmation & Retention */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">3. Ongoing Access to Unlocked Contacts</h2>
              <p>
                Once an individual contact is unlocked, the verified WhatsApp chat link remains permanently associated with your logged-in Frndma account. You can revisit the companion&apos;s profile at any time in the future without paying again.
              </p>
            </section>

            {/* 4. Troubleshooting Digital Non-Delivery */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">4. What to Do in Case of Delayed Fulfillment</h2>
              <p>
                In rare instances, an intermittent network disconnection between your bank, Razorpay, and our servers may delay the automatic unlock trigger. If your payment was deducted but the contact does not unlock within 2 minutes:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>Refresh your browser page while remaining logged into your Frndma account.</li>
                <li>Check whether your bank transaction shows a confirmed debit with a valid Razorpay Payment ID (<code>pay_...</code>).</li>
                <li>If the contact remains locked, email our support team immediately at <a href="mailto:frndma.com@gmail.com" className="text-[#6C3BFF] font-semibold underline">frndma.com@gmail.com</a> with your Payment ID.</li>
              </ol>
              <p className="text-xs text-slate-500 pt-1">
                Our support team will manually verify the payment in our Razorpay merchant dashboard and activate your digital access or initiate an immediate full refund in accordance with our <Link href="/refund" className="text-[#6C3BFF] underline">Refund Policy</Link>.
              </p>
            </section>

            {/* 5. Contact Information */}
            <section className="space-y-2 border-t border-slate-100 pt-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">5. Fulfillment Support Contact</h2>
              <p>For any questions regarding service fulfillment or order status, contact:</p>
              <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-1 border border-slate-100">
                <p><strong>Support Email:</strong> <a href="mailto:frndma.com@gmail.com" className="text-[#6C3BFF] font-semibold underline">frndma.com@gmail.com</a></p>
                <p><strong>Support Helpline:</strong> +91 90879 23641 (Mon – Sat, 9:00 AM – 8:00 PM IST)</p>
                <p><strong>Platform:</strong> Frndma</p>
              </div>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
