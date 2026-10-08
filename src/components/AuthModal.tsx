import React, { useState } from 'react';
import { X, Lock, ShieldCheck, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { AuthUser } from '@/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'signup'
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [username, setUsername] = useState('');

  React.useEffect(() => {
    setMode(initialMode);
    setError(null);
  }, [initialMode, isOpen]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('24');
  const [orientation, setOrientation] = useState<'Gay' | 'Bisexual'>('Gay');
  const [email, setEmail] = useState('');
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!isAdultConfirmed) {
          throw new Error('You must confirm that you are 18 years or older to join B2B.');
        }

        const ageNum = parseInt(age, 10);
        if (isNaN(ageNum) || ageNum < 18) {
          throw new Error('Platform is strictly for adults (18+). Underage registration is prohibited.');
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            password,
            confirmPassword,
            age: ageNum,
            orientation,
            email,
            isAdultConfirmed
          })
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        if (data.token) {
          localStorage.setItem('b2b_auth_token', data.token);
        }
        if (data.user) {
          localStorage.setItem('b2b_user', JSON.stringify(data.user));
          localStorage.setItem('b2b_fresh_' + data.user.id, 'new');
        }

        onAuthSuccess(data.user);
        onClose();
      } else {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            password
          })
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        if (data.token) {
          localStorage.setItem('b2b_auth_token', data.token);
        }
        if (data.user) {
          localStorage.setItem('b2b_user', JSON.stringify(data.user));
        }

        onAuthSuccess(data.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden">
        {/* Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 pride-accent-bar" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 pt-2">
          <Logo size="md" className="justify-center mb-3" />
          <h3 className="text-xl font-black text-slate-900">
            {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'signup'
              ? 'Join a private, respectful community of gay & bisexual men'
              : 'Sign in to continue connecting with real men'}
          </p>
        </div>



        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. rahul_vibe"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6C3BFF] focus:ring-2 focus:ring-purple-100"
            />
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Age (18+ only)
                </label>
                <input
                  type="number"
                  min="18"
                  max="99"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6C3BFF] focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Optional, for recovery only"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6C3BFF] focus:ring-2 focus:ring-purple-100"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6C3BFF] focus:ring-2 focus:ring-purple-100"
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6C3BFF] focus:ring-2 focus:ring-purple-100"
              />
            </div>
          )}

          {/* Strict Age Confirmation Checkbox */}
          {mode === 'signup' && (
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAdultConfirmed}
                  onChange={(e) => setIsAdultConfirmed(e.target.checked)}
                  required
                  className="mt-0.5 rounded text-[#6C3BFF] focus:ring-purple-500 w-4 h-4"
                />
                <span className="text-[11px] text-slate-700 leading-tight">
                  <strong className="text-slate-900 font-semibold">I confirm that I am 18 years or older.</strong> I understand this platform is exclusively for adult Indian men.
                </span>
              </label>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#6C3BFF] hover:bg-[#5828E8] text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                'Processing...'
              ) : mode === 'signup' ? (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>

        {/* Switch Mode Toggle */}
        <div className="mt-5 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          {mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="font-bold text-[#6C3BFF] hover:underline"
              >
                Login
              </button>
            </p>
          ) : (
            <p>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className="font-bold text-[#6C3BFF] hover:underline"
              >
                Create Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
