import React from 'react';
import { PolicyNavbar } from '@/components/PolicyNavbar';
import { Footer } from '@/components/Footer';
import { RefreshCcw, CheckCircle2, AlertCircle, Clock, ShieldCheck, Mail, HelpCircle, FileText } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Refund & Cancellation Policy | Frndma',
  description: 'Cancellation and Refund Policy for digital contact unlocks on Frndma. Learn about eligibility, processing timelines, and support at frndma.com@gmail.com.'
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <PolicyNavbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 mb-8">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-[#00C496]">
              Customer Protection &amp; Billing
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Refund &amp; Cancellation Policy
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Effective Date: October 2026 • Platform: Frndma
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              At <strong>Frndma</strong>, we are committed to providing a transparent, fair, and prompt experience for our members. This policy explains the conditions under which cancellations are permitted, how refund requests are evaluated, and the expected processing timelines for our digital contact unlock services.
            </p>
          </div>

          {/* Refund Content */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {/* 1. Digital Nature of Service & Delivery */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">1. Nature of Digital Service &amp; Delivery</h2>
              <p>
                Frndma provides <strong>instant digital access services</strong> (namely, unlocking verified WhatsApp contact details and VIP bundles). Delivery occurs digitally and immediately upon confirmation of payment from our payment gateway partner, Razorpay.
              </p>
              <p>
                Because access is delivered immediately and electronically upon payment capture, the service is deemed &quot;consumed&quot; once the verified contact details are decrypted and displayed to the user.
              </p>
            </section>

            {/* 2. Cancellation Policy */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">2. Cancellation Policy</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Before Payment Completion:</strong> You may cancel or close the checkout window at any time before authorizing the transaction in your bank or UPI application. No amount will be debited, and no charges will apply.
                </li>
                <li>
                  <strong>After Payment Completion:</strong> Because digital contact information is immediately decrypted and made available upon captured payment, voluntary order cancellation after successful delivery cannot be processed except in circumstances outlined under Refund Eligibility below.
                </li>
              </ul>
            </section>

            {/* 3. Refund Eligibility */}
            <section className="space-y-3 p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <h2 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00C496]" />
                <span>3. Situations Eligible for a Full Refund</span>
              </h2>
              <p className="text-xs text-slate-700">
                You are entitled to a full 100% refund in any of the following verified technical scenarios:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-slate-700">
                <li>
                  <strong>Payment Deducted but Service Not Activated (Technical Failure):</strong> Money was debited from your bank account or UPI app via Razorpay, but our platform experienced a network interruption, and the contact was not unlocked or displayed.
                </li>
                <li>
                  <strong>Duplicate Payment / Accidental Double Charge:</strong> You were billed more than once for the same contact unlock due to a network glitch or multiple simultaneous authorization requests.
                </li>
                <li>
                  <strong>Inactive / Invalid Contact Details:</strong> The unlocked WhatsApp number for the companion profile was inactive, non-functional, or invalid at the time of purchase and could not be reached after verification by our support team.
                </li>
              </ul>
            </section>

            {/* 4. Non-Refundable Situations */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">4. Cases Where Refunds Are Not Applicable</h2>
              <p>Refunds will NOT be granted under the following circumstances:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Change of Mind:</strong> Deciding not to message or contact the companion after the verified WhatsApp number has been successfully decrypted and provided.
                </li>
                <li>
                  <strong>Interpersonal Disagreements or Incompatibility:</strong> Lack of romantic interest, conversational chemistry, delayed replies from the companion, or subjective disagreements during private interpersonal conversations on WhatsApp.
                </li>
                <li>
                  <strong>Terms of Service Violations:</strong> Accounts suspended or terminated due to abusive behavior, harassment, fraud, or violation of Community Guidelines.
                </li>
                <li>
                  <strong>Third-Party WhatsApp Outages:</strong> Temporary service interruptions or server downtime on WhatsApp or Meta platforms beyond Frndma&apos;s control.
                </li>
              </ul>
            </section>

            {/* 5. Failed Payments & Bank Settlements */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">5. Failed Payment Handling</h2>
              <p>
                If an amount is debited from your bank account or UPI app, but Razorpay marks the transaction as <em>Failed</em> or <em>Pending</em>, the banking system will automatically reverse the transaction. Typically, your issuing bank releases the held funds back to your source account within <strong>3 to 5 business days</strong> without requiring a manual ticket on our end. If the funds do not reflect within that period, contact us with your bank UTR number.
              </p>
            </section>

            {/* 6. How to Request a Refund */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">6. How Users Can Request a Refund</h2>
              <p>
                To initiate a refund request, submit an email to our support team within <strong>7 calendar days</strong> from the transaction date:
              </p>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2.5 text-xs text-slate-700">
                <p>
                  <strong>Primary Refund / Payment Support Email:</strong>{' '}
                  <a href="mailto:frndma.com@gmail.com" className="text-[#6C3BFF] font-bold underline">
                    frndma.com@gmail.com
                  </a>
                </p>
                <p><strong>Subject Line:</strong> Refund Request - [Your Registered Email / Username]</p>
                <p className="font-semibold text-slate-800">Required Information to Include:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Your registered username and email address on Frndma</li>
                  <li>Profile ID or name of the companion unlocked</li>
                  <li>Razorpay Payment ID (starts with <code>pay_...</code>) or Bank UPI UTR Number</li>
                  <li>Date and exact amount debited (e.g. ₹299 INR)</li>
                  <li>Clear description of the issue encountered (with screenshot if applicable)</li>
                </ul>
              </div>
            </section>

            {/* 7. Review Process & Processing Timeline */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">7. How Requests Are Reviewed &amp; Processing Timelines</h2>
              <p>
                <strong>Investigation &amp; Verification:</strong> Our support team will review the transaction logs with Razorpay within <strong>24 to 48 business hours</strong> of receiving your request.
              </p>
              <p>
                <strong>Credit Timeline:</strong> Once approved, refunds are initiated immediately through the Razorpay payment gateway back to the <strong>original source of payment</strong> (UPI ID, bank account, debit card, or credit card). The refunded amount will typically credit to your bank account within <strong>5 to 7 business days</strong>, depending on your issuing bank&apos;s standard clearing cycle.
              </p>
            </section>

            {/* 8. Contact for Payment Disputes */}
            <section className="space-y-2 border-t border-slate-100 pt-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">8. Payment Disputes &amp; Support Assistance</h2>
              <p>
                For immediate assistance with any payment discrepancy or billing concern, please connect with our support desk:
              </p>
              <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-1 border border-slate-100">
                <p><strong>Support Email:</strong> <a href="mailto:frndma.com@gmail.com" className="text-[#6C3BFF] font-semibold underline">frndma.com@gmail.com</a></p>
                <p><strong>Helpline:</strong> +91 90879 23641 (Mon – Sat, 9:00 AM – 8:00 PM IST)</p>
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
