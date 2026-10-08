'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, User, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    registered ? 'Account created successfully! Please log in to access your private workspace.' : null
  );

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
    setSuccessMessage(null);

    if (!username.trim()) {
      setError('Please enter your username or email.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
          rememberMe
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid username/email or password.');
      }

      // Store token and user locally
      if (data.token) {
        localStorage.setItem('b2b_auth_token', data.token);
      }
      if (data.user) {
        localStorage.setItem('b2b_user', JSON.stringify(data.user));
      }

      // Redirect to main workspace
      router.replace('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
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

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-7 sm:p-9 shadow-xl border border-slate-100/80 animate-in fade-in duration-200">
          {/* Logo & Heading */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <Logo size="md" className="justify-center mb-3" />
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Sign in to your private, isolated account &amp; companion workspace.
            </p>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs flex items-start gap-2.5 border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-red-50 text-red-700 text-xs flex items-start gap-2.5 border border-red-200 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username or Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your registered username or email"
                  className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#6C3BFF] focus:ring-2 focus:ring-purple-100 transition-all"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Please contact support at B2B.com@gmail.com with your registered email to reset your password.')}
                  className="text-[11px] text-[#6C3BFF] font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-xs sm:text-sm pl-10 pr-10 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#6C3BFF] focus:ring-2 focus:ring-purple-100 transition-all"
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

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#6C3BFF] rounded border-slate-300 focus:ring-purple-400 accent-[#6C3BFF]"
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#6C3BFF] hover:bg-[#5828E8] active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-purple-200 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Signup */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-[#6C3BFF] font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

          {/* Privacy Note */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>End-to-end encrypted session &amp; isolated workspace</span>
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
