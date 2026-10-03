import React from 'react';
import { ShieldCheck, CheckCircle2, HeartHandshake, Lock, ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  onSignUp: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onSignUp }) => {
  return (
    <section className="relative overflow-hidden w-full" style={{ minHeight: '100vh' }}>
      {/* Full-screen background image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/b2b-hero-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Dark overlay on left for text — fades to clear on right to show the image fully */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(100deg, rgba(15,5,40,0.80) 0%, rgba(15,5,40,0.58) 30%, rgba(15,5,40,0.18) 58%, rgba(15,5,40,0.02) 100%)',
        }}
      />

      {/* Bottom fade to page background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-36"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(247,247,252,1))',
        }}
      />

      {/* Content layer — positioned lower-left to match image text area */}
      <div className="relative z-10 flex flex-col justify-center h-full" style={{ minHeight: '100vh' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-20 pt-20 w-full">
          <div className="max-w-lg">

            {/* Tagline badge */}
            <div className="flex mb-5">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white text-xs font-bold tracking-wider uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#E94B99]" />
                Connect • Chat • Belong
              </span>
            </div>

            {/* Main heading — white text for dark image area */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-left text-white mb-4 drop-shadow-lg">
              Real Men.{' '}
              <span className="bg-gradient-to-r from-[#A78BFA] via-[#F472B6] to-[#FB923C] bg-clip-text text-transparent">
                Real Connections.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-white/85 text-left leading-relaxed mb-8 max-w-md drop-shadow">
              A private, premium space to meet, chat, and connect with verified male models &amp; companions — with zero fake profiles.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-3.5 mb-10">
              <button
                id="hero-signup-btn"
                onClick={onSignUp}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#6C3BFF] hover:bg-[#5828E8] text-white font-bold text-sm sm:text-base shadow-xl shadow-purple-900/40 hover:shadow-purple-700/60 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                Create Account Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="hero-explore-btn"
                onClick={onExplore}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/15 backdrop-blur-md hover:bg-white/25 text-white font-bold text-sm sm:text-base border border-white/40 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                Explore Profiles
              </button>
            </div>

            {/* Trust badges — frosted glass style */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-white font-semibold">
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/25 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Safe &amp; Private</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/25 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span>Verified Profiles</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/25 shadow-xs">
                <HeartHandshake className="w-3.5 h-3.5 text-[#F472B6]" />
                <span>Inclusive Community</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/25 shadow-xs">
                <Lock className="w-3.5 h-3.5 text-white/70" />
                <span>Adults Only (18+)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
