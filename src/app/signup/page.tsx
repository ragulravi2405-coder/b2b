'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User, Mail, ShieldCheck, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [age, setAge] = useState('24');
  const [orientation, setOrientation] = useState<'Gay' | 'Bisexual' | 'Male Model'>('Gay');
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to workspace
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('b2b_auth_token') : null;
        const res = await fetch('/api/auth/me', {
          headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {}
        });
        const data = await res.json();
        if (data.authenticated && data.user) {
          router.replace('/');
          return;
        }
      } catch (e) {
        // Not logged in
      } finally {
        setCheckingAuth(false);
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || username.trim().length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 18) {
      setError('Platform is strictly for consenting adults (18+). Underage registration is prohibited.');
      return;
    }

    if (!isAdultConfirmed) {
      setError('You must confirm that you are 18 years or older to join B2B.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim() || undefined,
          password,
          confirmPassword,
          age: parsedAge,
          orientation,
          isAdultConfirmed
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create account.');
      }

      // Store auth session
      if (data.token) {
        localStorage.setItem('b2b_auth_token', data.token);
      }
      if (data.user) {
        localStorage.setItem('b2b_user', JSON.stringify(data.user));
        // Mark as fresh new user to trigger personalized onboarding welcome
        localStorage.setItem('b2b_fresh_' + data.user.id, 'new');
      }

      // Redirect to the fresh workspace
      router.replace('/?welcome=true');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FF]">
        <div className="w-8 h-8 border-3 border-[#6C3BFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FF] flex flex-col justify-between selection:bg-purple-200">
      {/* Header Accent Bar */}
      <div className="h-1.5 pride-accent-bar" />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-7 sm:p-9 shadow-xl border border-slate-100/80 animate-in fade-in duration-200">
          {/* Logo & Heading */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <Logo size="md" className="justify-center mb-3" />
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Create Your Account
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Join a private, respectful network for verified companionship.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-red-50 text-red-700 text-xs flex items-start gap-2.5 border border-red-200 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. rahul_vibe"
                  className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#6C3BFF] focus:ring-2 focus:ring-purple-100 transition-all"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address <span className="text-slate-400 font-normal">(Optional, for recovery)</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#6C3BFF] focus:ring-2 focus:ring-purple-100 transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Age & Orientation */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Age (18+) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="18"
                  max="80"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#6C3BFF] focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Orientation
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#6C3BFF] focus:ring-2 focus:ring-purple-100 transition-all"
                >
                  <option value="Gay">Gay</option>
                  <option value="Bisexual">Bisexual</option>
                  <option value="Male Model">Male Model</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#6C3BFF] focus:ring-2 focus:ring-purple-100 transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#6C3BFF] focus:ring-2 focus:ring-purple-100 transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* 18+ Confirmation */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
                <input
                  type="checkbox"
                  required
                  checked={isAdultConfirmed}
                  onChange={(e) => setIsAdultConfirmed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-[#6C3BFF] rounded border-slate-300 focus:ring-purple-400 accent-[#6C3BFF] flex-shrink-0"
                />
                <span className="leading-snug">
                  I solemnly declare that I am <strong>18 years of age or older</strong> and agree to B2B&apos;s{' '}
                  <Link href="/terms" target="_blank" className="text-[#6C3BFF] underline">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" target="_blank" className="text-[#6C3BFF] underline">
                    Privacy Policy
                  </Link>.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#6C3BFF] hover:bg-[#5828E8] active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-purple-200 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer mt-3"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Your Account...</span>
                </div>
              ) : (
                <>
                  <span>Create Account &amp; Enter Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="text-[#6C3BFF] font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          {/* Privacy Note */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Clean, fresh isolated account setup on signup</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="text-center py-4 text-xs text-slate-400">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">•</span>
        <Link href="/terms" className="hover:underline">Terms</Link>
        <span className="mx-2">•</span>
        <Link href="/privacy" className="hover:underline">Privacy</Link>
      </footer>
    </div>
  );
}
