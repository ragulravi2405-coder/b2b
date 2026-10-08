import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  ShieldAlert,
  Lock,
  Ban,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { AdminStats, UserProfile, UserReport, PaymentTransaction } from '@/types';

interface AdminDashboardProps {
  onClose?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<UserProfile[]>([]);
  const [recentPayments, setRecentPayments] = useState<PaymentTransaction[]>([]);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports' | 'transactions'>('overview');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/dashboard');
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
        setRecentUsers(data.stats.recentUsers || []);
        setRecentPayments(data.stats.recentPayments || []);
        setReports(data.stats.reports || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleBlock = async (profileId: string) => {
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle-block', profileId })
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Profile ${data.isBlocked ? 'blocked' : 'unblocked'} successfully`);
        fetchDashboardData();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) return;
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete-profile', profileId })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Profile deleted successfully');
        fetchDashboardData();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprovePayment = async (transactionId: string) => {
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve-payment', transactionId })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Payment approved and contact unlocked successfully! 🎉');
        fetchDashboardData();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectPayment = async (transactionId: string) => {
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject-payment', transactionId })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Payment rejected');
        fetchDashboardData();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetDemo = async () => {
    if (!confirm('Reset all demo profiles, test transactions, and likes to original state?')) return;
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset-demo' })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Demo database refreshed to original clean state');
        fetchDashboardData();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">
        <div className="w-8 h-8 border-3 border-[#6C3BFF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading Admin Metrics...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider mb-2">
            <Lock className="w-3 h-3 text-[#00C496]" />
            Internal Administrator
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Platform Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time analytics, user moderation, Razorpay transactions, and safety controls
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDemo}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo Data
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-6 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-[#6C3BFF]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats?.totalUsers.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              +12% this week
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Users</span>
            <Sparkles className="w-4 h-4 text-[#00C496]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats?.activeUsers.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              +36% this week
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-[#E94B99]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{stats?.totalRevenue.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              +24% this week
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">WA Unlocks</span>
            <Lock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats?.contactUnlocks}
            </span>
            <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
              ₹499 ea
            </span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        {[
          { id: 'overview' as const, label: 'Overview & Growth' },
          { id: 'users' as const, label: `Profiles (${recentUsers.length})` },
          { id: 'reports' as const, label: `Reports (${reports.length})` },
          { id: 'transactions' as const, label: 'Razorpay Orders' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-[#6C3BFF] text-[#6C3BFF]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* User Growth Chart Visualizer */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">User Growth Trends</h3>
                <p className="text-xs text-slate-500">Weekly active Indian gay &amp; bisexual men</p>
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                Last 30 Days
              </span>
            </div>

            {/* Custom SVG line graph matching uploaded mockup */}
            <div className="relative w-full h-56">
              <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6C3BFF" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#6C3BFF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid horizontal lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="#F1F5F9" strokeDasharray="4" />
                <line x1="0" y1="90" x2="600" y2="90" stroke="#F1F5F9" strokeDasharray="4" />
                <line x1="0" y1="140" x2="600" y2="140" stroke="#F1F5F9" strokeDasharray="4" />

                {/* Area Fill */}
                <path
                  d="M0,160 Q80,150 140,135 T280,105 T420,70 T600,30 L600,190 L0,190 Z"
                  fill="url(#growthGradient)"
                />

                {/* Line */}
                <path
                  d="M0,160 Q80,150 140,135 T280,105 T420,70 T600,30"
                  fill="none"
                  stroke="#6C3BFF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Key data point dots */}
                <circle cx="140" cy="135" r="4.5" fill="#6C3BFF" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="280" cy="105" r="4.5" fill="#6C3BFF" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="420" cy="70" r="4.5" fill="#6C3BFF" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="600" cy="30" r="5" fill="#FF6B9D" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 font-medium pt-3 border-t border-slate-100">
              <span>Apr 20</span>
              <span>Apr 22</span>
              <span>Apr 24</span>
              <span>Apr 26</span>
              <span>Apr 28</span>
              <span>Today</span>
            </div>
          </div>

          {/* Quick Security & Moderation Health */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#00C496]" />
                Platform Safety Status
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-600">Underage Filter (18+)</span>
                  <span className="font-bold text-emerald-600">Active (100% Enforced)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-600">Contact Number Masking</span>
                  <span className="font-bold text-emerald-600">Encrypted (Zero leak)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-600">Pending Safety Reports</span>
                  <span className="font-bold text-slate-800">{reports.length}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-500 to-[#6C3BFF] text-white shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                Monetization Metric
              </span>
              <h4 className="text-lg font-black mt-2">₹499 WhatsApp Unlock</h4>
              <p className="text-xs text-purple-100 mt-1">
                416+ men have unlocked external contact privileges, generating high-margin direct revenue without recurring churn.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Profiles Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Managed Profiles</h3>
            <span className="text-xs text-slate-500">10 Adult Male Demo Profiles</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3.5 pl-5">User</th>
                  <th className="p-3.5">Age</th>
                  <th className="p-3.5">Orientation</th>
                  <th className="p-3.5">Approx Distance</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-5 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 ring-1 ring-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{user.username}</span>
                        <span className="text-[10px] text-slate-400">{user.lookingFor.join(', ')}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-700 font-medium">{user.age}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        user.orientation === 'Gay' ? 'bg-purple-100 text-[#6C3BFF]' : 'bg-pink-100 text-[#E94B99]'
                      }`}>
                        {user.orientation}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600">{user.distanceKm} km away</td>
                    <td className="p-3.5">
                      {user.isBlocked ? (
                        <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">Blocked</span>
                      ) : (
                        <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                      )}
                    </td>
                    <td className="p-3.5 pr-5 text-right space-x-1.5">
                      <button
                        onClick={() => handleToggleBlock(user.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          user.isBlocked ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50' : 'border-amber-200 text-amber-600 hover:bg-amber-50'
                        }`}
                        title={user.isBlocked ? 'Unblock Profile' : 'Block Profile'}
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteProfile(user.id)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Safety &amp; Community Reports</h3>
          {reports.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              All clear! No pending user reports at this time.
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-800 text-xs">{rep.reportedProfileName}</span>
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold">
                        {rep.reason}
                      </span>
                    </div>
                    {rep.details && <p className="text-xs text-slate-600 mt-1">{rep.details}</p>}
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Reported on {new Date(rep.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleBlock(rep.reportedProfileId)}
                    className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
                  >
                    Block Profile
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Razorpay Transactions */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Razorpay Contact Unlock Transactions</h3>
          <div className="space-y-2.5">
            {recentPayments.map((tx) => (
              <div key={tx.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-800">{tx.razorpayOrderId}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tx.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : tx.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tx.status === 'verified' ? 'Verified / Unlocked' : tx.status === 'pending' ? 'Pending Approval' : tx.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Profile: <strong className="text-slate-700">{tx.profileName}</strong> • User: <span className="font-mono text-[10.5px]">{tx.userId}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="font-black text-slate-900 text-sm">₹{tx.amount}</span>
                    <span className="block text-[10px] text-slate-400">
                      {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {tx.status === 'pending' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleApprovePayment(tx.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                      >
                        Approve &amp; Unlock
                      </button>
                      <button
                        onClick={() => handleRejectPayment(tx.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
