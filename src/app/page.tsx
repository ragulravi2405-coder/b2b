'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { HeroSection } from '@/components/HeroSection';
import { SafetyBanner } from '@/components/SafetyBanner';
import { FilterBar } from '@/components/FilterBar';
import { ProfileCard } from '@/components/ProfileCard';
import { ProfileDetailsModal } from '@/components/ProfileDetailsModal';
import { ContactUnlockModal } from '@/components/ContactUnlockModal';
import { MatchModal } from '@/components/MatchModal';
import { IdentityEducationModal } from '@/components/IdentityEducationModal';
import { ReportModal } from '@/components/ReportModal';
import { AuthModal } from '@/components/AuthModal';
import { LikesView } from '@/components/LikesView';
import { MatchesView } from '@/components/MatchesView';
import { UserProfileView } from '@/components/UserProfileView';
import { PricingModal } from '@/components/PricingModal';
import { Footer } from '@/components/Footer';
import { UserProfile, MatchRecord, AuthUser } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, X, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<'discover' | 'matches' | 'likes' | 'profile'>('discover');
  const [showHero, setShowHero] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionCredits, setSubscriptionCredits] = useState<number>(0);

  // User State & Onboarding
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [showFreshOnboarding, setShowFreshOnboarding] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  // Discover & Profiles State
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [orientationFilter, setOrientationFilter] = useState('All');
  const [maxDistanceFilter, setMaxDistanceFilter] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLikes, setUserLikes] = useState<string[]>([]);
  const [userMatches, setUserMatches] = useState<MatchRecord[]>([]);

  // Modals & Active Profiles
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [unlockTargetProfile, setUnlockTargetProfile] = useState<UserProfile | null>(null);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [unlockedContacts, setUnlockedContacts] = useState<Record<string, string>>({}); // profileId -> whatsappUrl

  // Matching Modal State
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  // Helper Modals
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);
  const [reportTargetProfile, setReportTargetProfile] = useState<UserProfile | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch Discover Profiles & Likes
  const loadProfiles = async () => {
    try {
      const params = new URLSearchParams();
      if (orientationFilter !== 'All') params.set('orientation', orientationFilter);
      if (maxDistanceFilter) params.set('maxDistance', maxDistanceFilter.toString());
      if (searchQuery.trim()) params.set('query', searchQuery.trim());
      params.set('userId', currentUser?.id || 'guest');

      const res = await fetch(`/api/users/discover?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProfiles(data.profiles || []);
        if (data.userLikes) setUserLikes(data.userLikes);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Matches
  const loadMatches = async () => {
    if (!currentUser) {
      setUserMatches([]);
      return;
    }
    try {
      const res = await fetch(`/api/matches?userId=${currentUser.id}`);
      const data = await res.json();
      if (data.success) {
        setUserMatches(data.matches || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch user's verified unlocked contacts from server
  const loadUnlockedContacts = async (userId: string) => {
    try {
      const res = await fetch(`/api/payments/unlocked?userId=${userId}`);
      const data = await res.json();
      if (data.success && data.unlocked) {
        setUnlockedContacts(data.unlocked);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Restore authenticated session from backend cookie or stored token
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('b2b_auth_token') : null;
        const res = await fetch('/api/auth/me', {
          headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {}
        });
        const data = await res.json();
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          const isFresh =
            (typeof window !== 'undefined' && localStorage.getItem('b2b_fresh_' + data.user.id) === 'new') ||
            searchParams?.get('welcome') === 'true';
          if (isFresh) {
            setShowFreshOnboarding(true);
            showToast(`Welcome, ${data.user.username} 👋 Let's get your workspace ready.`);
          }
        }
      } catch (err) {
        console.error('Session restore error:', err);
      }
    };
    restoreSession();
  }, [searchParams]);

  useEffect(() => {
    loadProfiles();
    loadMatches();
    if (currentUser) {
      loadUnlockedContacts(currentUser.id);
    } else {
      setUnlockedContacts({});
    }
  }, [orientationFilter, maxDistanceFilter, searchQuery, currentUser]);

  // Robust Logout function
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('b2b_auth_token');
      localStorage.removeItem('b2b_user');
    }
    setCurrentUser(null);
    setUserLikes([]);
    setUserMatches([]);
    setUnlockedContacts({});
    showToast('Logged out successfully.');
    window.location.replace('/login');
  };

  // Protected Tab Selection
  const handleSelectTab = (tab: 'discover' | 'matches' | 'likes' | 'profile') => {
    if (tab !== 'discover' && !currentUser) {
      setAuthMode('login');
      setIsAuthOpen(true);
      showToast('Please sign in or create an account to view ' + tab + '! 🔒');
      return;
    }
    setCurrentTab(tab);
    if (tab !== 'discover') {
      setShowHero(false);
    } else {
      const el = document.getElementById('discover-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Like Toggle
  const handleLikeToggle = async (profileId: string) => {
    if (!currentUser) {
      setAuthMode('signup');
      setIsAuthOpen(true);
      showToast('Please sign up or sign in to like profiles! 💜');
      return;
    }
    try {
      const res = await fetch(`/api/users/${profileId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });
      const data = await res.json();

      if (data.success) {
        if (data.liked) {
          setUserLikes((prev) => [...prev, profileId]);
          showToast('Added to your Likes! 💜');

          // Trigger mutual match
          if (data.isMatch && data.profile) {
            setMatchedProfile(data.profile);
            setIsMatchModalOpen(true);
            loadMatches();
          }
        } else {
          setUserLikes((prev) => prev.filter((id) => id !== profileId));
          showToast('Removed from Likes');
          loadMatches();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Block User
  const handleBlockUser = async (profileId: string) => {
    try {
      await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle-block', profileId, blocked: true })
      });
      showToast('User blocked and removed from your feed.');
      loadProfiles();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Contact Unlocked
  const handleContactUnlocked = (profileId: string, whatsappUrl: string) => {
    setUnlockedContacts((prev) => ({ ...prev, [profileId]: whatsappUrl }));
    showToast('Contact Unlocked! WhatsApp button is now active. 🟢');
  };

  // Liked profiles list
  const likedProfilesList = profiles.filter((p) => userLikes.includes(p.id));

  // WhatsApp direct open helper — opens WA ONLY if specifically unlocked
  const openWhatsApp = (profile: UserProfile) => {
    if (!currentUser) {
      setAuthMode('signup');
      setIsAuthOpen(true);
      showToast('Please create an account or sign in to connect on WhatsApp! 🔒');
      return;
    }
    const url = unlockedContacts[profile.id];
    if (url) {
      window.open(url, '_blank');
    } else {
      setUnlockTargetProfile(profile);
      setIsUnlockModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FF] text-[#17152A] selection:bg-purple-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-slate-900/90 backdrop-blur-md text-white text-xs sm:text-sm font-semibold shadow-2xl border border-slate-700/60 animate-in fade-in slide-in-from-top-4 duration-200 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Safety Notice Banner */}
      <SafetyBanner />

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        showHero={showHero}
        onSelectTab={handleSelectTab}
        onGoHome={() => {
          setCurrentTab('discover');
          setShowHero(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        matchesCount={userMatches.length}
        likesCount={userLikes.length}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthMode(mode || 'signup');
          setIsAuthOpen(true);
        }}
        onLogout={handleLogout}
        onOpenPricing={() => setIsPricingModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* FRESH ONBOARDING WELCOME CARD */}
        {showFreshOnboarding && currentUser && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#201658] via-[#2F1C6A] to-[#17152A] text-white p-6 sm:p-8 shadow-xl border border-purple-500/20">
              <button
                onClick={() => {
                  setShowFreshOnboarding(false);
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('b2b_fresh_' + currentUser.id);
                  }
                }}
                className="absolute top-4 right-4 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Dismiss banner"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                  Fresh Account Workspace
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Welcome, {currentUser.username} 👋
              </h2>
              <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl leading-relaxed">
                Let&apos;s get your workspace ready. Your account is completely private, personalized, and isolated with zero clutter.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                  <div className="w-7 h-7 rounded-xl bg-purple-500/40 flex items-center justify-center font-bold text-xs mb-2 text-purple-200">
                    1
                  </div>
                  <h4 className="font-bold text-sm">Discover Companions</h4>
                  <p className="text-xs text-purple-200/80 mt-1">
                    Explore 16 verified South Indian models &amp; companions nearby.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                  <div className="w-7 h-7 rounded-xl bg-purple-500/40 flex items-center justify-center font-bold text-xs mb-2 text-purple-200">
                    2
                  </div>
                  <h4 className="font-bold text-sm">Mutual Matches</h4>
                  <p className="text-xs text-purple-200/80 mt-1">
                    Like profiles to match and unlock direct conversation.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                  <div className="w-7 h-7 rounded-xl bg-purple-500/40 flex items-center justify-center font-bold text-xs mb-2 text-purple-200">
                    3
                  </div>
                  <h4 className="font-bold text-sm">Instant WhatsApp</h4>
                  <p className="text-xs text-purple-200/80 mt-1">
                    Pay flat ₹499 to immediately reveal verified WhatsApp chat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DISCOVER TAB */}
        {currentTab === 'discover' && (
          <div>
            {/* Hero Section */}
            {showHero && (
              <HeroSection
                onExplore={() => {
                  const discoverEl = document.getElementById('discover-section');
                  discoverEl?.scrollIntoView({ behavior: 'smooth' });
                }}
                onSignUp={() => {
                  setAuthMode('signup');
                  setIsAuthOpen(true);
                }}
              />
            )}

            {/* Discover Header & Profiles Grid */}
            <div id="discover-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Real People. Real Connections.
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Discover verified male models &amp; companions nearby. Distance is approximate to protect privacy.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#00C496] text-xs font-bold border border-emerald-100">
                    <span className="w-2 h-2 rounded-full bg-[#00C496] animate-pulse" />
                    100% Men Only • 18+
                  </span>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <FilterBar
                orientation={orientationFilter}
                onSelectOrientation={setOrientationFilter}
                maxDistance={maxDistanceFilter}
                onSelectMaxDistance={setMaxDistanceFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onOpenIdentityModal={() => setIsIdentityModalOpen(true)}
                totalCount={profiles.length}
              />

              {/* Profile Cards Grid */}
              {profiles.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 shadow-xs">
                  <p className="text-sm font-bold text-slate-700">No profiles found matching your filters</p>
                  <p className="text-xs text-slate-500 mt-1 mb-4">Try clearing distance or interest filters</p>
                  <button
                    onClick={() => {
                      setOrientationFilter('All');
                      setMaxDistanceFilter(undefined);
                      setSearchQuery('');
                    }}
                    className="px-5 py-2 rounded-xl bg-[#6C3BFF] text-white text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {profiles.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      isLiked={userLikes.includes(profile.id)}
                      onLikeToggle={handleLikeToggle}
                      onViewDetails={(p) => {
                        setSelectedProfile(p);
                        setIsDetailsOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MATCHES TAB */}
        {currentTab === 'matches' && (
          <MatchesView
            matches={userMatches}
            onStartChat={(p) => openWhatsApp(p)}
            onViewDetails={(p) => {
              setSelectedProfile(p);
              setIsDetailsOpen(true);
            }}
            onExplore={() => setCurrentTab('discover')}
          />
        )}

        {/* LIKES TAB */}
        {currentTab === 'likes' && (
          <LikesView
            likedProfiles={likedProfilesList}
            onViewDetails={(p) => {
              setSelectedProfile(p);
              setIsDetailsOpen(true);
            }}
            onOpenMessage={(p) => openWhatsApp(p)}
            onExplore={() => setCurrentTab('discover')}
          />
        )}

        {/* USER PROFILE TAB */}
        {currentTab === 'profile' && (
          <UserProfileView
            user={currentUser}
            onOpenIdentityModal={() => setIsIdentityModalOpen(true)}
            onLogout={handleLogout}
            onOpenPricing={() => setIsPricingModalOpen(true)}
            onOpenAuth={() => {
              setAuthMode('signup');
              setIsAuthOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenIdentityModal={() => setIsIdentityModalOpen(true)} />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        showHero={showHero}
        onSelectTab={handleSelectTab}
        onGoHome={() => {
          setCurrentTab('discover');
          setShowHero(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        matchesCount={userMatches.length}
        likesCount={userLikes.length}
      />

      {/* MODALS */}

      {/* Profile Details Modal */}
      <ProfileDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        profile={selectedProfile}
        isLiked={selectedProfile ? userLikes.includes(selectedProfile.id) : false}
        isContactUnlocked={selectedProfile ? !!unlockedContacts[selectedProfile.id] : false}
        unlockedWhatsappUrl={selectedProfile ? unlockedContacts[selectedProfile.id] : undefined}
        onLikeToggle={handleLikeToggle}
        onOpenMessage={(p) => {
          setIsDetailsOpen(false);
          openWhatsApp(p);
        }}
        onOpenUnlockPayment={(p) => {
          if (!currentUser) {
            setAuthMode('signup');
            setIsAuthOpen(true);
            showToast('Please Sign Up or Log In first to unlock WhatsApp contacts! 🔒');
            return;
          }
          setUnlockTargetProfile(p);
          setIsUnlockModalOpen(true);
        }}
        onOpenReport={(p) => {
          setReportTargetProfile(p);
          setIsReportModalOpen(true);
        }}
        onOpenIdentityEducation={() => setIsIdentityModalOpen(true)}
        onBlockUser={handleBlockUser}
      />

      {/* Contact Unlock Razorpay Modal */}
      <ContactUnlockModal
        key={unlockTargetProfile?.id || 'empty-modal'}
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        profile={unlockTargetProfile}
        currentUser={currentUser}
        onOpenAuth={() => {
          setIsUnlockModalOpen(false);
          setAuthMode('signup');
          setIsAuthOpen(true);
        }}
        onUnlockedSuccess={handleContactUnlocked}
        isAlreadyUnlocked={unlockTargetProfile ? !!unlockedContacts[unlockTargetProfile.id] : false}
        unlockedWhatsappUrl={unlockTargetProfile ? unlockedContacts[unlockTargetProfile.id] : undefined}
      />

      {/* Mutual Match Modal */}
      <MatchModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        matchedProfile={matchedProfile}
        currentUserAvatar={currentUser?.avatar || ''}
        onStartChat={(p) => {
          setIsMatchModalOpen(false);
          openWhatsApp(p);
        }}
      />

      {/* Educational Identity Modal */}
      <IdentityEducationModal
        isOpen={isIdentityModalOpen}
        onClose={() => setIsIdentityModalOpen(false)}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        profile={reportTargetProfile}
        onReportSubmitted={() => {
          showToast('Thank you for reporting. Moderation team notified.');
        }}
      />

      {/* Auth Modal (Login / Signup) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome, ${user.username}!`);
        }}
      />

      {/* Pricing / Contact Unlock Modal */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        onExplore={() => {
          setCurrentTab('discover');
          setShowHero(false);
        }}
        onSubscribe={({ paymentId }) => {
          setIsSubscribed(true);
          setSubscriptionCredits((prev) => prev + 10);
          showToast(`🎉 ₹1,499 Subscription Activated (${paymentId})! 10 contact unlocks added.`);
        }}
      />
    </div>
  );
}
