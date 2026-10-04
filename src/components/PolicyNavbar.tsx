import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { ArrowLeft, ShieldCheck, Mail, Phone, Lock } from 'lucide-react';

export const PolicyNavbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="h-1 pride-accent-bar" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo size="md" showTagline={false} />
        </Link>

        {/* Quick Policy Nav Links */}
        <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold text-slate-600">
          <Link href="/about" className="hover:text-[#6C3BFF] transition-colors">
            About Us
          </Link>
          <Link href="/pricing" className="hover:text-[#6C3BFF] transition-colors">
            Pricing
          </Link>
          <Link href="/contact" className="hover:text-[#6C3BFF] transition-colors">
            Contact Us
          </Link>
          <Link href="/privacy" className="hover:text-[#6C3BFF] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-[#6C3BFF] transition-colors">
            Terms
          </Link>
          <Link href="/refund" className="hover:text-[#6C3BFF] transition-colors">
            Refunds
          </Link>
          <Link href="/delivery-policy" className="hover:text-[#6C3BFF] transition-colors">
            Delivery Policy
          </Link>
          <Link href="/guidelines" className="hover:text-[#6C3BFF] transition-colors">
            Guidelines
          </Link>
        </nav>

        {/* Back to Home Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6C3BFF] to-[#E94B99] hover:opacity-95 shadow-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Feed</span>
        </Link>
      </div>
    </header>
  );
};
