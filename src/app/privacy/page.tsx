import React from 'react';
import { PolicyNavbar } from '@/components/PolicyNavbar';
import { Footer } from '@/components/Footer';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, Mail, AlertCircle, Database, Server } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Frndma',
  description: 'Privacy Policy for Frndma platform. Learn how we handle data protection, payment security via Razorpay, and user confidentiality.'
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <PolicyNavbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 mb-8">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-[#6C3BFF]">
              Legal &amp; Compliance
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Effective Date: October 2026 • Platform: Frndma
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              At <strong>Frndma</strong>, accessible from our official website, the privacy, confidentiality, and data protection of our users are of paramount importance. This Privacy Policy details the types of personal data we collect, why and how it is processed, and our strict administrative, technical, and cryptographic safeguards.
            </p>
          </div>

          {/* Policy Body */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {/* 1. Consent & Eligibility */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">1. Consent &amp; Eligibility (Strictly 18+)</h2>
              <p>
                By accessing, browsing, registering an account, or purchasing digital unlocks on Frndma, you signify your agreement to this Privacy Policy.
              </p>
              <p>
                Frndma is strictly intended for <strong>consenting adults aged 18 years or older</strong>. We do not knowingly collect, request, or maintain personal records from minors under 18 years of age. If we determine that an account belongs to a minor, all associated records are permanently deleted immediately.
              </p>
            </section>

            {/* 2. Personal Information We Collect */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">2. Personal Information Collected</h2>
              <p>We collect only the minimum necessary personal data required to deliver our companion discovery and digital connection service:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Account &amp; Profile Information:</strong> Username, password hash, age, orientation, city/location, bio, personal interests, and uploaded profile photos provided voluntarily during registration.
                </li>
                <li>
                  <strong>Contact Information:</strong> Registered email address and mobile phone number (where applicable) used for account verification, authentication notices, and customer support.
                </li>
                <li>
                  <strong>Technical &amp; Log Information:</strong> IP address, device type, browser user-agent, operating system, and access timestamps collected automatically for fraud detection, unauthorized bot prevention, and network security.
                </li>
                <li>
                  <strong>Cookies &amp; Local Storage:</strong> Essential session cookies and local storage tokens strictly used to preserve your logged-in authentication state, active session, and user interface preferences across page reloads.
                </li>
                <li>
                  <strong>Payment-Related Identifiers:</strong> Razorpay order ID, payment transaction ID (<code>pay_...</code>), payment status, and timestamp when unlocking contacts or VIP passes.
                </li>
              </ul>
            </section>

            {/* 3. Important Payment Credentials Disclosure */}
            <section className="space-y-3 p-5 rounded-2xl bg-purple-50/70 border border-purple-200 text-purple-950">
              <div className="flex items-center gap-2 font-bold text-sm text-[#6C3BFF]">
                <ShieldCheck className="w-5 h-5 text-[#6C3BFF]" />
                <span>3. Zero Storage of Sensitive Payment Credentials</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Frndma does NOT collect, capture, process, or store credit card numbers, debit card numbers, CVVs, net banking passwords, OTPs, or UPI PINs on its own servers.</strong>
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">
                All financial payments on Frndma are handled exclusively through our certified third-party payment gateway partner, <strong>Razorpay Software Private Limited</strong>. Payment credentials entered during checkout are submitted directly to Razorpay through their secure, encrypted PCI-DSS Level 1 compliant gateway. Frndma only receives cryptographic confirmation tokens verifying whether your transaction was authorized or captured.
              </p>
            </section>

            {/* 4. Protection of WhatsApp Contact Details */}
            <section className="space-y-3 p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                <Lock className="w-4 h-4 text-[#00C496]" />
                <span>4. Confidentiality of WhatsApp Phone Numbers</span>
              </div>
              <p className="text-xs text-slate-700">
                To prevent unsolicited harassment, commercial scraping, and privacy invasion, the direct WhatsApp contact numbers of featured models and companions are protected behind encrypted database safeguards. Contact numbers are never exposed publicly on profiles or search feeds. A contact number is only decrypted and provided to a user after a verified, authenticated payment (₹299 INR or VIP pass) is confirmed via Razorpay.
              </p>
            </section>

            {/* 5. How We Use Your Information */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">5. How Information is Used</h2>
              <p>Your personal information is processed strictly for legitimate operational purposes:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Account Management &amp; Security:</strong> Authenticating login sessions, maintaining profile preferences, and preventing unauthorized account takeover.</li>
                <li><strong>Payment Processing &amp; Verification:</strong> Validating transactions with Razorpay, fulfilling digital contact unlocks, and issuing electronic receipts.</li>
                <li><strong>Customer Support &amp; Dispute Resolution:</strong> Responding to user inquiries, resolving billing questions, and processing refund requests.</li>
                <li><strong>Fraud Prevention &amp; Abuse Mitigation:</strong> Identifying bot attacks, fake profiles, harassment, extortion, or non-consensual behavior.</li>
                <li><strong>Service Improvement:</strong> Monitoring platform performance, resolving technical errors, and optimizing page loading times.</li>
              </ul>
            </section>

            {/* 6. Data Retention */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">6. Data Retention Policy</h2>
              <p>
                We retain personal information for as long as your account remains active or as required to fulfill the purposes outlined in this policy. Transaction reference records (Razorpay order ID, payment ID, amount, and timestamp) are retained for a minimum statutory period to comply with Indian accounting, tax, and anti-fraud regulations. If you request account deletion, non-transactional profile data will be permanently removed within 30 days.
              </p>
            </section>

            {/* 7. Data Sharing & Third-Party Processors */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">7. Data Sharing with Third-Party Service Providers</h2>
              <p>
                Frndma <strong>never sells, rents, trades, or commercializes</strong> your personal data to advertising brokers or marketing firms.
              </p>
              <p>We share minimal essential data only with trusted infrastructure providers subject to strict confidentiality obligations:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Payment Gateway:</strong> Razorpay Software Private Limited (for processing payments and verifying order transactions).</li>
                <li><strong>Database &amp; Hosting:</strong> Encrypted cloud database infrastructure (MongoDB Atlas) and web deployment networks (Vercel).</li>
                <li><strong>Law Enforcement &amp; Regulatory Authorities:</strong> Only when legally compelled by valid court orders, subpoenas, or statutory requirements under applicable Indian laws.</li>
              </ul>
            </section>

            {/* 8. Technical & Data Security */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">8. Data Security Measures</h2>
              <p>
                We implement industry-standard organizational and technical safeguards:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>256-Bit SSL/TLS Encryption:</strong> All data transmitted between your browser and our servers is secured over HTTPS.</li>
                <li><strong>Password Hashing:</strong> Passwords are cryptographically salted and hashed before storage.</li>
                <li><strong>Access Controls:</strong> Administrative access to production databases is restricted to authorized personnel with multi-factor authentication.</li>
              </ul>
            </section>

            {/* 9. User Rights */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">9. Your Data Rights</h2>
              <p>Under applicable Indian data protection principles, you possess the right to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access the personal information held about you.</li>
                <li>Correct, update, or modify inaccurate profile records.</li>
                <li>Request permanent deletion of your account and personal records.</li>
                <li>Withdraw consent for optional data processing.</li>
              </ul>
              <p className="pt-1">
                To exercise any of these rights, email our privacy desk at{' '}
                <a href="mailto:frndma.com@gmail.com" className="text-[#6C3BFF] font-semibold hover:underline">
                  frndma.com@gmail.com
                </a>.
              </p>
            </section>

            {/* 10. Grievance Redressal & Contact */}
            <section className="space-y-3 border-t border-slate-100 pt-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">10. Grievance Officer &amp; Contact Details</h2>
              <p>
                In compliance with the Information Technology Act, 2000 and rules made thereunder, questions or grievances regarding your privacy may be directed to our designated Grievance Officer:
              </p>
              <div className="bg-slate-50 p-5 rounded-2xl text-xs text-slate-700 space-y-2 border border-slate-100">
                <p><strong>Designation:</strong> Data Privacy &amp; Grievance Officer</p>
                <p><strong>Platform:</strong> Frndma</p>
                <p><strong>Registered Entity:</strong> [Registered Entity: Legal Entity / Proprietorship Name]</p>
                <p><strong>Operating Address:</strong> [Operating Address: Insert Physical Business Address, City, State, PIN - India]</p>
                <p><strong>Primary Support Email:</strong> <a href="mailto:frndma.com@gmail.com" className="text-[#6C3BFF] font-semibold underline">frndma.com@gmail.com</a></p>
                <p><strong>Helpline:</strong> +91 90879 23641 (Mon – Sat, 9:00 AM – 8:00 PM IST)</p>
              </div>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
