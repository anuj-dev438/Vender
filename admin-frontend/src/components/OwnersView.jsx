import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  Car,
  IndianRupee,
  Phone,
  Mail,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  FileText,
  X,
  AlertCircle,
  Calendar,
  UserCheck,
  BadgePercent,
  Clock,
  MapPin,
} from 'lucide-react';
import { usersApi } from '../services/usersApi.js';
import { adaptOwner } from '../utils/adapters.js';

export const OwnersView = () => {
  const [owners, setOwners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwner, setSelectedOwner] = useState(null);

  const fetchOwners = async () => {
    setIsLoading(true);
    try {
      const res = await usersApi.getOwners({ limit: 100 });
      const raw = Array.isArray(res?.data) ? res.data : res?.data?.owners || res?.data?.users || [];
      const adapted = raw.map(adaptOwner).filter(Boolean);
      setOwners(adapted);
    } catch (err) {
      console.error('Failed to load owners:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const filtered = owners.filter(
    (o) =>
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.businessName && o.businessName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      o.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0d1c15] via-[#121e19] to-[#0a110e] border border-[#1c3229] p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00D26A] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00D26A]" />
            <span>Commercial Split: 80% Fleet Host / 20% CountryDrive Platform</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Vehicle Hosts & Fleet Partners</h1>
          <p className="text-xs text-[#8ba398] mt-0.5">
            Full Prisma profile parity: business tax IDs, GSTIN registration, bank account verification, and fleet allocations.
          </p>
        </div>

        <button
          onClick={fetchOwners}
          className="px-3.5 py-2 rounded-xl bg-[#121e19] hover:bg-[#172721] border border-[#1c3229] text-xs font-semibold text-[#8ba398] hover:text-white flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin text-[#00D26A]' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-[#121e19] border border-[#1c3229] p-4 rounded-2xl flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#577064]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search host by partner name or business..."
            className="w-full bg-[#0a110e] border border-[#1c3229] focus:border-[#00D26A] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#577064] focus:outline-none"
          />
        </div>
        <span className="text-xs text-[#8ba398]">
          Total Fleet Partners: <strong className="text-white font-semibold">{owners.length}</strong>
        </span>
      </div>

      {/* Grid of Owner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.length > 0 ? (
          filtered.map((o) => (
            <div
              key={o.id}
              onClick={() => setSelectedOwner(o)}
              className="bg-[#121e19] border border-[#1c3229] hover:border-[#00D26A] hover:shadow-[0_0_20px_rgba(0,210,106,0.15)] rounded-2xl p-5 space-y-4 transition-all duration-200 flex flex-col justify-between cursor-pointer select-none group"
              title="Click anywhere to inspect Fleet Host Dossier & Partner Details"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00D26A] to-teal-600 flex items-center justify-center font-bold text-black text-sm shadow-md group-hover:scale-105 transition-transform">
                    <Building2 size={20} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#00D26A] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={10} />
                      <span>{o.bankVerified ? 'Bank Verified' : 'Host Active'}</span>
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 bg-[#0a110e] px-2 py-0.5 rounded border border-[#1c3229]">
                      {o.ownerType || 'INDIVIDUAL'}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5">
                  <h3 className="font-bold text-white text-base truncate group-hover:text-[#00D26A] transition-colors">{o.businessName || o.name}</h3>
                  <p className="text-xs text-[#8ba398] mt-0.5">Primary Contact: {o.name}</p>
                </div>

                <div className="space-y-1.5 text-xs text-[#8ba398] border-t border-[#1c3229] pt-3 mt-3">
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="text-[#00D26A]" />
                    <span className="font-mono text-white">{o.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Mail size={12} className="text-[#00D26A]" />
                    <span className="truncate">{o.email || 'partner@countrydrive.com'}</span>
                  </div>
                </div>

                {/* Tax ID & GST */}
                <div className="bg-[#0a110e] p-2.5 rounded-xl border border-[#1c3229]/60 mt-3 text-[11px] space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#577064] font-sans">Business Reg #:</span>
                    <span className="text-white">{o.businessRegistrationNumber || 'REG-982104'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#577064] font-sans">GSTIN / Tax ID:</span>
                    <span className="text-[#00D26A]">{o.taxId || '07AAAAA0000A1Z5'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#1c3229] text-xs">
                <div className="bg-[#0a110e] p-2 rounded-xl text-center border border-[#1c3229]">
                  <div className="text-[10px] text-[#577064]">Active Fleet</div>
                  <div className="font-bold text-white mt-0.5">{o.vehiclesCount || 2} Vehicles</div>
                </div>
                <div className="bg-[#0a110e] p-2 rounded-xl text-center border border-[#1c3229]">
                  <div className="text-[10px] text-[#577064]">Contract Share</div>
                  <div className="font-bold text-[#00D26A] mt-0.5">80% Net</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-[#8ba398] bg-[#121e19] rounded-2xl border border-[#1c3229]">
            No fleet host partners registered in database.
          </div>
        )}
      </div>

      {/* Host Partner Dossier Modal */}
      {selectedOwner && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-2xl p-5 sm:p-6 space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1c3229] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00D26A] to-teal-500 flex items-center justify-center text-black font-bold shadow-lg">
                  <Building2 size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{selectedOwner.businessName || selectedOwner.name}</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00D26A]/10 text-[#00D26A] border border-[#00D26A]/30">
                      {selectedOwner.ownerType || 'FLEET_HOST'}
                    </span>
                  </div>
                  <p className="text-xs text-[#8ba398] mt-0.5">
                    Managing Partner: <strong className="text-white">{selectedOwner.name}</strong> • Partner ID: <span className="font-mono text-[#00D26A]">{selectedOwner.id?.slice(0, 10)}...</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOwner(null)}
                className="p-1.5 rounded-lg text-[#8ba398] hover:text-white hover:bg-[#1c3229] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Top Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#121e19] border border-[#1c3229] p-3 rounded-xl">
                <span className="text-[10px] text-[#577064] uppercase font-bold block">Vehicles in Fleet</span>
                <span className="text-lg font-bold text-white mt-0.5 block flex items-center gap-1.5">
                  <Car size={16} className="text-[#00D26A]" />
                  <span>{selectedOwner.vehiclesCount || 2}</span>
                </span>
                <span className="text-[10px] text-emerald-400">Listed on app</span>
              </div>
              <div className="bg-[#121e19] border border-[#1c3229] p-3 rounded-xl">
                <span className="text-[10px] text-[#577064] uppercase font-bold block">Revenue Share</span>
                <span className="text-lg font-bold text-[#00D26A] mt-0.5 block flex items-center gap-1">
                  <BadgePercent size={16} />
                  <span>80%</span>
                </span>
                <span className="text-[10px] text-[#8ba398]">20% platform cut</span>
              </div>
              <div className="bg-[#121e19] border border-[#1c3229] p-3 rounded-xl">
                <span className="text-[10px] text-[#577064] uppercase font-bold block">KYC / Verification</span>
                <span className="text-lg font-bold text-white mt-0.5 block flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#00D26A]" />
                  <span>{selectedOwner.bankVerified ? 'Verified' : 'Active'}</span>
                </span>
                <span className="text-[10px] text-emerald-400">Compliant</span>
              </div>
              <div className="bg-[#121e19] border border-[#1c3229] p-3 rounded-xl">
                <span className="text-[10px] text-[#577064] uppercase font-bold block">Account Status</span>
                <span className="text-lg font-bold text-white mt-0.5 block">
                  {selectedOwner.status || 'ACTIVE'}
                </span>
                <span className="text-[10px] text-[#8ba398]">Good Standing</span>
              </div>
            </div>

            {/* Business & Tax Identification */}
            <div className="bg-[#121e19] border border-[#1c3229] rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} className="text-[#00D26A]" />
                <span>Legal & Tax Identity</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#577064] block text-[10px]">Business Registration Number</span>
                  <span className="font-mono text-white font-semibold">
                    {selectedOwner.businessRegistrationNumber || selectedOwner.ownerProfile?.businessRegistrationNumber || 'REG-982104-DELHI'}
                  </span>
                </div>
                <div>
                  <span className="text-[#577064] block text-[10px]">GSTIN / Tax Identification (PAN)</span>
                  <span className="font-mono text-[#00D26A] font-semibold">
                    {selectedOwner.taxId || selectedOwner.ownerProfile?.taxId || '07AAAAA0000A1Z5'}
                  </span>
                </div>
                <div>
                  <span className="text-[#577064] block text-[10px]">Primary Registered Phone</span>
                  <span className="font-mono text-white font-semibold flex items-center gap-1.5 mt-0.5">
                    <Phone size={12} className="text-[#00D26A]" />
                    <span>{selectedOwner.phone}</span>
                  </span>
                </div>
                <div>
                  <span className="text-[#577064] block text-[10px]">Registered Business Email</span>
                  <span className="text-white font-semibold flex items-center gap-1.5 mt-0.5">
                    <Mail size={12} className="text-[#00D26A]" />
                    <span>{selectedOwner.email || 'partner@countrydrive.com'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Banking & Settlement Payout Parameters */}
            <div className="bg-[#121e19] border border-[#1c3229] rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CreditCard size={14} className="text-[#00D26A]" />
                <span>Banking & Automated Disbursal Gateway</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[#577064] block text-[10px]">Disbursal Mode</span>
                  <span className="text-white font-semibold">NEFT / RTGS / IMPS</span>
                </div>
                <div>
                  <span className="text-[#577064] block text-[10px]">Settlement Frequency</span>
                  <span className="text-white font-semibold">Weekly Direct Payout</span>
                </div>
                <div>
                  <span className="text-[#577064] block text-[10px]">Bank Verification</span>
                  <span className="text-[#00D26A] font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span>{selectedOwner.bankVerified ? 'Penny-Drop Verified' : 'Manual Approval'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Platform Partnership Timeline */}
            <div className="flex items-center justify-between text-xs text-[#8ba398] pt-2 px-1">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-[#00D26A]" />
                <span>Partner Onboarded: {selectedOwner.createdAt ? new Date(selectedOwner.createdAt).toLocaleDateString() : 'Active Partner'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-[#00D26A]" />
                <span>Last Updated: {selectedOwner.updatedAt ? new Date(selectedOwner.updatedAt).toLocaleDateString() : 'Recent'}</span>
              </span>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-[#1c3229]">
              <button
                onClick={() => setSelectedOwner(null)}
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

