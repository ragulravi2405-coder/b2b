import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { ShieldCheck, Heart, Lock, Mail, Phone, MapPin, Clock, FileText } from 'lucide-react';

interface FooterProps {
  onOpenIdentityModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenIdentityModal }) => {
  return (
    <footer className="bg-white border-t border-slate-200/80 mt-16 pb-24 md:pb-8">
      {/* Pride Accent Line */}
      <div className="h-1 pride-accent-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 items-start">
          {/* Column 1: Brand Info & Trust (col-span-4) */}
          <div className="md:col-span-4 space-y-3.5">
            <Logo size="md" showTagline={true} />
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              B2B is a private, modern social connection and companion discovery platform for consenting adult Indian individuals seeking verified profiles.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#00C496]" />
              <span>Real Connections. Transparent Services.</span>
            </div>

            {/* Payment & Security Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs">
              <div className="flex items-center gap-1.5 text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#6C3BFF]" />
                <span>Payments securely processed through Razorpay</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
                <Lock className="w-3.5 h-3.5 text-[#00C496]" />
                <span>HTTPS 256-Bit SSL Encrypted</span>
              </div>
            </div>
          </div>

          {/* Column 2: Legal & Compliance Policies (col-span-3) */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#6C3BFF]" />
              Legal &amp; Policies
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/" className="hover:text-[#6C3BFF] font-medium transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#6C3BFF] font-medium transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#6C3BFF] font-medium transition-colors">
                  Pricing &amp; Plans
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#6C3BFF] font-medium transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#6C3BFF] font-medium transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-[#6C3BFF] font-medium transition-colors">
                  Refund &amp; Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/delivery-policy" className="hover:text-[#6C3BFF] font-medium transition-colors">
                  Digital Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="hover:text-[#6C3BFF] font-medium transition-colors">
                  User Guidelines &amp; Safety
                </Link>
              </li>
              {onOpenIdentityModal && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenIdentityModal}
                    className="hover:text-[#6C3BFF] transition-colors text-left"
                  >
                    Identity Guidelines
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Customer Support & Contact (col-span-3) */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#6C3BFF]" />
              Customer Support
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div>
                <Link href="/contact" className="text-xs font-semibold text-[#6C3BFF] hover:underline block">
                  Dedicated Contact Us Page &rarr;
                </Link>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1">
                <span className="text-[11px] font-bold text-slate-700 block">Primary Support Email:</span>
                <a
                  href="mailto:frndma.com@gmail.com"
                  className="text-xs font-bold text-[#6C3BFF] hover:underline break-all block"
                >
                  frndma.com@gmail.com
                </a>
                <span className="text-[10px] text-slate-500 block">Support for payments, accounts, refunds &amp; cancellations</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Support Availability / Hours:
                </span>
                <span className="font-semibold text-slate-800">Mon – Sat: 9:00 AM – 8:00 PM IST</span>
                <span className="text-[10px] text-slate-400 block">Sunday: Email support for urgent escalations</span>
              </div>

              <div className="pt-1">
                <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  Support Desk:
                </span>
                <a href="mailto:B2B.com@gmail.com" className="font-semibold text-slate-800 hover:text-[#6C3BFF] underline">
                  B2B.com@gmail.com
                </a>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  Operating &amp; Registered Entity:
                </span>
                <p className="text-[11px] text-slate-500 leading-snug">
                  B2B / <span className="text-slate-700 font-medium">[Registered Entity: B2B Social Connect]</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  [Operating Address: Chennai / Tamil Nadu, India]
                </p>
              </div>
            </div>
          </div>

          {/* Column 4: 18+ Disclaimer & Trust (col-span-2) */}
          <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
              <Lock className="w-3.5 h-3.5 text-[#6C3BFF]" />
              <span>18+ Adults Only</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Strictly for consenting adults aged 18+. Private contact numbers are protected behind authenticated payments.
            </p>
            <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Payment Security Notice:</p>
              <p>B2B never collects or stores your card numbers, CVV, OTP, or UPI PIN on our servers.</p>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© 2026 B2B. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Crafted with pride &amp; respect for genuine human connection</span>
            <Heart className="w-3 h-3 text-[#FF6B9D] fill-[#FF6B9D]" />
          </div>
        </div>
      </div>
    </footer>
  );
};
