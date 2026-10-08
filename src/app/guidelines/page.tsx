import React from 'react';
import { PolicyNavbar } from '@/components/PolicyNavbar';
import { Footer } from '@/components/Footer';
import { ShieldCheck, Heart, AlertTriangle, UserCheck, Lock, CheckCircle2, MessageCircle, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Community & User Guidelines | B2B',
  description: 'Community and user safety guidelines for B2B. Learn about respectful communication, 18+ eligibility, and zero tolerance for harassment.'
};

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <PolicyNavbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 mb-8">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-[#6C3BFF]">
              Safety &amp; Ethics
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Community &amp; User Guidelines
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Effective Date: October 2026 • Platform: B2B
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              B2B is dedicated to cultivating a safe, affirming, respectful, and private space for consenting adult Indian individuals. All members must adhere to these guidelines to ensure mutual dignity and trust.
            </p>
          </div>

          {/* Guidelines Body */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {/* 1. Strict 18+ Adult Policy */}
            <section className="space-y-3 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>1. Strictly 18+ Consenting Adults</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                B2B is strictly for adults aged 18 and older. Minors are barred from registration or interaction. Any account created by or depicting a minor is permanently banned immediately, and relevant technical data is reported to cyber law enforcement agencies.
              </p>
            </section>

            {/* 2. Mutual Respect & Consent */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">2. Mutual Respect &amp; Enthusiastic Consent</h2>
              <p>
                Every interaction must be grounded in mutual respect and clear consent. Unlocking a companion&apos;s verified WhatsApp number grants you the privilege of direct communication; it does not constitute an entitlement to personal favors or immediate replies.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Respect boundaries: If a companion expresses disinterest, politely disengage immediately.</li>
                <li>No means no: Continued messaging after being asked to stop constitutes harassment.</li>
                <li>Treat all members with courtesy, empathy, and dignity.</li>
              </ul>
            </section>

            {/* 3. Zero Tolerance for Harassment & Extortion */}
            <section className="space-y-3 p-5 rounded-2xl bg-red-50/60 border border-red-100 text-red-950">
              <div className="flex items-center gap-2 font-bold text-sm text-red-900">
                <ShieldCheck className="w-5 h-5 text-red-600" />
                <span>3. Zero Tolerance for Abuse, Harassment &amp; Blackmail</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                We enforce a zero-tolerance policy against:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
                <li>Threats, stalking, hate speech, body-shaming, or cyber-bullying.</li>
                <li>Blackmail, extortion, or threats to expose, dox, or out individuals to family, employers, or the public.</li>
                <li>Distribution or publication of private screenshots, WhatsApp chats, or photographs without written consent.</li>
              </ul>
              <p className="text-xs text-slate-600 mt-1">
                Violators face immediate account termination and legal escalation under the Indian Penal Code and Information Technology Act.
              </p>
            </section>

            {/* 4. Profile Authenticity & Photo Standards */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">4. Profile Authenticity &amp; Media Standards</h2>
              <p>
                To maintain high community standards, members must ensure:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Profile photos must be authentic, recent, and genuinely depict yourself.</li>
                <li>No stock photos, celebrity photos, or images copied from third-party social media without authorization.</li>
                <li>No sexually explicit, obscene, or non-consensual media in public profile photos.</li>
                <li>Accurate age, city location, and orientation details.</li>
              </ul>
            </section>

            {/* 5. Financial Safety & Scams */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">5. Financial Safety &amp; Anti-Scam Practices</h2>
              <p>
                All legitimate platform unlock fees on B2B are handled exclusively through our official Razorpay checkout (₹299 INR / ₹1,499 INR).
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Never send direct money transfers, cash deposits, gift cards, or cryptocurrency to strangers on messaging apps.</li>
                <li>B2B staff will never contact you demanding additional fees, card details, or UPI transfers outside the official platform.</li>
                <li>Report any user who solicits commercial financial schemes or advance fee scams.</li>
              </ul>
            </section>

            {/* 6. Reporting & Grievance Mechanism */}
            <section className="space-y-3 border-t border-slate-100 pt-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">6. Reporting Violations &amp; Support Assistance</h2>
              <p>
                If you encounter any behavior violating these guidelines, report it immediately:
              </p>
              <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-2 border border-slate-100">
                <p>
                  <strong>In-App Reporting:</strong> Click the &quot;Report Profile&quot; button located on any companion&apos;s profile card.
                </p>
                <p>
                  <strong>Direct Grievance Email:</strong> Write to{' '}
                  <a href="mailto:B2B.com@gmail.com" className="text-[#6C3BFF] font-semibold underline">
                    B2B.com@gmail.com
                  </a>{' '}
                  with screenshots and profile details.
                </p>
                <p>
                  Our moderation team investigates all complaints within 24 to 48 hours.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
