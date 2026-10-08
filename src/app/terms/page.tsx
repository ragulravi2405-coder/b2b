import React from 'react';
import { PolicyNavbar } from '@/components/PolicyNavbar';
import { Footer } from '@/components/Footer';
import { ShieldCheck, FileCheck, AlertTriangle, Scale, Lock, Mail, CreditCard } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions | B2B',
  description: 'Terms and Conditions of service for B2B digital companion discovery and contact unlock platform.'
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <PolicyNavbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 mb-8">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-[#6C3BFF]">
              Terms of Service
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Effective Date: October 2026 • Platform: B2B
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              Please read these Terms and Conditions carefully before creating an account, browsing profiles, or making digital unlock purchases on the <strong>B2B</strong> digital networking and companion discovery platform.
            </p>
          </div>

          {/* Terms Content */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {/* 1. Acceptance of Terms */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
              <p>
                By registering, accessing, browsing, or utilizing any service provided on B2B, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to all terms herein, you must immediately discontinue using the website and its services.
              </p>
            </section>

            {/* 2. Mandatory Eligibility (Strictly 18+) */}
            <section className="space-y-2 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
              <h2 className="text-base font-bold flex items-center gap-2 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>2. Mandatory Age Requirement (Strictly 18+)</span>
              </h2>
              <p className="text-xs text-amber-900 leading-relaxed">
                You affirm and warrant that you are at least <strong>18 years of age</strong> and have the legal capacity to enter into a legally binding agreement under the Indian Contract Act, 1872. Access by individuals below 18 years is strictly prohibited. Providing fraudulent age information during registration is a violation of these Terms and Indian law, resulting in immediate account termination.
              </p>
            </section>

            {/* 3. Account Registration & User Responsibilities */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">3. Account Registration &amp; Security</h2>
              <p>
                To utilize certain features, including saving likes, initiating matches, or purchasing contact unlocks, you must register an account. You agree to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide accurate, truthful, and authentic information during signup.</li>
                <li>Maintain the absolute confidentiality of your account credentials.</li>
                <li>Promptly notify customer support at <a href="mailto:B2B.com@gmail.com" className="text-[#6C3BFF] underline">B2B.com@gmail.com</a> if you suspect any unauthorized access to your account.</li>
                <li>Accept sole responsibility for all actions and payments occurring under your account.</li>
              </ul>
            </section>

            {/* 4. Profile Information & Verification */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">4. Profile Information &amp; Content Authenticity</h2>
              <p>
                B2B enables members to upload photos, bios, and personal interests. You agree that all content you post is your own, accurate, and does not impersonate another person, violate intellectual property rights, or depict anyone without their express written consent. B2B reserves the right to review, edit, or remove profiles that violate community standards.
              </p>
            </section>

            {/* 5. Acceptable Use & Prohibited Activities */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">5. Acceptable Use &amp; Prohibited Activities</h2>
              <p>You agree NOT to engage in any of the following activities on or through B2B:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Harass, threaten, stalk, abuse, extort, or intimidate any user, companion, or model.</li>
                <li>Post, transmit, or request non-consensual sexual material, child sexual abuse material (CSAM), or any unlawful content.</li>
                <li>Capture, redistribute, screenshot, publish, or sell unlocked WhatsApp contact details or private media without authorization.</li>
                <li>Use automated scripts, bots, spiders, or scrapers to crawl, collect data, or spam members.</li>
                <li>Solicit any illegal, non-consensual, commercial, or prohibited activities.</li>
                <li>Attempt to reverse-engineer, decompile, or compromise the platform’s security or code.</li>
              </ul>
            </section>

            {/* 6. Account Suspension & Termination */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">6. Account Suspension &amp; Termination</h2>
              <p>
                B2B reserves the right to immediately suspend or permanently terminate any user account without prior notice if we determine, in our sole discretion, that the user has violated these Terms, engaged in fraudulent activities, harassed other users, or breached applicable Indian laws.
              </p>
            </section>

            {/* 7. Nature of Digital Services, Payments & Pricing */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">7. Description of Services &amp; Transparent Pricing</h2>
              <p>
                B2B provides a curated online discovery service connecting adult Indian individuals with verified companions. Our paid offerings consist of digital contact unlocks:
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-slate-900 font-bold">
                  <span>Individual Contact Unlock:</span>
                  <span className="text-sm font-black text-[#6C3BFF]">₹299 INR (one-time fee)</span>
                </div>
                <p className="text-xs text-slate-600">
                  Unlocks verified direct WhatsApp access for an individual companion.
                </p>
                <div className="flex items-center justify-between text-slate-900 font-bold pt-2 border-t border-slate-200/60">
                  <span>VIP Pass Bundle:</span>
                  <span className="text-sm font-black text-[#6C3BFF]">₹1,499 INR (one-time bundle)</span>
                </div>
                <p className="text-xs text-slate-600">
                  Provides 10 contact unlocks (₹149.90/contact) and a VIP Gold Badge on your profile.
                </p>
              </div>
              <p className="text-xs text-slate-500">
                All prices are stated in Indian Rupees (INR) and are inclusive of applicable taxes. Delivery occurs digitally and instantaneously upon captured payment. Interpersonal chats occurring on WhatsApp after contact unlock are private and external to B2B.
              </p>
            </section>

            {/* 8. Third-Party Payment Gateway (Razorpay) */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">8. Payment Gateway via Razorpay</h2>
              <p>
                All financial payments on B2B are handled securely through <strong>Razorpay Software Private Limited</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Payment methods accepted include UPI (Google Pay, PhonePe, Paytm, BHIM), Debit &amp; Credit Cards (Visa, Mastercard, RuPay), and Net Banking.</li>
                <li>B2B does not store or process your banking passwords, card numbers, CVVs, or UPI PINs.</li>
                <li>You agree to use only genuine, authorized payment instruments. Any fraudulent chargeback or unauthorized transaction will be reported to appropriate cyber crime enforcement agencies.</li>
              </ul>
            </section>

            {/* 9. Refunds & Cancellations Reference */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">9. Refunds &amp; Cancellations</h2>
              <p>
                Our refund and cancellation policies are governed by our dedicated{' '}
                <Link href="/refund" className="text-[#6C3BFF] font-semibold underline">
                  Refund &amp; Cancellation Policy
                </Link>
                . In summary, cancellations prior to completing payment on the gateway window are allowed without charge. Because digital unlocks are fulfilled immediately upon captured payment, refunds are limited to technical failures, duplicate charges, or invalid contact records as detailed in the policy.
              </p>
            </section>

            {/* 10. Intellectual Property */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">10. Intellectual Property Rights</h2>
              <p>
                All software, user interface design, logos, brand elements, layout, graphics, text, and proprietary code of B2B are protected under Indian copyright, trademark, and intellectual property laws. Unauthorized reproduction, copying, distribution, or commercial exploitation is strictly prohibited.
              </p>
            </section>

            {/* 11. Service Availability & Limitation of Liability */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">11. Service Availability &amp; Limitation of Liability</h2>
              <p>
                B2B strives to maintain 24/7 service uptime; however, we do not warrant that platform operations will be completely uninterrupted or error-free.
              </p>
              <p>
                To the maximum extent permitted by applicable Indian law, B2B, its operators, directors, and affiliates shall not be liable for any indirect, incidental, punitive, or consequential damages, loss of data, personal disputes between users, or third-party telecommunications outages arising from your use of the platform.
              </p>
            </section>

            {/* 12. Governing Law & Dispute Resolution */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">12. Governing Law &amp; Jurisdiction</h2>
              <p>
                These Terms and Conditions shall be governed by, interpreted, and construed in accordance with the laws of the Republic of India. Any legal dispute, controversy, or claim arising out of or relating to these terms shall be subject to the exclusive jurisdiction of the competent courts in India.
              </p>
            </section>

            {/* 13. Customer Support & Contact */}
            <section className="space-y-2 border-t border-slate-100 pt-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">13. Customer Support &amp; Grievances</h2>
              <p>
                For customer support, billing inquiries, or legal notices regarding these Terms, contact our support team at:
              </p>
              <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-1 border border-slate-100">
                <p><strong>Primary Support Email:</strong> <a href="mailto:B2B.com@gmail.com" className="text-[#6C3BFF] font-semibold underline">B2B.com@gmail.com</a></p>
                <p><strong>Support Helpline:</strong> +91 90879 23641 (Mon – Sat, 9:00 AM – 8:00 PM IST)</p>
                <p><strong>Operating Address:</strong> [Operating Address: Insert Physical Business Address, City, State, PIN - India]</p>
              </div>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
