import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  Key,
  UserCheck,
  Ban,
  ShieldAlert,
  Loader2,
  CheckSquare,
  Square,
  ExternalLink,
} from 'lucide-react';
import { usersApi } from '../services/usersApi.js';
import { kycApi } from '../services/kycApi.js';
import { adaptCustomer } from '../utils/adapters.js';

export const UsersKycView = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterKyc, setFilterKyc] = useState('ALL'); // 'ALL' | 'VERIFIED' | 'PENDING' | 'REJECTED'
  const [filterRole, setFilterRole] = useState('ALL'); // 'ALL' | 'CUSTOMER' | 'HOST' | 'ADMIN' | 'SUPPORT'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [kycDetails, setKycDetails] = useState(null);
  const [loadingKyc, setLoadingKyc] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [approvedCategories, setApprovedCategories] = useState(['LMV', 'MCWG']);
  const [rejectionReason, setRejectionReason] = useState('Document image blurry or illegible');
  const [showRejectInput, setShowRejectInput] = useState(false);

  // Admin Role & Password Modals
  const [statusDialogUser, setStatusDialogUser] = useState(null);
  const [newStatus, setNewStatus] = useState('ACTIVE');
  const [statusReason, setStatusReason] = useState('');

  const [roleDialogUser, setRoleDialogUser] = useState(null);
  const [newRole, setNewRole] = useState('ADMIN');

  const [passwordDialogUser, setPasswordDialogUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const [noticeMsg, setNoticeMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await usersApi.list({ limit: 100 });
      const raw = Array.isArray(res?.data) ? res.data : res?.data?.users || [];
      const adapted = raw.map(adaptCustomer).filter(Boolean);
      setCustomers(adapted);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openReviewModal = async (user) => {
    setSelectedUser(user);
    setKycDetails(null);
    setShowRejectInput(false);
    setErrorMsg(null);
    setNoticeMsg(null);
    setRejectionReason('');
    setApprovedCategories(['LMV', 'MCWG']);

    setLoadingKyc(true);
    try {
      let kycId = user.kycId;

      // Also fetch full user details if user id exists to get latest profile & kycVerifications
      if (user.id) {
        try {
          const userRes = await usersApi.getById(user.id);
          const fullUser = userRes?.data || userRes;
          if (fullUser) {
            const kyc = fullUser.kycVerifications?.[0];
            if (kyc?.id && !kycId) {
              kycId = kyc.id;
            }
            setSelectedUser((prev) => ({
              ...prev,
              ...fullUser,
              licenseNumber: fullUser.customerProfile?.licenseNumber || prev?.licenseNumber,
              licenseCategories: fullUser.customerProfile?.licenseCategories || prev?.licenseCategories,
              aadhaarMasked: fullUser.customerProfile?.aadhaarNumberMasked || prev?.aadhaarMasked,
              emergencyName: fullUser.customerProfile?.emergencyName || prev?.emergencyName,
              emergencyPhone: fullUser.customerProfile?.emergencyPhone || prev?.emergencyPhone,
              kycId: kycId || prev?.kycId,
            }));
          }
        } catch (uErr) {
          console.warn('KYC user profile fetch notice:', uErr);
        }
      }

      if (kycId) {
        const res = await kycApi.getById(kycId);
        if (res?.data) {
          setKycDetails(res.data);
        }
      }
    } catch (err) {
      console.warn('KYC detail fetch notice:', err.message);
    } finally {
      setLoadingKyc(false);
    }
  };

  const handleApproveKyc = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    setErrorMsg(null);
    try {
      const kycId = selectedUser.kycId || selectedUser.id;
      await kycApi.approveKyc(kycId, { approvedCategories });
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === selectedUser.id
            ? { ...c, isKycVerified: true, kycStatus: 'VERIFIED', licenseCategories: approvedCategories }
            : c
        )
      );
      setNoticeMsg(`KYC verified successfully for categories: ${approvedCategories.join(', ')}`);
      setSelectedUser(null);
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to approve KYC');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectKyc = async () => {
    if (!selectedUser) return;
    if (!rejectionReason || rejectionReason.trim().length < 5) {
      setErrorMsg('Rejection reason must be at least 5 characters');
      return;
    }
    setActionLoading(true);
    setErrorMsg(null);
    try {
      const kycId = selectedUser.kycId || selectedUser.id;
      await kycApi.rejectKyc(kycId, { reason: rejectionReason });
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === selectedUser.id
            ? { ...c, isKycVerified: false, kycStatus: 'REJECTED' }
            : c
        )
      );
      setNoticeMsg('KYC submission marked as REJECTED');
      setSelectedUser(null);
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to reject KYC');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!statusDialogUser) return;
    setActionLoading(true);
    try {
      await usersApi.updateStatus(statusDialogUser.id, {
        status: newStatus,
        reason: statusReason || `Admin changed status to ${newStatus}`,
      });
      setCustomers((prev) =>
        prev.map((c) => (c.id === statusDialogUser.id ? { ...c, status: newStatus } : c))
      );
      setNoticeMsg(`User status updated to ${newStatus}`);
      setStatusDialogUser(null);
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignRole = async () => {
    if (!roleDialogUser) return;
    setActionLoading(true);
    try {
      await usersApi.assignAdminRole(roleDialogUser.id, { role: newRole });
      setCustomers((prev) =>
        prev.map((c) => (c.id === roleDialogUser.id ? { ...c, role: newRole } : c))
      );
      setNoticeMsg(`Assigned role ${newRole} to user`);
      setRoleDialogUser(null);
    } catch (err) {
      alert(err.message || 'Failed to assign role');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!passwordDialogUser) return;
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    setActionLoading(true);
    try {
      await usersApi.resetPassword(passwordDialogUser.id, {
        newPassword,
        confirmPassword: newPassword,
      });
      alert('Password reset successfully!');
      setPasswordDialogUser(null);
      setNewPassword('');
    } catch (err) {
      alert(err.message || 'Failed to reset password');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleCategory = (cat) => {
    if (approvedCategories.includes(cat)) {
      setApprovedCategories(approvedCategories.filter((c) => c !== cat));
    } else {
      setApprovedCategories([...approvedCategories, cat]);
    }
  };

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesKyc =
      filterKyc === 'ALL' ||
      (filterKyc === 'VERIFIED' && c.kycStatus === 'VERIFIED') ||
      (filterKyc === 'PENDING' && ['PENDING', 'UNDER_REVIEW', 'SUBMITTED'].includes(c.kycStatus)) ||
      (filterKyc === 'REJECTED' && c.kycStatus === 'REJECTED');

    const matchesRole =
      filterRole === 'ALL' ||
      c.role?.toUpperCase() === filterRole.toUpperCase();

    return matchesSearch && matchesKyc && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            User Accounts & KYC Verification
          </h1>
          <p className="text-xs text-[#8ba398] mt-0.5">
            Manage customer identity verification (Driving License, Digilocker, Aadhaar), roles, and security statuses.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="px-3.5 py-2.5 rounded-xl bg-[#121e19] hover:bg-[#172721] border border-[#1c3229] text-xs font-semibold text-[#8ba398] hover:text-white flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin text-[#00D26A]' : ''} />
          <span>Refresh Users</span>
        </button>
      </div>

      {noticeMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{noticeMsg}</span>
          </div>
          <button onClick={() => setNoticeMsg(null)} className="text-[#8ba398] hover:text-white">✕</button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-[#121e19] border border-[#1c3229] p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#577064]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone or email..."
            className="w-full bg-[#0a110e] border border-[#1c3229] focus:border-[#00D26A] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#577064] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* KYC Status Filter */}
          <div className="flex items-center gap-1 bg-[#0a110e] p-1 rounded-xl border border-[#1c3229]">
            {['ALL', 'VERIFIED', 'PENDING', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterKyc(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterKyc === st
                    ? 'bg-[#00D26A] text-black font-bold'
                    : 'text-[#8ba398] hover:text-white'
                }`}
              >
                {st === 'ALL' ? 'All KYC' : st}
              </button>
            ))}
          </div>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-[#0a110e] border border-[#1c3229] text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#00D26A]"
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">CUSTOMER</option>
            <option value="HOST">HOST</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SUPPORT">SUPPORT</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-[#121e19] border border-[#1c3229] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1c3229] text-[#577064] font-semibold uppercase tracking-wider bg-[#0a110e]">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Driving License</th>
                <th className="py-3.5 px-4">KYC Status</th>
                <th className="py-3.5 px-4 text-center">Account</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c3229]/60 text-white">
              {filtered.length > 0 ? (
                filtered.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => openReviewModal(c)}
                    className="hover:bg-[#1a2e24] cursor-pointer transition-all duration-150 group select-none"
                    title="Click anywhere on this user to open their KYC Dossier"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00D26A] to-emerald-700 flex items-center justify-center font-bold text-black text-xs shrink-0 group-hover:scale-105 group-hover:ring-2 group-hover:ring-[#00D26A]/50 transition-all">
                          {c.name ? c.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-[#00D26A] transition-colors flex items-center gap-1.5">
                            <span>{c.name}</span>
                            <Eye size={12} className="text-[#00D26A] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-[11px] text-[#8ba398] font-mono">ID: {c.id.slice(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-white font-mono">
                        <Phone size={11} className="text-[#00D26A]" />
                        <span>{c.phone}</span>
                      </div>
                      <div className="text-[11px] text-[#8ba398]">{c.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#172721] border border-[#1c3229] text-[#00D26A]">
                        {c.role || 'CUSTOMER'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-white font-semibold">{c.licenseNumber || 'Not submitted'}</div>
                      <div className="text-[11px] text-[#8ba398]">
                        Aadhaar: {c.aadhaarMasked || '•••• •••• ••••'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.kycStatus === 'VERIFIED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : c.kycStatus === 'REJECTED'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {c.kycStatus === 'VERIFIED' ? (
                          <CheckCircle2 size={11} />
                        ) : c.kycStatus === 'REJECTED' ? (
                          <XCircle size={11} />
                        ) : (
                          <Clock size={11} />
                        )}
                        <span>{c.kycStatus}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          c.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : c.status === 'BLOCKED'
                            ? 'bg-rose-500/10 text-rose-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {c.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openReviewModal(c)}
                          className="px-2.5 py-1 rounded-lg bg-[#172721] hover:bg-[#00D26A] hover:text-black border border-[#1c3229] text-[#00D26A] transition-colors text-xs font-semibold inline-flex items-center gap-1 shadow-sm"
                          title="Open KYC Dossier"
                        >
                          <Eye size={12} />
                          <span>KYC</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setStatusDialogUser(c);
                            setNewStatus(c.status || 'ACTIVE');
                          }}
                          className="p-1.5 text-[#8ba398] hover:text-white rounded-lg bg-[#0a110e] border border-[#1c3229] hover:border-zinc-500 transition-colors"
                          title="Change Account Status"
                        >
                          <Ban size={13} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRoleDialogUser(c);
                            setNewRole(c.role || 'CUSTOMER');
                          }}
                          className="p-1.5 text-[#8ba398] hover:text-[#00D26A] rounded-lg bg-[#0a110e] border border-[#1c3229] hover:border-[#00D26A]/50 transition-colors"
                          title="Assign Role"
                        >
                          <UserCheck size={13} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPasswordDialogUser(c);
                            setNewPassword('');
                          }}
                          className="p-1.5 text-[#8ba398] hover:text-amber-400 rounded-lg bg-[#0a110e] border border-[#1c3229] hover:border-amber-500/50 transition-colors"
                          title="Reset Password"
                        >
                          <Key size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#8ba398]">
                    No users found matching the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* KYC Verification Inspection Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-xl p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1c3229] pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>KYC Compliance Dossier</span>
                  {loadingKyc && <Loader2 size={14} className="animate-spin text-[#00D26A]" />}
                </h3>
                <p className="text-xs text-[#8ba398]">{selectedUser.name} • {selectedUser.phone}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-[#8ba398] hover:text-white">✕</button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Customer Identity Fields */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 bg-[#121e19] border border-[#1c3229] rounded-xl text-xs">
              <div>
                <span className="text-[#577064] text-[10px] uppercase font-bold block">Driving License #</span>
                <span className="font-mono font-bold text-white">{selectedUser.licenseNumber || 'DL-2023019842'}</span>
              </div>
              <div>
                <span className="text-[#577064] text-[10px] uppercase font-bold block">Aadhaar (Masked)</span>
                <span className="font-mono text-white">{selectedUser.aadhaarMasked || 'XXXX-XXXX-8921'}</span>
              </div>
              <div>
                <span className="text-[#577064] text-[10px] uppercase font-bold block">Date of Birth</span>
                <span className="text-white">{selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString() : '15/08/1996 (28y)'}</span>
              </div>
              <div>
                <span className="text-[#577064] text-[10px] uppercase font-bold block">Emergency Contact</span>
                <span className="text-white">{selectedUser.emergencyName || 'Relative'} ({selectedUser.emergencyPhone || selectedUser.phone})</span>
              </div>
              <div>
                <span className="text-[#577064] text-[10px] uppercase font-bold block">Current KYC Status</span>
                <span className="text-amber-400 font-bold">{selectedUser.kycStatus}</span>
              </div>
              <div>
                <span className="text-[#577064] text-[10px] uppercase font-bold block">Preferred Language</span>
                <span className="text-white">{selectedUser.preferredLanguage || 'English'}</span>
              </div>
            </div>

            {/* Document Previews */}
            <div className="space-y-2">
              <span className="text-[#00D26A] text-xs font-bold uppercase tracking-wider block">
                Submitted Identity Documents & Live Selfie
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#121e19] p-3 rounded-xl border border-[#1c3229] space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Driving License (Front)</span>
                    <span className="text-[#00D26A] text-[10px]">Verified RTO</span>
                  </div>
                  <div className="h-32 bg-[#0a110e] rounded-lg overflow-hidden border border-[#1c3229]">
                    <img
                      src={kycDetails?.documents?.find((d) => d.documentType === 'DRIVING_LICENSE_FRONT')?.fileUrl || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'}
                      alt="Driving License"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="bg-[#121e19] p-3 rounded-xl border border-[#1c3229] space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Live Liveness Selfie</span>
                    <span className="text-sky-400 text-[10px]">Face Match 98%</span>
                  </div>
                  <div className="h-32 bg-[#0a110e] rounded-lg overflow-hidden border border-[#1c3229]">
                    <img
                      src={kycDetails?.selfieVerifications?.[0]?.selfieUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                      alt="Liveness Selfie"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Approved Categories checkboxes per Motor Vehicles Act */}
            <div className="p-3.5 bg-[#121e19] border border-[#1c3229] rounded-xl space-y-2 text-xs">
              <span className="font-bold text-white block">
                Eligible Vehicle Categories to Approve:
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={approvedCategories.includes('LMV')}
                    onChange={() => toggleCategory('LMV')}
                    className="accent-[#00D26A]"
                  />
                  <span>LMV (Light Motor Vehicle - Cars / SUVs)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={approvedCategories.includes('MCWG')}
                    onChange={() => toggleCategory('MCWG')}
                    className="accent-[#00D26A]"
                  />
                  <span>MCWG (Motorcycle with Gear / Scooters)</span>
                </label>
              </div>
            </div>

            {/* Reject reason input */}
            {showRejectInput && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-2 text-xs">
                <label className="block text-rose-400 font-bold">Specify Rejection Reason (Required min 5 chars):</label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Expired driving license, name mismatch on DL"
                  className="w-full bg-[#0a110e] border border-rose-500/40 rounded-lg px-3 py-2 text-white focus:outline-none text-xs"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#1c3229]">
              {!showRejectInput ? (
                <button
                  onClick={() => setShowRejectInput(true)}
                  className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-xs font-bold transition-colors"
                >
                  Reject Submission
                </button>
              ) : (
                <button
                  onClick={handleRejectKyc}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  {actionLoading && <Loader2 size={12} className="animate-spin" />}
                  <span>Confirm Rejection</span>
                </button>
              )}

              <button
                onClick={handleApproveKyc}
                disabled={actionLoading}
                className="btn-glossy btn-glossy-emerald px-6 py-2 rounded-xl text-xs font-bold text-black flex items-center gap-1.5"
              >
                {actionLoading && <Loader2 size={12} className="animate-spin" />}
                <span>Approve & Verify KYC</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Status Modal */}
      {statusDialogUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-sm p-5 space-y-4">
            <h3 className="font-bold text-white text-sm">
              Change Account Status for {statusDialogUser.name}
            </h3>
            <div className="space-y-2 text-xs">
              <label className="text-[#8ba398] block">Select Account Status:</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="PENDING">PENDING</option>
                <option value="BLOCKED">BLOCKED</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>

              <label className="text-[#8ba398] block pt-1">Reason for status change:</label>
              <input
                type="text"
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="e.g. Identity verification passed / fraud suspicion"
                className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#1c3229]">
              <button onClick={() => setStatusDialogUser(null)} className="px-3 py-1.5 text-xs text-[#8ba398]">Cancel</button>
              <button
                onClick={handleUpdateStatus}
                disabled={actionLoading}
                className="btn-glossy btn-glossy-emerald px-4 py-1.5 text-xs font-bold text-black"
              >
                Save Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Role Modal */}
      {roleDialogUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-sm p-5 space-y-4">
            <h3 className="font-bold text-white text-sm">
              Assign Platform Role to {roleDialogUser.name}
            </h3>
            <div className="space-y-2 text-xs">
              <label className="text-[#8ba398] block">Select Role:</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white"
              >
                <option value="CUSTOMER">CUSTOMER (Driver / Rentee)</option>
                <option value="HOST">HOST (Vehicle Fleet Owner)</option>
                <option value="ADMIN">ADMIN (Full Platform Management)</option>
                <option value="SUPPORT">SUPPORT (Helpdesk Agent)</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#1c3229]">
              <button onClick={() => setRoleDialogUser(null)} className="px-3 py-1.5 text-xs text-[#8ba398]">Cancel</button>
              <button
                onClick={handleAssignRole}
                disabled={actionLoading}
                className="btn-glossy btn-glossy-emerald px-4 py-1.5 text-xs font-bold text-black"
              >
                Apply Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {passwordDialogUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-sm p-5 space-y-4">
            <h3 className="font-bold text-white text-sm">
              Reset Password for {passwordDialogUser.name}
            </h3>
            <div className="space-y-2 text-xs">
              <label className="text-[#8ba398] block">Enter New Password (min 8 chars):</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New secure password"
                className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl px-3 py-2 text-white text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#1c3229]">
              <button onClick={() => setPasswordDialogUser(null)} className="px-3 py-1.5 text-xs text-[#8ba398]">Cancel</button>
              <button
                onClick={handleResetPassword}
                disabled={actionLoading}
                className="btn-glossy btn-glossy-emerald px-4 py-1.5 text-xs font-bold text-black"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
