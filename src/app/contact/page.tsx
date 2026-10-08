'use client';

import React, { useState } from 'react';
import { PolicyNavbar } from '@/components/PolicyNavbar';
import { Footer } from '@/components/Footer';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Lock,
  CreditCard,
  UserCheck,
  RefreshCcw
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Payment Support',
    subject: '',
    transactionId: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in your name, email address, and message.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    setSubmitting(true);

    // Simulate sending inquiry to support desk
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <PolicyNavbar />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl -z-0 pointer-events-none" />
            <div className="relative z-10">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-[#6C3BFF]">
                Customer Support &amp; Help Desk
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
                Contact B2B Support
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
                We are here to assist you with payment inquiries, account issues, profile verification, refunds, cancellations, and any service-related questions.
              </p>
            </div>
          </div>

          {/* Security Notice Banner */}
          <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">Security &amp; Privacy Notice: </span>
              B2B customer support will <strong>NEVER</strong> ask for your passwords, OTPs, credit/debit card numbers, CVV, or UPI PIN. Please do NOT submit sensitive financial passwords or PINs in your message.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Contact Cards & Info (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Primary Email Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#6C3BFF] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Support Email</h3>
                  <a
                    href="mailto:B2B.com@gmail.com"
                    className="text-base font-bold text-[#6C3BFF] hover:underline break-all mt-0.5 block"
                  >
                    B2B.com@gmail.com
                  </a>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Direct channel for payments, accounts, billing, refunds &amp; cancellations. Average turnaround: within 24 business hours.
                  </p>
                </div>
              </div>

              {/* Operating Hours Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Support Hours</h3>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">Monday to Saturday</p>
                  <p className="text-xs text-slate-600 font-medium">9:00 AM – 8:00 PM IST (Indian Standard Time)</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Sunday: Email support active for payment disputes &amp; emergency escalations.
                  </p>
                </div>
              </div>

              {/* Online Help Desk Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-teal-50 text-[#00C496] flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Online Help Desk</h3>
                  <a href="mailto:B2B.com@gmail.com" className="text-base font-bold text-slate-900 hover:text-[#6C3BFF] mt-0.5 block">
                    B2B.com@gmail.com
                  </a>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Send us your query or ticket. Fast response for unlock and billing queries.
                  </p>
                </div>
              </div>

              {/* Operating & Registered Address Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Operating &amp; Registered Entity</h3>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    B2B / <span className="font-semibold text-slate-700">[Registered Entity: Legal Entity / Proprietorship Name]</span>
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    [Operating Address: Insert Physical Business Address, City, State, PIN - India]
                  </p>
                </div>
              </div>

              {/* Support Categories Pill Box */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Support Categories Handled:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50">
                    <CreditCard className="w-3.5 h-3.5 text-[#6C3BFF]" />
                    <span>Payment Support</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50">
                    <RefreshCcw className="w-3.5 h-3.5 text-[#00C496]" />
                    <span>Refund &amp; Cancellation</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50">
                    <UserCheck className="w-3.5 h-3.5 text-[#E94B99]" />
                    <span>Account &amp; Login</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Profile Issues</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Technical Issues</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50">
                    <Mail className="w-3.5 h-3.5 text-slate-600" />
                    <span>General Queries</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form (lg:col-span-7) */}
            <div className="lg:col-span-7 bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Send Support a Message</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in the form below and our customer support team will investigate your request.
                </p>
              </div>

              {submitted ? (
                <div className="py-10 text-center space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#00C496] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Message Received!</h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to B2B Customer Support. A ticket has been created and our team will reply to <strong>{formData.email}</strong> within 24 business hours.
                  </p>
                  <p className="text-xs text-slate-400">
                    For urgent payment inquiries, you can also email us directly at{' '}
                    <a href="mailto:B2B.com@gmail.com" className="text-[#6C3BFF] font-semibold underline">
                      B2B.com@gmail.com
                    </a>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        category: 'Payment Support',
                        subject: '',
                        transactionId: '',
                        message: ''
                      });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-medium flex items-center gap-2 border border-red-200">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20 focus:border-[#6C3BFF] text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Registered Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20 focus:border-[#6C3BFF] text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Support Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20 focus:border-[#6C3BFF] text-slate-900 bg-white"
                      >
                        <option value="Payment Support">Payment Support</option>
                        <option value="Refund & Cancellation">Refund &amp; Cancellation</option>
                        <option value="Account & Login Support">Account &amp; Login Support</option>
                        <option value="Profile Issues">Profile Issues</option>
                        <option value="Technical Issues">Technical Issues</option>
                        <option value="General Queries">General Queries</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Razorpay Payment ID / Order ID (if applicable)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. pay_XXXXX or order_XXXXX"
                        value={formData.transactionId}
                        onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20 focus:border-[#6C3BFF] text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="Brief summary of your inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20 focus:border-[#6C3BFF] text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Message / Issue Details *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please describe your query in detail. For payment-related issues, please include your registered email/username and transaction details so our support team can investigate."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20 focus:border-[#6C3BFF] text-slate-900"
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    Note: For payment-related issues, please include your registered email/username and transaction details so our support team can investigate promptly.
                  </p>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#6C3BFF] to-[#E94B99] hover:opacity-95 text-white font-bold text-sm shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending Inquiry...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Support Request</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Direct Email Action Pill */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <span>Prefer writing via your email client?</span>
                <a
                  href="mailto:B2B.com@gmail.com?subject=B2B%20Customer%20Support%20Inquiry"
                  className="font-bold text-[#6C3BFF] hover:underline flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email B2B.com@gmail.com directly
                </a>
              </div>
            </div>
          </div>

          {/* Grievance Redressal Section */}
          <section className="mt-12 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-[#6C3BFF]" />
              <h2>Grievance Redressal Mechanism</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, B2B has appointed a designated Grievance Officer to redress user grievances regarding platform terms, unauthorized transactions, or community violations.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-700">
              <div>
                <span className="text-[11px] text-slate-400 block font-bold uppercase">Officer:</span>
                <span className="font-semibold text-slate-900">Grievance &amp; Compliance Officer</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-bold uppercase">Entity:</span>
                <span className="font-semibold text-slate-900">B2B Support Desk</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-bold uppercase">Email:</span>
                <a href="mailto:B2B.com@gmail.com" className="font-semibold text-[#6C3BFF] underline">
                  B2B.com@gmail.com
                </a>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-bold uppercase">Resolution Time:</span>
                <span className="font-semibold text-slate-900">Acknowledgment within 24h, resolution within 48-72h</span>
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
