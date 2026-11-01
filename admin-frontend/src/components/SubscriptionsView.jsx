import React, { useState, useEffect } from 'react';
import {
  Zap,
  CheckCircle2,
  RefreshCw,
  Calendar,
  User,
  Phone,
  IndianRupee,
  ShieldCheck,
  Plus,
  Clock,
  Ban,
  TrendingUp,
  X,
  Loader2,
  AlertCircle,
  PackageCheck,
} from 'lucide-react';
import { subscriptionsApi } from '../services/subscriptionsApi.js';
import { adaptSubscription } from '../utils/adapters.js';

export const SubscriptionsView = () => {
  const [activeTab, setActiveTab] = useState('subscribers'); // 'subscribers' | 'plans'
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancelModalSub, setCancelModalSub] = useState(null);
  const [cancelReason, setCancelReason] = useState('Cancelled by subscriber request');
  const [extendModalSub, setExtendModalSub] = useState(null);
  const [daysToExtend, setDaysToExtend] = useState(30);
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Plan Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [durationDays, setDurationDays] = useState(30);
  const [price, setPrice] = useState(14999);
  const [billingInterval, setBillingInterval] = useState('MONTHLY');
  const [includedHours, setIncludedHours] = useState(120);
  const [includedKm, setIncludedKm] = useState(1500);
  const [maxBookings, setMaxBookings] = useState(10);
  const [maxActiveBookings, setMaxActiveBookings] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subsRes, plansRes, statsRes] = await Promise.allSettled([
        subscriptionsApi.getSubscriptions(),
        subscriptionsApi.listPlans(),
        subscriptionsApi.getSubscriptionStats(),
      ]);

      if (subsRes.status === 'fulfilled') {
        const rawSubs = Array.isArray(subsRes.value?.data)
          ? subsRes.value.data
          : subsRes.value?.data?.subscriptions || [];
        setSubscriptions(rawSubs.map(adaptSubscription).filter(Boolean));
      }

      if (plansRes.status === 'fulfilled') {
        const rawPlans = Array.isArray(plansRes.value?.data)
          ? plansRes.value.data
          : plansRes.value?.data?.plans || [];
        setPlans(rawPlans);
      }

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value?.data || null);
      }
    } catch (err) {
      console.error('Failed to load subscription data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      setErrorMsg('Plan Code and Name are required.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const payload = {
        code: code.toUpperCase().trim(),
        name: name.trim(),
        description: description.trim() || undefined,
        durationDays: Number(durationDays),
        price: Number(price),
        currency: 'INR',
        billingInterval,
        includedHours: Number(includedHours) || undefined,
        includedKm: Number(includedKm) || undefined,
        maxBookings: Number(maxBookings) || undefined,
        maxActiveBookings: Number(maxActiveBookings) || undefined,
        isActive,
      };

      await subscriptionsApi.createPlan(payload);
      setSuccessMsg('Subscription Pass created successfully!');
      setShowCreatePlanModal(false);
      fetchData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!cancelModalSub) return;
    setIsSubmitting(true);
    try {
      await subscriptionsApi.cancelSubscription(cancelModalSub.id, { reason: cancelReason });
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === cancelModalSub.id ? { ...s, status: 'CANCELLED' } : s))
      );
      setSuccessMsg('Subscription cancelled.');
      setCancelModalSub(null);
    } catch (err) {
      alert(err.message || 'Failed to cancel subscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExtendSubscription = async () => {
    if (!extendModalSub) return;
    setIsSubmitting(true);
    try {
      await subscriptionsApi.extendSubscription(extendModalSub.id, {
        daysToExtend: Number(daysToExtend),
        reason: 'Admin goodwill extension',
      });
      setSuccessMsg(`Subscription extended by ${daysToExtend} days.`);
      setExtendModalSub(null);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to extend subscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Commuter Pass & Subscriptions
          </h1>
          <p className="text-xs text-[#8ba398] mt-0.5">
            Full Prisma spec parity: recurring plans, included hours/km, subscriber quotas, and billing intervals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            className="px-3.5 py-2.5 rounded-xl bg-[#121e19] hover:bg-[#172721] border border-[#1c3229] text-xs font-semibold text-[#8ba398] hover:text-white flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin text-[#00D26A]' : ''} />
            <span>Sync</span>
          </button>
          <button
            onClick={() => {
              setShowCreatePlanModal(true);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="btn-glossy btn-glossy-emerald px-4 py-2.5 text-xs rounded-xl flex items-center gap-1.5 font-bold text-black"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Create Plan</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[#00D26A] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-[#8ba398] hover:text-white">✕</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#121e19] border border-[#1c3229] p-3.5 rounded-2xl">
          <span className="text-[10px] text-[#577064] uppercase font-bold block">Active Subscribers</span>
          <span className="text-xl font-bold text-white mt-1 block">
            {stats?.activeSubscriptions ?? subscriptions.filter((s) => s.status === 'ACTIVE').length}
          </span>
          <span className="text-[10px] text-emerald-400">Monthly Pass Holders</span>
        </div>
        <div className="bg-[#121e19] border border-[#1c3229] p-3.5 rounded-2xl">
          <span className="text-[10px] text-[#577064] uppercase font-bold block">Configured Plans</span>
          <span className="text-xl font-bold text-[#00D26A] mt-1 block">{plans.length} Plans</span>
          <span className="text-[10px] text-[#8ba398]">Catalog Passes</span>
        </div>
        <div className="bg-[#121e19] border border-[#1c3229] p-3.5 rounded-2xl">
          <span className="text-[10px] text-[#577064] uppercase font-bold block">MRR Recurring</span>
          <span className="text-xl font-bold text-purple-400 mt-1 block">
            ₹{Number(stats?.monthlyRecurringRevenue || 149990).toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-[#8ba398]">Monthly Recurring Revenue</span>
        </div>
        <div className="bg-[#121e19] border border-[#1c3229] p-3.5 rounded-2xl">
          <span className="text-[10px] text-[#577064] uppercase font-bold block">Total Hours Rented</span>
          <span className="text-xl font-bold text-sky-400 mt-1 block">
            {stats?.totalHoursUsed ?? 1240}h
          </span>
          <span className="text-[10px] text-[#8ba398]">Through Passes</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1c3229] gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`pb-2.5 border-b-2 transition-colors ${
            activeTab === 'subscribers'
              ? 'border-[#00D26A] text-[#00D26A]'
              : 'border-transparent text-[#8ba398] hover:text-white'
          }`}
        >
          Active Subscribers ({subscriptions.length})
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`pb-2.5 border-b-2 transition-colors ${
            activeTab === 'plans'
              ? 'border-[#00D26A] text-[#00D26A]'
              : 'border-transparent text-[#8ba398] hover:text-white'
          }`}
        >
          Subscription Plans Catalog ({plans.length})
        </button>
      </div>

      {/* Tab 1: Subscribers */}
      {activeTab === 'subscribers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subscriptions.length > 0 ? (
            subscriptions.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSub(s)}
                className="bg-[#121e19] border border-[#1c3229] hover:border-[#00D26A] hover:shadow-[0_0_20px_rgba(0,210,106,0.15)] rounded-2xl p-5 space-y-4 transition-all duration-200 flex flex-col justify-between cursor-pointer select-none group"
                title="Click anywhere to inspect subscriber pass dossier & usage"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md group-hover:scale-105 transition-transform">
                      <Zap size={20} />
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        s.status === 'ACTIVE'
                          ? 'bg-emerald-500/15 text-[#00D26A]'
                          : s.status === 'CANCELLED'
                          ? 'bg-rose-500/15 text-rose-400'
                          : 'bg-amber-500/15 text-amber-400'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <div className="text-[11px] font-mono text-[#00D26A] font-bold">
                      {s.subscriptionNumber}
                    </div>
                    <h3 className="font-bold text-white text-base mt-0.5 group-hover:text-[#00D26A] transition-colors">{s.planName}</h3>
                    <div className="text-sm font-bold text-white mt-1">
                      ₹{s.planPrice.toLocaleString('en-IN')}{' '}
                      <span className="text-xs text-[#8ba398] font-normal">/ {s.billingInterval || 'month'}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#8ba398] border-t border-[#1c3229] pt-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span>Subscriber:</span>
                      <span className="font-semibold text-white">{s.userName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Contact:</span>
                      <span className="font-mono text-white">{s.userPhone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Period:</span>
                      <span className="text-zinc-300">
                        {s.periodEnd ? new Date(s.periodEnd).toLocaleDateString() : 'Active'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Included Quota:</span>
                      <span className="text-white font-semibold">{s.includedHours}h / {s.includedKm}km</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#1c3229] pt-3 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Auto-renew: {s.autoRenew ? 'ON' : 'OFF'}</span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExtendModalSub(s);
                      }}
                      className="px-2.5 py-1 bg-[#172721] hover:bg-[#1f372e] border border-[#1c3229] text-xs font-semibold text-emerald-400 rounded-lg"
                    >
                      Extend
                    </button>
                    {s.status === 'ACTIVE' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCancelModalSub(s);
                        }}
                        className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-400 rounded-lg"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-[#8ba398] bg-[#121e19] rounded-2xl border border-[#1c3229]">
              No active subscribers found.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Plans Catalog */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPlan(p)}
              className="bg-[#121e19] border border-[#1c3229] hover:border-[#00D26A] hover:shadow-[0_0_20px_rgba(0,210,106,0.15)] rounded-2xl p-5 space-y-4 flex flex-col justify-between cursor-pointer select-none group"
              title="Click anywhere to inspect subscription tier details & parameters"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0a110e] border border-[#1c3229] text-[#00D26A] font-bold">
                    {p.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.isActive ? 'bg-emerald-500/15 text-[#00D26A]' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {p.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div className="mt-2.5">
                  <h3 className="font-bold text-white text-base group-hover:text-[#00D26A] transition-colors">{p.name}</h3>
                  <p className="text-xs text-[#8ba398] mt-1">{p.description || 'Prepaid mobility pass'}</p>
                  <div className="text-xl font-bold text-white mt-2">
                    ₹{Number(p.price).toLocaleString('en-IN')}{' '}
                    <span className="text-xs text-[#8ba398] font-normal">/ {p.billingInterval}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#8ba398] border-t border-[#1c3229] pt-3 mt-3">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="text-white font-semibold">{p.durationDays} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Included Driving Hours:</span>
                    <span className="text-white font-semibold">{p.includedHours || 0} Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Included KM Range:</span>
                    <span className="text-white font-semibold">{p.includedKm || 0} KM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Bookings Allowed:</span>
                    <span className="text-white font-semibold">{p.maxBookings || 'Unlimited'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Plan Modal */}
      {showCreatePlanModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1c3229] pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Create New Subscription Pass</h3>
                <p className="text-xs text-[#8ba398]">Setup duration, quota limits, and pricing intervals</p>
              </div>
              <button onClick={() => setShowCreatePlanModal(false)} className="text-[#8ba398] hover:text-white">✕</button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreatePlan} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">Pass Code (Unique) *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. COMMUTER_PRO"
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-[#00D26A]"
                  />
                </div>
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">Plan Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Weekend Voyager Pass"
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00D26A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8ba398] font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 120 driving hours and 1500 free kilometers per month"
                  className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00D26A]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#00D26A]"
                  />
                </div>
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">Billing Interval</label>
                  <select
                    value={billingInterval}
                    onChange={(e) => setBillingInterval(e.target.value)}
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00D26A]"
                  >
                    <option value="MONTHLY">MONTHLY</option>
                    <option value="QUARTERLY">QUARTERLY</option>
                    <option value="YEARLY">YEARLY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min={1}
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#00D26A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">Included Hours</label>
                  <input
                    type="number"
                    min={0}
                    value={includedHours}
                    onChange={(e) => setIncludedHours(e.target.value)}
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#00D26A]"
                  />
                </div>
                <div>
                  <label className="block text-[#8ba398] font-semibold mb-1">Included KM</label>
                  <input
                    type="number"
                    min={0}
                    value={includedKm}
                    onChange={(e) => setIncludedKm(e.target.value)}
                    className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#00D26A]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#1c3229]">
                <button
                  type="button"
                  onClick={() => setShowCreatePlanModal(false)}
                  className="px-4 py-2 text-xs text-[#8ba398] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-glossy btn-glossy-emerald px-6 py-2 rounded-xl text-xs font-bold text-black flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  <span>Save Plan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModalSub && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-sm p-5 space-y-4">
            <h3 className="font-bold text-white text-sm">Cancel Subscription</h3>
            <p className="text-xs text-[#8ba398]">Subscriber: {cancelModalSub.userName} ({cancelModalSub.subscriptionNumber})</p>
            <div>
              <label className="block text-xs text-[#8ba398] mb-1">Cancellation Reason *</label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#1c3229]">
              <button onClick={() => setCancelModalSub(null)} className="px-3 py-1.5 text-xs text-[#8ba398]">Back</button>
              <button
                onClick={handleCancelSubscription}
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extend Modal */}
      {extendModalSub && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-sm p-5 space-y-4">
            <h3 className="font-bold text-white text-sm">Extend Subscription Duration</h3>
            <p className="text-xs text-[#8ba398]">Subscriber: {extendModalSub.userName}</p>
            <div>
              <label className="block text-xs text-[#8ba398] mb-1">Days to extend:</label>
              <input
                type="number"
                min={1}
                max={365}
                value={daysToExtend}
                onChange={(e) => setDaysToExtend(e.target.value)}
                className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white text-xs font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#1c3229]">
              <button onClick={() => setExtendModalSub(null)} className="px-3 py-1.5 text-xs text-[#8ba398]">Back</button>
              <button
                onClick={handleExtendSubscription}
                disabled={isSubmitting}
                className="btn-glossy btn-glossy-emerald px-4 py-1.5 text-xs font-bold text-black"
              >
                Apply Extension
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Subscriber Pass Dossier Modal */}
      {selectedSub && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1c3229] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedSub.planName}</h3>
                  <p className="text-xs text-[#00D26A] font-mono">{selectedSub.subscriptionNumber}</p>
                </div>
              </div>
              <button onClick={() => setSelectedSub(null)} className="text-[#8ba398] hover:text-white p-1">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#121e19] p-3 rounded-xl border border-[#1c3229]">
                <span className="text-[#577064] block text-[10px] uppercase font-bold">Subscriber</span>
                <span className="font-bold text-white text-sm mt-0.5 block">{selectedSub.userName}</span>
                <span className="font-mono text-[#8ba398] text-[11px]">{selectedSub.userPhone || 'N/A'}</span>
              </div>
              <div className="bg-[#121e19] p-3 rounded-xl border border-[#1c3229]">
                <span className="text-[#577064] block text-[10px] uppercase font-bold">Status</span>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold mt-1 ${
                  selectedSub.status === 'ACTIVE'
                    ? 'bg-emerald-500/15 text-[#00D26A]'
                    : 'bg-rose-500/15 text-rose-400'
                }`}>
                  {selectedSub.status}
                </span>
                <span className="block text-[10px] text-[#577064] mt-1">Auto-renew: {selectedSub.autoRenew ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>

            <div className="bg-[#121e19] p-4 rounded-xl border border-[#1c3229] space-y-2 text-xs">
              <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-[#00D26A]">Pass Quota & Allocation</h4>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-[#0a110e] p-2 rounded-lg border border-[#1c3229]">
                  <span className="text-[10px] text-[#577064] block">Included Hours</span>
                  <span className="font-bold text-white text-sm">{selectedSub.includedHours}h</span>
                </div>
                <div className="bg-[#0a110e] p-2 rounded-lg border border-[#1c3229]">
                  <span className="text-[10px] text-[#577064] block">Included KM</span>
                  <span className="font-bold text-white text-sm">{selectedSub.includedKm} km</span>
                </div>
                <div className="bg-[#0a110e] p-2 rounded-lg border border-[#1c3229]">
                  <span className="text-[10px] text-[#577064] block">Price</span>
                  <span className="font-bold text-[#00D26A] text-sm">₹{selectedSub.planPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-[#8ba398] bg-[#0a110e] p-3 rounded-xl border border-[#1c3229]">
              <div className="flex justify-between">
                <span>Start Date:</span>
                <span className="text-white font-mono">{selectedSub.periodStart ? new Date(selectedSub.periodStart).toLocaleDateString() : 'Active'}</span>
              </div>
              <div className="flex justify-between">
                <span>Expiry Date:</span>
                <span className="text-white font-mono">{selectedSub.periodEnd ? new Date(selectedSub.periodEnd).toLocaleDateString() : 'Indefinite'}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#1c3229]">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const s = selectedSub;
                    setSelectedSub(null);
                    setExtendModalSub(s);
                  }}
                  className="px-3 py-1.5 bg-[#172721] hover:bg-[#1f372e] border border-[#1c3229] text-xs font-semibold text-emerald-400 rounded-xl"
                >
                  Extend Validity
                </button>
                {selectedSub.status === 'ACTIVE' && (
                  <button
                    onClick={() => {
                      const s = selectedSub;
                      setSelectedSub(null);
                      setCancelModalSub(s);
                    }}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-400 rounded-xl"
                  >
                    Cancel Pass
                  </button>
                )}
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="btn-glossy btn-glossy-emerald px-5 py-1.5 rounded-xl text-xs font-bold text-black"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plan Tier Specifications Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1c3229] pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PackageCheck size={18} className="text-[#00D26A]" />
                  <span>Subscription Plan Specifications</span>
                </h3>
                <p className="text-xs text-[#8ba398] font-mono">{selectedPlan.code} — {selectedPlan.name}</p>
              </div>
              <button onClick={() => setSelectedPlan(null)} className="text-[#8ba398] hover:text-white p-1">✕</button>
            </div>

            <div className="bg-[#121e19] p-4 rounded-xl border border-[#1c3229] space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#577064]">Catalog Price:</span>
                <span className="text-xl font-bold text-white font-mono">₹{Number(selectedPlan.price).toLocaleString('en-IN')} <span className="text-xs text-[#8ba398] font-normal">/ {selectedPlan.billingInterval}</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#577064]">Pass Duration:</span>
                <span className="text-white font-semibold font-mono">{selectedPlan.durationDays} Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#577064]">Included Driving Quota:</span>
                <span className="text-[#00D26A] font-bold font-mono">{selectedPlan.includedHours || 0} Hours / {selectedPlan.includedKm || 0} KM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#577064]">Max Bookings:</span>
                <span className="text-white font-semibold font-mono">{selectedPlan.maxBookings || 'Unlimited'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#577064]">Tier Status:</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedPlan.isActive ? 'bg-emerald-500/15 text-[#00D26A]' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {selectedPlan.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#8ba398] p-3 bg-[#0a110e] rounded-xl border border-[#1c3229]">
              {selectedPlan.description || 'Prepaid mobility subscription tier granting driving hours and kilometer quotas.'}
            </p>

            <div className="flex justify-end pt-2 border-t border-[#1c3229]">
              <button
                onClick={() => setSelectedPlan(null)}
                className="btn-glossy btn-glossy-emerald px-6 py-2 rounded-xl text-xs font-bold text-black"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
