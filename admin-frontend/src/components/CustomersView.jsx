import React, { useState, useEffect } from 'react';
import {
  Search,
  UserCheck,
  Shield,
  Phone,
  Mail,
  Award,
  Ban,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { usersApi } from '../services/usersApi.js';
import { adaptCustomer } from '../utils/adapters.js';

export const CustomersView = ({ customers: initialCustomers }) => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(!initialCustomers);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await usersApi.getCustomers({ limit: 100 });
      const raw = Array.isArray(res?.data) ? res.data : res?.data?.users || res?.data?.customers || [];
      setCustomers(raw.map(adaptCustomer).filter(Boolean));
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialCustomers && initialCustomers.length > 0) {
      setCustomers(initialCustomers);
    } else {
      fetchCustomers();
    }
  }, [initialCustomers]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Registered Customers & Drivers
          </h1>
          <p className="text-xs text-[#8ba398] mt-0.5">
            Full Prisma profile parity: verified driving licenses, Digilocker status, booking history, and driver accounts.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          className="px-3.5 py-2.5 rounded-xl bg-[#121e19] hover:bg-[#172721] border border-[#1c3229] text-xs font-semibold text-[#8ba398] hover:text-white flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin text-[#00D26A]' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#121e19] border border-[#1c3229] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3 top-3 text-[#577064]" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a110e] border border-[#1c3229] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#577064] focus:outline-none focus:border-[#00D26A]"
          />
        </div>
        <span className="text-xs text-[#8ba398]">
          Total Registered Drivers: <strong className="text-white font-semibold">{customers.length}</strong>
        </span>
      </div>

      {/* Grid of Customer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedCustomer(c)}
            className="bg-[#121e19] border border-[#1c3229] rounded-2xl p-4 space-y-3.5 hover:border-[#00D26A]/60 hover:bg-[#14231d] cursor-pointer transition-all duration-150 group flex flex-col justify-between select-none shadow-md"
            title="Click to view Customer KYC & Driver Profile"
          >
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00D26A] to-emerald-700 flex items-center justify-center font-bold text-black text-sm shrink-0 ring-2 ring-[#00D26A]/30 group-hover:scale-105 transition-transform">
                  {c.name ? c.name[0].toUpperCase() : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate flex items-center gap-1.5 group-hover:text-[#00D26A] transition-colors">
                    <span>{c.name}</span>
                    {c.isKycVerified && (
                      <span title="KYC Verified Driver">
                        <CheckCircle2 size={13} className="text-[#00D26A]" />
                      </span>
                    )}
                  </h3>
                  <span className="text-[10px] text-[#577064] font-mono block truncate">{c.id}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-[#8ba398] border-t border-[#1c3229] pt-3 mt-3">
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-[#00D26A] shrink-0" />
                  <span className="truncate">{c.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-[#00D26A] shrink-0" />
                  <span className="font-mono text-white">{c.phone}</span>
                </div>
              </div>

              {/* Driving License block */}
              <div className="bg-[#0a110e] p-2 rounded-xl border border-[#1c3229]/60 mt-3 text-[11px] space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-[#577064]">Driving License:</span>
                  <span className="font-mono text-white font-semibold">{c.licenseNumber || 'Not submitted'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#577064]">KYC Status:</span>
                  <span
                    className={`font-bold inline-flex items-center gap-1 ${
                      c.kycStatus === 'VERIFIED'
                        ? 'text-[#00D26A]'
                        : c.kycStatus === 'REJECTED'
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {c.kycStatus === 'VERIFIED' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                    <span>{c.kycStatus}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1c3229] text-xs">
              <div>
                <p className="text-[10px] text-[#577064]">Status</p>
                <p className="font-semibold text-white">{c.status || 'ACTIVE'}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#00D26A] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                  <Eye size={11} /> KYC
                </span>
                <p className="font-semibold text-[#00D26A] text-right">
                  {c.bookingsCount || 0} trips
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* KYC / Customer Dossier Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-xl p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1c3229] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00D26A] to-emerald-700 flex items-center justify-center font-bold text-black text-sm">
                  {selectedCustomer.name ? selectedCustomer.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <span>{selectedCustomer.name}</span>
                    {selectedCustomer.isKycVerified && <CheckCircle2 size={14} className="text-[#00D26A]" />}
                  </h3>
                  <p className="text-xs text-[#8ba398]">{selectedCustomer.phone} • {selectedCustomer.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-[#8ba398] hover:text-white">✕</button>
            </div>

            {/* KYC & Identity Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 bg-[#121e19] border border-[#1c3229] rounded-xl text-xs">
              <div>
                <span className="text-[#577064] text-[10px] uppercase font-bold block">Driving License</span>
                <span className="font-mono font-bold text-white">{selectedCustomer.licenseNumber || 'Not submitted'}</span>
              </div>
              <div>
                <span className="text-[#577064] text-[10px] uppercase font-bold block">Aadhaar (Masked)</span>
                <span className="font-mono text-white">{selectedCustomer.aadhaarMasked || '•••• •••• ••••'}</span>
              </div>
              <div>
                <span className="text-[#577064] text-[10px] uppercase font-bold block">KYC Status</span>
                <span className={`font-bold ${selectedCustomer.kycStatus === 'VERIFIED' ? 'text-[#00D26A]' : selectedCustomer.kycStatus === 'REJECTED' ? 'text-rose-400' : 'text-amber-400'}`}>
                  {selectedCustomer.kycStatus}
                </span>
              </div>
              <div>
                <span className="text-[#577064] text-[10px] uppercase font-bold block">Emergency Contact</span>
                <span className="text-white">{selectedCustomer.emergencyName || 'N/A'} ({selectedCustomer.emergencyPhone || '—'})</span>
              </div>
              <div>
                <span className="text-[#577064] text-[10px] uppercase font-bold block">Total Completed Rides</span>
                <span className="font-bold text-[#00D26A] font-mono">{selectedCustomer.bookingsCount || 0}</span>
              </div>
              <div>
                <span className="text-[#577064] text-[10px] uppercase font-bold block">Account Status</span>
                <span className="text-white font-semibold">{selectedCustomer.status || 'ACTIVE'}</span>
              </div>
            </div>

            {/* License & Selfie Preview */}
            <div className="space-y-2">
              <span className="text-[#00D26A] text-xs font-bold uppercase tracking-wider block">
                Verification Documents
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#121e19] p-3 rounded-xl border border-[#1c3229] space-y-1.5">
                  <span className="text-xs font-bold text-white block">Driving License</span>
                  <div className="h-32 bg-[#0a110e] rounded-lg overflow-hidden border border-[#1c3229]">
                    <img
                      src="https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80"
                      alt="Driving License"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="bg-[#121e19] p-3 rounded-xl border border-[#1c3229] space-y-1.5">
                  <span className="text-xs font-bold text-white block">Liveness Selfie</span>
                  <div className="h-32 bg-[#0a110e] rounded-lg overflow-hidden border border-[#1c3229]">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                      alt="Selfie"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#1c3229]">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="btn-glossy btn-glossy-emerald px-6 py-1.5 text-xs rounded-xl font-bold text-black"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
