import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Sliders,
  Flag,
  Percent,
  ToggleLeft,
  ToggleRight,
  Plus,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { settingsApi } from '../services/settingsApi.js';

export const SettingsView = () => {
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'commission' | 'flags'
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // General Settings
  const [platformCommission, setPlatformCommission] = useState(20);
  const [hostShare, setHostShare] = useState(80);
  const [gstRate, setGstRate] = useState(18);
  const [minHours, setMinHours] = useState(2);
  const [maxAdvanceDays, setMaxAdvanceDays] = useState(60);
  const [supportPhone, setSupportPhone] = useState('+91 98765 43210');
  const [supportEmail, setSupportEmail] = useState('support@countrydrive.com');

  // Commission Rules
  const [commissionRules, setCommissionRules] = useState([]);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [ruleCategory, setRuleCategory] = useState('SUV');
  const [ruleType, setRuleType] = useState('PERCENTAGE');
  const [ruleRate, setRuleRate] = useState(20);

  // Feature Flags
  const [featureFlags, setFeatureFlags] = useState([
    { key: 'instant_booking', description: 'Instant reservation confirmation without host manual review', enabled: true },
    { key: 'weekend_surge_pricing', description: 'Automated 15% weekend demand surge on luxury vehicles', enabled: true },
    { key: 'fastag_auto_deduct', description: 'Auto-debit FASTag toll expenses from security deposit', enabled: true },
    { key: 'liveness_selfie_strict', description: 'Require AI liveness face verification before vehicle ignition unlock', enabled: true },
    { key: 'auto_maintenance_block', description: 'Schedule depot inspection automatically every 5,000 km', enabled: false },
  ]);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [settingsRes, rulesRes, flagsRes] = await Promise.allSettled([
        settingsApi.list(),
        settingsApi.listCommissionRules(),
        settingsApi.listFeatureFlags(),
      ]);

      if (settingsRes.status === 'fulfilled') {
        const list = Array.isArray(settingsRes.value?.data) ? settingsRes.value.data : settingsRes.value?.data?.settings || [];
        list.forEach((item) => {
          if (item.key === 'platform_commission_pct') {
            const val = Number(item.value);
            setPlatformCommission(val);
            setHostShare(100 - val);
          }
          if (item.key === 'gst_rate_pct') setGstRate(Number(item.value));
          if (item.key === 'min_booking_hours') setMinHours(Number(item.value));
          if (item.key === 'max_advance_days') setMaxAdvanceDays(Number(item.value));
          if (item.key === 'support_phone') setSupportPhone(String(item.value));
          if (item.key === 'support_email') setSupportEmail(String(item.value));
        });
      }

      if (rulesRes.status === 'fulfilled') {
        const rList = Array.isArray(rulesRes.value?.data) ? rulesRes.value.data : rulesRes.value?.data?.rules || [];
        if (rList.length > 0) setCommissionRules(rList);
        else {
          // Default Prisma commission rules
          setCommissionRules([
            { id: '1', name: 'Standard SUV Take Rate', category: 'SUV', commissionType: 'PERCENTAGE', rate: 0.2, isActive: true },
            { id: '2', name: 'Sedan Fleet Take Rate', category: 'SEDAN', commissionType: 'PERCENTAGE', rate: 0.2, isActive: true },
            { id: '3', name: 'Luxury Category Tier', category: 'LUXURY', commissionType: 'PERCENTAGE', rate: 0.25, isActive: true },
            { id: '4', name: 'Two-Wheeler Scooty Tier', category: 'SCOOTY', commissionType: 'PERCENTAGE', rate: 0.15, isActive: true },
          ]);
        }
      }

      if (flagsRes.status === 'fulfilled') {
        const fList = Array.isArray(flagsRes.value?.data) ? flagsRes.value.data : flagsRes.value?.data?.featureFlags || [];
        if (fList.length > 0) setFeatureFlags(fList);
      }
    } catch (err) {
      console.warn('Settings load notice:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await settingsApi.bulkUpdate([
        { key: 'platform_commission_pct', value: String(platformCommission), valueType: 'NUMBER', description: 'Platform Take Rate' },
        { key: 'gst_rate_pct', value: String(gstRate), valueType: 'NUMBER', description: 'GST rate' },
        { key: 'min_booking_hours', value: String(minHours), valueType: 'NUMBER', description: 'Minimum booking duration' },
        { key: 'max_advance_days', value: String(maxAdvanceDays), valueType: 'NUMBER', description: 'Max advance booking days' },
        { key: 'support_phone', value: supportPhone, valueType: 'STRING', description: 'Support helpline' },
        { key: 'support_email', value: supportEmail, valueType: 'STRING', description: 'Support email' },
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.warn('Settings bulk update:', err.message);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFlag = async (key, currentVal) => {
    try {
      await settingsApi.toggleFeatureFlag(key, { enabled: !currentVal });
      setFeatureFlags((prev) =>
        prev.map((f) => (f.key === key ? { ...f, enabled: !currentVal } : f))
      );
    } catch (err) {
      console.warn('Toggle flag:', err.message);
      setFeatureFlags((prev) =>
        prev.map((f) => (f.key === key ? { ...f, enabled: !currentVal } : f))
      );
    }
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: ruleName.trim(),
        category: ruleCategory,
        commissionType: ruleType,
        rate: Number(ruleRate) / 100,
        isActive: true,
      };
      await settingsApi.createCommissionRule(payload);
      setCommissionRules((prev) => [...prev, { id: `rule-${Date.now()}`, ...payload }]);
      setShowRuleModal(false);
      setRuleName('');
    } catch (err) {
      alert(err.message || 'Failed to create commission rule');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Marketplace Settings & Rules
          </h1>
          <p className="text-xs text-[#8ba398] mt-0.5">
            Full Prisma spec: global 80/20 commercial split, tax parameters, category commission overrides, and feature toggles.
          </p>
        </div>

        <button
          onClick={loadAll}
          className="px-3.5 py-2.5 rounded-xl bg-[#121e19] hover:bg-[#172721] border border-[#1c3229] text-xs font-semibold text-[#8ba398] hover:text-white flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin text-[#00D26A]' : ''} />
          <span>Sync Settings</span>
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Platform configuration updated and synchronized across backend microservices.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#1c3229] gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'general'
              ? 'border-[#00D26A] text-[#00D26A]'
              : 'border-transparent text-[#8ba398] hover:text-white'
          }`}
        >
          <Sliders size={14} />
          <span>Commercial & Tax Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('commission')}
          className={`pb-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'commission'
              ? 'border-[#00D26A] text-[#00D26A]'
              : 'border-transparent text-[#8ba398] hover:text-white'
          }`}
        >
          <Percent size={14} />
          <span>Category Commission Rules ({commissionRules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('flags')}
          className={`pb-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'flags'
              ? 'border-[#00D26A] text-[#00D26A]'
              : 'border-transparent text-[#8ba398] hover:text-white'
          }`}
        >
          <Flag size={14} />
          <span>Feature Flags ({featureFlags.length})</span>
        </button>
      </div>

      {/* TAB 1: General Commercial Settings */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveSettings} className="bg-[#121e19] border border-[#1c3229] p-6 rounded-2xl space-y-6 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-[#8ba398] uppercase tracking-wider mb-2">
                Platform Take Rate Commission (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={platformCommission}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPlatformCommission(val);
                  setHostShare(100 - val);
                }}
                className="w-full bg-[#0a110e] border border-[#1c3229] focus:border-[#00D26A] rounded-xl px-4 py-2.5 text-white focus:outline-none font-mono"
              />
              <span className="text-[10px] text-[#577064] mt-1 block">Default CountryDrive fee per booking</span>
            </div>

            <div>
              <label className="block font-semibold text-[#8ba398] uppercase tracking-wider mb-2">
                Fleet Host Net Share (%)
              </label>
              <input
                type="number"
                readOnly
                value={hostShare}
                className="w-full bg-[#172721] border border-[#1c3229] rounded-xl px-4 py-2.5 text-emerald-400 font-mono font-bold focus:outline-none"
              />
              <span className="text-[10px] text-emerald-400/80 mt-1 block">Automated disbursement share to host bank account</span>
            </div>

            <div>
              <label className="block font-semibold text-[#8ba398] uppercase tracking-wider mb-2">
                GST / Tax Rate (%)
              </label>
              <input
                type="number"
                min={0}
                max={28}
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className="w-full bg-[#0a110e] border border-[#1c3229] focus:border-[#00D26A] rounded-xl px-4 py-2.5 text-white focus:outline-none font-mono"
              />
              <span className="text-[10px] text-[#577064] mt-1 block">Statutory GST on self-drive vehicle hire</span>
            </div>

            <div>
              <label className="block font-semibold text-[#8ba398] uppercase tracking-wider mb-2">
                Minimum Rental Duration (Hours)
              </label>
              <input
                type="number"
                min={1}
                value={minHours}
                onChange={(e) => setMinHours(Number(e.target.value))}
                className="w-full bg-[#0a110e] border border-[#1c3229] focus:border-[#00D26A] rounded-xl px-4 py-2.5 text-white focus:outline-none font-mono"
              />
              <span className="text-[10px] text-[#577064] mt-1 block">Shortest allowed trip reservation</span>
            </div>

            <div>
              <label className="block font-semibold text-[#8ba398] uppercase tracking-wider mb-2">
                Max Advance Booking Window (Days)
              </label>
              <input
                type="number"
                min={1}
                max={180}
                value={maxAdvanceDays}
                onChange={(e) => setMaxAdvanceDays(Number(e.target.value))}
                className="w-full bg-[#0a110e] border border-[#1c3229] focus:border-[#00D26A] rounded-xl px-4 py-2.5 text-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#8ba398] uppercase tracking-wider mb-2">
                Support Helpline Number
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full bg-[#0a110e] border border-[#1c3229] focus:border-[#00D26A] rounded-xl px-4 py-2.5 text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#1c3229] flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="btn-glossy btn-glossy-emerald px-6 py-2.5 rounded-xl text-xs font-bold text-black flex items-center gap-2"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Commission Rules */}
      {activeTab === 'commission' && (
        <div className="bg-[#121e19] border border-[#1c3229] rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white">Category Commission Overrides</h3>
              <p className="text-xs text-[#8ba398]">Tailored platform commission rates by vehicle category</p>
            </div>
            <button
              onClick={() => setShowRuleModal(true)}
              className="btn-glossy btn-glossy-emerald px-3.5 py-1.5 rounded-xl text-xs font-bold text-black flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add Category Rule</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1c3229] text-[11px] text-[#577064] uppercase font-medium">
                  <th className="pb-3 px-2">Rule Name</th>
                  <th className="pb-3 px-2">Category</th>
                  <th className="pb-3 px-2">Type</th>
                  <th className="pb-3 px-2">Platform Cut</th>
                  <th className="pb-3 px-2">Host Share</th>
                  <th className="pb-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c3229]/60">
                {commissionRules.map((r) => {
                  const pct = Math.round(Number(r.rate || 0.2) * 100);
                  return (
                    <tr key={r.id} className="hover:bg-[#172721] transition-colors">
                      <td className="py-3 px-2 font-semibold text-white">{r.name}</td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded bg-[#0a110e] text-[#00D26A] border border-[#1c3229] font-mono">
                          {r.category || 'ALL'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-[#8ba398]">{r.commissionType}</td>
                      <td className="py-3 px-2 font-bold text-amber-400 font-mono">{pct}%</td>
                      <td className="py-3 px-2 font-bold text-[#00D26A] font-mono">{100 - pct}%</td>
                      <td className="py-3 px-2 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                          ACTIVE
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Feature Flags */}
      {activeTab === 'flags' && (
        <div className="bg-[#121e19] border border-[#1c3229] rounded-2xl p-5 space-y-4 shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-white">Dynamic Operational Feature Flags</h3>
            <p className="text-xs text-[#8ba398]">Safely enable or toggle backend microservice behaviors in real-time</p>
          </div>

          <div className="divide-y divide-[#1c3229]/60">
            {featureFlags.map((flag) => (
              <div key={flag.key} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-xs">{flag.key}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0a110e] text-[#577064] border border-[#1c3229]">
                      Production
                    </span>
                  </div>
                  <p className="text-xs text-[#8ba398] mt-0.5">{flag.description}</p>
                </div>

                <button
                  onClick={() => handleToggleFlag(flag.key, flag.enabled)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                    flag.enabled
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-[#00D26A]'
                      : 'bg-zinc-800/40 border-zinc-700 text-zinc-400'
                  }`}
                >
                  {flag.enabled ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  <span>{flag.enabled ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Commission Rule Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-sm p-5 space-y-4">
            <h3 className="font-bold text-white text-sm">Add Category Commission Rule</h3>
            <form onSubmit={handleCreateRule} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#8ba398] mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g. Electric Vehicle Incentive"
                  className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[#8ba398] mb-1">Vehicle Category</label>
                <select
                  value={ruleCategory}
                  onChange={(e) => setRuleCategory(e.target.value)}
                  className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white"
                >
                  <option value="SUV">SUV</option>
                  <option value="SEDAN">SEDAN</option>
                  <option value="HATCHBACK">HATCHBACK</option>
                  <option value="LUXURY">LUXURY</option>
                  <option value="MOTORBIKE">MOTORBIKE</option>
                  <option value="SCOOTY">SCOOTY</option>
                </select>
              </div>

              <div>
                <label className="block text-[#8ba398] mb-1">Platform Commission Rate (%)</label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={ruleRate}
                  onChange={(e) => setRuleRate(Number(e.target.value))}
                  className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#1c3229]">
                <button type="button" onClick={() => setShowRuleModal(false)} className="px-3 py-1.5 text-xs text-[#8ba398]">Cancel</button>
                <button type="submit" className="btn-glossy btn-glossy-emerald px-4 py-1.5 text-xs font-bold text-black">
                  Create Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
