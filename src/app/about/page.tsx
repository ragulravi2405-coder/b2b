import React from 'react';
import { PolicyNavbar } from '@/components/PolicyNavbar';
import { Footer } from '@/components/Footer';
import {
  ShieldCheck,
  Heart,
  Users,
  Sparkles,
  CheckCircle2,
  Lock,
  Mail,
  HelpCircle,
  CreditCard,
  Eye,
  FileCheck,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | B2B',
  description: 'Learn about B2B, our platform mission, verified companion discovery, transparent on-demand payments, and user safety standards.'
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <PolicyNavbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-100/50 rounded-full blur-3xl -z-0 pointer-events-none" />
            <div className="relative z-10">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-[#6C3BFF]">
                About B2B
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
                Authentic Companionship. Verified Connections.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed max-w-2xl">
                B2B is a private digital discovery and connection platform created for consenting adult Indian individuals seeking verified social companions, photoshoot partners, and genuine friendships in a safe, transparent environment.
              </p>
            </div>
          </div>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6C3BFF] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Verified Member Profiles</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Profiles undergo identity and media validation procedures to mitigate impersonation and promote genuine human interaction.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00C496] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Privacy-First Architecture</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Private contact numbers are protected behind authenticated access. Direct phone numbers are never published openly on search feeds.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#FF6B9D] flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Respect &amp; Inclusivity</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                A respectful, welcoming space crafted exclusively for consenting adult individuals aged 18 years and above.
              </p>
            </div>
          </div>

          {/* Detailed Content Sections */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-8 text-slate-700">
            {/* 1. What B2B Is & Mission */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">What is B2B?</h2>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                B2B was built to address the persistent challenges of modern social networking apps: rampant impersonation, bot profiles, unsolicited spam, and compromised privacy. B2B replaces uncontrolled public broadcasts with an intentional discovery model where members review curated, authenticated profiles and unlock verified direct WhatsApp channels when there is mutual interest.
              </p>
            </section>

            {/* 2. Who B2B Is For */}
            <section className="space-y-3 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900">Who is B2B For?</h2>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                B2B is strictly intended for <strong>consenting adults aged 18 years and older</strong> located in India. It serves individuals looking for:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-600 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                  <span>Verified social companionship &amp; friendship</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                  <span>Lifestyle, travel, and fitness partners</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                  <span>Professional model &amp; photoshoot networking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00C496] flex-shrink-0" />
                  <span>Discreet, consensual social connections</span>
                </li>
              </ul>
              <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200 mt-2">
                <strong>Strict 18+ Requirement:</strong> Minors under 18 years of age are strictly prohibited from creating accounts, accessing profiles, or making transactions on B2B.
              </p>
            </section>

            {/* 3. How to Use the Platform */}
            <section className="space-y-4 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900">How Does B2B Work?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <span className="w-6 h-6 rounded-full bg-[#6C3BFF] text-white text-xs font-bold flex items-center justify-center">1</span>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Create an Account</h4>
                  <p className="text-xs text-slate-500">Sign up with a unique username, verify your age (18+), and configure your basic profile preferences.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <span className="w-6 h-6 rounded-full bg-[#6C3BFF] text-white text-xs font-bold flex items-center justify-center">2</span>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Browse Verified Profiles</h4>
                  <p className="text-xs text-slate-500">Explore authentic photo portfolios, bios, interests, and city locations across major Indian cities.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <span className="w-6 h-6 rounded-full bg-[#6C3BFF] text-white text-xs font-bold flex items-center justify-center">3</span>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Unlock Direct WhatsApp</h4>
                  <p className="text-xs text-slate-500">Choose an individual profile (₹499 INR) or activate a VIP bundle (₹1,499 INR) through our secure Razorpay gateway.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <span className="w-6 h-6 rounded-full bg-[#6C3BFF] text-white text-xs font-bold flex items-center justify-center">4</span>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Chat Safely &amp; Directly</h4>
                  <p className="text-xs text-slate-500">Instantly receive a pre-filled direct WhatsApp link to begin consensual, private interpersonal dialogue.</p>
                </div>
              </div>
            </section>

            {/* 4. How Payments Work */}
            <section className="space-y-3 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900">How Payments Work</h2>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                B2B operates with complete financial transparency. We do not use hidden recurring subscriptions or unexpected auto-debits.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li><strong>Clear INR Pricing:</strong> Individual contact unlocks are priced at <strong>₹499 INR</strong> one-time, and VIP passes at <strong>₹1,499 INR</strong>. All prices include applicable taxes.</li>
                <li><strong>Razorpay Gateway Integration:</strong> All transactions are processed through Razorpay Software Private Limited, supporting UPI (Google Pay, PhonePe, Paytm, BHIM), Debit/Credit Cards (Visa, Mastercard, RuPay), and Net Banking.</li>
                <li><strong>Zero Credential Storage:</strong> B2B does NOT collect or store your card numbers, CVV, OTP, or UPI PIN on our servers. All sensitive credentials are handled by Razorpay&apos;s encrypted checkout flow.</li>
                <li><strong>Digital Delivery:</strong> Contact access is unlocked digitally and immediately upon payment confirmation.</li>
              </ul>
            </section>

            {/* 5. Commitment to Safety, Privacy & Transparent Pricing */}
            <section className="space-y-3 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900">Safety, Privacy &amp; Integrity</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                  <h4 className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#6C3BFF]" />
                    Zero Tolerance for Abuse
                  </h4>
                  <p className="text-xs text-slate-600">
                    Harassment, extortion, non-consensual media sharing, or solicitation of prohibited acts results in permanent account banning and cooperation with law enforcement.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                  <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-[#00C496]" />
                    End-to-End HTTPS Encryption
                  </h4>
                  <p className="text-xs text-slate-600">
                    All website traffic is encrypted using 256-bit TLS/SSL protocols. Data stored in our database is securely shielded.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Entity & Support Details */}
            <section className="border-t border-slate-100 pt-6 bg-slate-50 p-6 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-purple-900">
                Operating Entity &amp; Customer Support
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800 block">Platform Brand:</span>
                  <span>B2B</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block">Registered Entity Name:</span>
                  <span className="text-slate-700">[Registered Entity: Legal Entity / Proprietorship Name]</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block">Official Support Email:</span>
                  <a href="mailto:B2B.com@gmail.com" className="text-[#6C3BFF] font-semibold hover:underline">
                    B2B.com@gmail.com
                  </a>
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block">Operating Hours:</span>
                  <span>Monday to Saturday: 9:00 AM – 8:00 PM IST</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block">Operating Physical Address:</span>
                  <span className="text-slate-500">[Operating Address: Insert Physical Business Address, City, State, PIN - India]</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block">Payment Partner:</span>
                  <span>Razorpay Software Private Limited</span>
                </div>
              </div>
            </section>

            {/* Action Link */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#6C3BFF] to-[#E94B99] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-purple-200 transition-all"
              >
                <span>View Transparent Pricing &amp; Plans</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all"
              >
                <Mail className="w-4 h-4 text-[#6C3BFF]" />
                <span>Contact Customer Support</span>
              </Link>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
