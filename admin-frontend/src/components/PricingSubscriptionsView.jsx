import React, { useState } from 'react';
import {
  Tag,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle,
  Plus,
  Shield,
  Zap,
} from 'lucide-react';
import { initialPricingRules, initialSubscriptions } from '@/data/mockData';

export const PricingSubscriptionsView = () => {
  const [pricingRules, setPricingRules] = useState(initialPricingRules);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [subTab, setSubTab] = useState('pricing'); // 'pricing' | 'subscriptions'
  const [selectedRule, setSelectedRule] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Pricing Models & Subscriptions
          </h1>
          <p className="text-xs text-[#8ba398] mt-0.5">
            Configure hourly rates, daily packages, included KM allowances, extra KM rates, and monthly subscription plans.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-[#0a110e] p-1 rounded-xl border border-[#1c3229]">
          <button
            onClick={() => setSubTab('pricing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'pricing'
                ? 'btn-glossy btn-glossy-pill-active'
                : 'btn-glossy-pill-inactive'
            }`}
          >
            Pricing Rules ({pricingRules.length})
          </button>
          <button
            onClick={() => setSubTab('subscriptions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'subscriptions'
                ? 'btn-glossy btn-glossy-pill-active'
                : 'btn-glossy-pill-inactive'
            }`}
          >
            Subscriptions ({subscriptions.length})
          </button>
        </div>
      </div>

      {subTab === 'pricing' ? (
        /* Pricing Rules Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pricingRules.map((rule) => (
            <div
              key={rule.id}
              onClick={() => setSelectedRule(rule)}
              className="bg-[#121e19] border border-[#1c3229] rounded-2xl p-4 space-y-3 hover:border-[#00D26A] hover:shadow-[0_0_20px_rgba(0,210,106,0.15)] transition-all group flex flex-col justify-between cursor-pointer select-none"
              title="Click anywhere to inspect pricing matrix specifications"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-base group-hover:text-[#00D26A] transition-colors">{rule.category}</span>
                  <span className="text-[10px] font-mono text-[#00D26A] bg-[#0a110e] px-2 py-0.5 rounded border border-[#1c3229]">
                    {rule.id}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#8ba398] border-t border-[#1c3229] pt-3">
                  <div className="flex justify-between">
                    <span>Base Hourly Rate:</span>
                    <strong className="text-white">₹{rule.baseHourly}/hr</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Base Daily Rate:</span>
                    <strong className="text-white">₹{rule.baseDaily}/day</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Included KM / Day:</span>
                    <strong className="text-white">{rule.includedKmPerDay} KM</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Extra KM Penalty:</span>
                    <strong className="text-amber-400">₹{rule.extraKmRate}/KM</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimum Duration:</span>
                    <strong className="text-sky-400">{rule.minDuration}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRule(rule);
                }}
                className="btn-glossy btn-glossy-dark text-xs w-full py-1.5 mt-3"
              >
                Inspect Pricing Matrix
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Subscriptions Plans View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              onClick={() => setSelectedSub(sub)}
              className="bg-[#121e19] border border-[#1c3229] rounded-2xl p-5 space-y-4 hover:border-[#00D26A] hover:shadow-[0_0_20px_rgba(0,210,106,0.15)] transition-all group flex flex-col justify-between cursor-pointer select-none"
              title="Click anywhere to inspect subscription plan details"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-lg group-hover:text-[#00D26A] transition-colors">{sub.planName}</span>
                  <span className="bg-[#00D26A]/20 text-[#00D26A] text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {sub.duration}
                  </span>
                </div>

                <div className="text-2xl font-extrabold text-white">
                  ₹{sub.price.toLocaleString()} <span className="text-xs text-[#8ba398] font-normal">/ month</span>
                </div>

                <div className="space-y-2 text-xs text-[#8ba398] border-t border-[#1c3229] pt-3">
                  <p className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#00D26A]" /> Included Allowance: <strong>{sub.includedKm} KM / month</strong>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#00D26A]" /> Applicable Categories: <strong>{sub.vehicleCategory}</strong>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#00D26A]" /> Active Subscribers: <strong>{sub.activeSubscribers} Users</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSub(sub);
                }}
                className="btn-glossy btn-glossy-emerald text-xs w-full py-2"
              >
                Inspect Plan Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pricing Rule Inspection Modal */}
      {selectedRule && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-[#1c3229] pb-3">
              <div>
                <h3 className="font-bold text-white text-base">Category Pricing Matrix</h3>
                <p className="text-xs text-[#00D26A] font-mono">{ruleCategoryHeader(selectedRule)}</p>
              </div>
              <button onClick={() => setSelectedRule(null)} className="text-[#8ba398] hover:text-white">✕</button>
            </div>

            <div className="p-4 bg-[#121e19] rounded-xl border border-[#1c3229] space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#577064]">Category Tier:</span>
                <span className="text-white font-bold">{selectedRule.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#577064]">Hourly Rate:</span>
                <span className="text-[#00D26A] font-bold font-mono">₹{selectedRule.baseHourly}/hour</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#577064]">Daily Rate:</span>
                <span className="text-white font-bold font-mono">₹{selectedRule.baseDaily}/day</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#577064]">Included Daily KM:</span>
                <span className="text-white font-bold font-mono">{selectedRule.includedKmPerDay} KM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#577064]">Extra KM Penalty:</span>
                <span className="text-amber-400 font-bold font-mono">₹{selectedRule.extraKmRate}/KM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#577064]">Minimum Duration:</span>
                <span className="text-sky-400 font-bold font-mono">{selectedRule.minDuration}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#1c3229]">
              <button
                onClick={() => setSelectedRule(null)}
                className="btn-glossy btn-glossy-emerald px-5 py-1.5 rounded-xl text-xs font-bold text-black"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Plan Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-[#1c3229] pb-3">
              <div>
                <h3 className="font-bold text-white text-base">{selectedSub.planName}</h3>
                <p className="text-xs text-[#00D26A] font-mono">{selectedSub.id} • {selectedSub.duration}</p>
              </div>
              <button onClick={() => setSelectedSub(null)} className="text-[#8ba398] hover:text-white">✕</button>
            </div>

            <div className="p-4 bg-[#121e19] rounded-xl border border-[#1c3229] space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#577064]">Subscription Fee:</span>
                <span className="text-white font-bold font-mono text-base">₹{selectedSub.price.toLocaleString()} / mo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#577064]">Included Allowance:</span>
                <span className="text-[#00D26A] font-bold font-mono">{selectedSub.includedKm} KM / month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#577064]">Applicable Vehicle Category:</span>
                <span className="text-white font-bold">{selectedSub.vehicleCategory}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#577064]">Active Subscriber Base:</span>
                <span className="text-sky-400 font-bold font-mono">{selectedSub.activeSubscribers} Drivers</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#1c3229]">
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
    </div>
  );
};

function ruleCategoryHeader(rule) {
  return `${rule.category} • ${rule.id}`;
}
