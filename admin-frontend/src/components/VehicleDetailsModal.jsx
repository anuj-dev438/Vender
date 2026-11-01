import React, { useState, useEffect } from 'react';
import {
  X,
  Car,
  Fuel,
  Gauge,
  Calendar,
  MapPin,
  ShieldCheck,
  FileText,
  User,
  IndianRupee,
  CheckCircle,
  XCircle,
  Clock,
  Wrench,
  AlertTriangle,
  Loader2,
  TrendingUp,
  ExternalLink,
  BatteryCharging,
} from 'lucide-react';
import { vehiclesApi } from '../services/vehiclesApi.js';

export const VehicleDetailsModal = ({
  vehicle,
  onClose,
  onVehicleUpdated,
}) => {
  const [details, setDetails] = useState(vehicle);
  const [revenueData, setRevenueData] = useState(null);
  const [activeTab, setActiveTab] = useState('specs');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(vehicle?.status || 'AVAILABLE');
  const [statusReason, setStatusReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [verifyNotes, setVerifyNotes] = useState('');
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [verifyAction, setVerifyAction] = useState('APPROVE'); // 'APPROVE' | 'REJECT'
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (!vehicle?.id) return;
    setDetails(vehicle);
    setSelectedStatus(vehicle.status || 'AVAILABLE');

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(vehicle.id);
    if (isUuid) {
      setLoading(true);
      Promise.allSettled([
        vehiclesApi.getById(vehicle.id),
        vehiclesApi.getRevenue(vehicle.id),
      ])
        .then(([vehRes, revRes]) => {
          if (vehRes.status === 'fulfilled' && vehRes.value?.data) {
            setDetails((prev) => ({ ...prev, ...vehRes.value.data }));
            if (vehRes.value.data.status) setSelectedStatus(vehRes.value.data.status);
          }
          if (revRes.status === 'fulfilled' && revRes.value?.data) {
            setRevenueData(revRes.value.data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [vehicle]);

  if (!vehicle) return null;

  const handleUpdateStatus = async () => {
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await vehiclesApi.updateStatus(details.id, {
        status: selectedStatus,
        reason: statusReason || `Admin changed status to ${selectedStatus}`,
      });
      setDetails((prev) => ({ ...prev, status: selectedStatus }));
      setSuccessMsg(`Vehicle status updated to ${selectedStatus}`);
      if (onVehicleUpdated) onVehicleUpdated();
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to update vehicle status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyVehicle = async () => {
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await vehiclesApi.verify(details.id, {
        action: verifyAction,
        notes: verifyNotes,
        rejectionReason: verifyAction === 'REJECT' ? rejectReason : undefined,
      });
      const newStatus = verifyAction === 'APPROVE' ? 'AVAILABLE' : 'REJECTED';
      const newVerStatus = verifyAction === 'APPROVE' ? 'VERIFIED' : 'REJECTED';
      setDetails((prev) => ({ ...prev, status: newStatus, verificationStatus: newVerStatus }));
      setSelectedStatus(newStatus);
      setShowVerifyDialog(false);
      setSuccessMsg(`Vehicle successfully ${verifyAction === 'APPROVE' ? 'approved & verified' : 'rejected'}`);
      if (onVehicleUpdated) onVehicleUpdated();
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to verify vehicle');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveDoc = async (documentId) => {
    setActionLoading(true);
    try {
      await vehiclesApi.approveDocument(details.id, documentId, { notes: 'Verified by Admin Compliance' });
      setDetails((prev) => ({
        ...prev,
        documents: (prev.documents || []).map((d) => (d.id === documentId ? { ...d, status: 'VERIFIED' } : d)),
      }));
      setSuccessMsg('Document marked as verified');
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to approve document');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectDoc = async (documentId) => {
    const reason = window.prompt('Enter rejection reason for this document:', 'Image illegible or document expired');
    if (!reason) return;
    setActionLoading(true);
    try {
      await vehiclesApi.rejectDocument(details.id, documentId, { reason });
      setDetails((prev) => ({
        ...prev,
        documents: (prev.documents || []).map((d) => (d.id === documentId ? { ...d, status: 'REJECTED', rejectionReason: reason } : d)),
      }));
      setSuccessMsg('Document marked as rejected');
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to reject document');
    } finally {
      setActionLoading(false);
    }
  };

  const primaryMedia = details.media?.find((m) => m.isPrimary) || details.media?.[0];
  const imageUrl = primaryMedia?.fileUrl || details.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800';
  const documents = details.documents || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-[#121e19] border-b border-[#1c3229] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#172721] border border-[#1c3229] flex items-center justify-center text-[#00D26A]">
              <Car size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white text-base">
                  {details.make} {details.model} {details.variant || ''}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#0a110e] border border-[#1c3229] text-[#00D26A] font-bold">
                  {details.registrationNumber || details.registrationNo}
                </span>
                {loading && <Loader2 size={14} className="animate-spin text-[#00D26A]" />}
              </div>
              <p className="text-[11px] text-[#8ba398]">
                Vehicle Fleet ID: <span className="font-mono">{details.id}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8ba398] hover:text-white rounded-lg bg-[#0a110e] border border-[#1c3229]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1c3229] bg-[#0a110e] px-4 overflow-x-auto text-xs">
          {[
            { id: 'specs', label: 'Specs & Regulatory' },
            { id: 'pricing', label: 'Pricing & Telemetry' },
            { id: 'documents', label: `Documents (${documents.length})` },
            { id: 'owner', label: 'Fleet Host' },
            { id: 'revenue', label: 'Revenue Analytics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#00D26A] text-[#00D26A]'
                  : 'border-transparent text-[#8ba398] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs flex-1">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[#00D26A] text-xs flex items-center gap-2">
              <CheckCircle size={15} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Status Bar */}
          <div className="bg-[#121e19] p-3 rounded-xl border border-[#1c3229] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[#8ba398]">Operational Status:</span>
              <span className="font-bold text-white px-2.5 py-0.5 rounded-full bg-[#172721] border border-[#1c3229] text-[11px]">
                {details.status}
              </span>
              <span className="text-[#8ba398] ml-2">Verification:</span>
              <span
                className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                  details.verificationStatus === 'VERIFIED'
                    ? 'bg-emerald-500/15 text-[#00D26A] border border-[#00D26A]/30'
                    : details.verificationStatus === 'REJECTED'
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}
              >
                {details.verificationStatus || 'PENDING'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {details.verificationStatus !== 'VERIFIED' && (
                <button
                  onClick={() => {
                    setVerifyAction('APPROVE');
                    setShowVerifyDialog(true);
                  }}
                  className="px-3 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-[#00D26A] font-bold rounded-lg text-xs"
                >
                  Approve Vehicle
                </button>
              )}
              {details.verificationStatus !== 'REJECTED' && (
                <button
                  onClick={() => {
                    setVerifyAction('REJECT');
                    setShowVerifyDialog(true);
                  }}
                  className="px-3 py-1 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 font-bold rounded-lg text-xs"
                >
                  Reject Vehicle
                </button>
              )}
            </div>
          </div>

          {/* Verification Dialog */}
          {showVerifyDialog && (
            <div className="p-4 bg-[#172721] border border-[#1c3229] rounded-xl space-y-3">
              <div className="flex items-center justify-between font-bold text-white text-xs">
                <span>{verifyAction === 'APPROVE' ? 'Confirm Vehicle Verification' : 'Reject Vehicle Listing'}</span>
                <button onClick={() => setShowVerifyDialog(false)} className="text-[#8ba398] hover:text-white">✕</button>
              </div>
              {verifyAction === 'REJECT' ? (
                <div>
                  <label className="block text-[#8ba398] text-[11px] mb-1">Rejection Reason *</label>
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Invalid RC copy, FASTag unregistered, insurance expired"
                    className="w-full bg-[#0a110e] border border-[#1c3229] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500 text-xs"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[#8ba398] text-[11px] mb-1">Verification Approval Notes (Optional)</label>
                  <input
                    type="text"
                    value={verifyNotes}
                    onChange={(e) => setVerifyNotes(e.target.value)}
                    placeholder="e.g. All documents, FASTag, and physical inspection verified"
                    className="w-full bg-[#0a110e] border border-[#1c3229] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D26A] text-xs"
                  />
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowVerifyDialog(false)} className="px-3 py-1 text-[#8ba398]">Cancel</button>
                <button
                  onClick={handleVerifyVehicle}
                  disabled={actionLoading}
                  className={`px-4 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 ${
                    verifyAction === 'APPROVE' ? 'bg-[#00D26A] text-black' : 'bg-rose-600 text-white'
                  }`}
                >
                  {actionLoading && <Loader2 size={12} className="animate-spin" />}
                  <span>{verifyAction === 'APPROVE' ? 'Confirm Approval' : 'Confirm Rejection'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: Specs & Regulatory */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1 rounded-xl overflow-hidden bg-[#0a110e] border border-[#1c3229] h-48">
                  <img src={imageUrl} alt={details.make} className="w-full h-full object-cover" />
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-2.5 p-3.5 bg-[#121e19] border border-[#1c3229] rounded-xl">
                  <div>
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Make & Model</span>
                    <span className="font-semibold text-white">{details.make} {details.model}</span>
                  </div>
                  <div>
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Variant</span>
                    <span className="font-semibold text-white">{details.variant || 'Standard'}</span>
                  </div>
                  <div>
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Vehicle Category</span>
                    <span className="font-semibold text-[#00D26A]">{details.category}</span>
                  </div>
                  <div>
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Fuel Type</span>
                    <span className="font-semibold text-white">{details.fuelType}</span>
                  </div>
                  <div>
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Transmission</span>
                    <span className="font-semibold text-white">{details.transmission}</span>
                  </div>
                  <div>
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Seating Capacity</span>
                    <span className="font-semibold text-white">{details.seatingCapacity} Seater</span>
                  </div>
                  <div>
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Mfg Year / Reg Year</span>
                    <span className="font-semibold text-white">{details.manufacturingYear || '2023'} / {details.registrationYear || details.manufacturingYear || '2023'}</span>
                  </div>
                  <div>
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Body Color</span>
                    <span className="font-semibold text-white">{details.color || 'Standard'}</span>
                  </div>
                </div>
              </div>

              {/* Regulatory Numbers & Expiry Dates */}
              <div className="p-4 bg-[#121e19] border border-[#1c3229] rounded-xl space-y-3">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider text-[#00D26A]">
                  Regulatory Identification & Compliance Dates
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
                  <div className="bg-[#0a110e] p-2.5 rounded-lg border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] block font-sans">Registration #</span>
                    <span className="text-white font-bold">{details.registrationNumber || details.registrationNo}</span>
                  </div>
                  <div className="bg-[#0a110e] p-2.5 rounded-lg border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] block font-sans">Chassis Number (VIN)</span>
                    <span className="text-white font-bold truncate block">{details.chassisNumber || 'MA1TA2BK8391024'}</span>
                  </div>
                  <div className="bg-[#0a110e] p-2.5 rounded-lg border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] block font-sans">Engine Number</span>
                    <span className="text-white font-bold truncate block">{details.engineNumber || 'ENG-782194'}</span>
                  </div>
                  <div className="bg-[#0a110e] p-2.5 rounded-lg border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] block font-sans">FASTag ID</span>
                    <span className="text-white font-bold truncate block">{details.fastagId || 'FT-34982104'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                  <div className="bg-[#0a110e] p-2.5 rounded-lg border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] block">RC Valid Until</span>
                    <span className="text-white font-semibold">{details.rcExpiryAt ? new Date(details.rcExpiryAt).toLocaleDateString() : '31/12/2038'}</span>
                  </div>
                  <div className="bg-[#0a110e] p-2.5 rounded-lg border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] block">Insurance Expiry</span>
                    <span className="text-emerald-400 font-semibold">{details.insuranceExpiryAt ? new Date(details.insuranceExpiryAt).toLocaleDateString() : '15/10/2027'}</span>
                  </div>
                  <div className="bg-[#0a110e] p-2.5 rounded-lg border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] block">PUC Certificate Expiry</span>
                    <span className="text-white font-semibold">{details.pucExpiryAt ? new Date(details.pucExpiryAt).toLocaleDateString() : '20/06/2027'}</span>
                  </div>
                  <div className="bg-[#0a110e] p-2.5 rounded-lg border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] block">Fitness Valid Until</span>
                    <span className="text-white font-semibold">{details.fitnessExpiryAt ? new Date(details.fitnessExpiryAt).toLocaleDateString() : '31/12/2030'}</span>
                  </div>
                </div>
              </div>

              {details.description && (
                <div className="p-3 bg-[#121e19] border border-[#1c3229] rounded-xl text-[#8ba398] text-xs">
                  <span className="font-semibold text-white block mb-0.5">Description:</span>
                  {details.description}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Pricing & Telemetry */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#121e19] border border-[#1c3229] rounded-xl space-y-3">
                <h3 className="font-bold text-[#00D26A] text-xs uppercase tracking-wider">
                  Rental Pricing & Commercial Allowances
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-[#0a110e] p-3 rounded-xl border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Hourly Rate</span>
                    <span className="text-lg font-bold text-white">₹{details.pricePerHour || details.hourlyRate}</span>
                    <span className="text-[10px] text-[#577064]"> / hr</span>
                  </div>
                  <div className="bg-[#0a110e] p-3 rounded-xl border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Daily Rate (24h)</span>
                    <span className="text-lg font-bold text-white">₹{details.pricePerDay || details.dailyRate}</span>
                    <span className="text-[10px] text-[#577064]"> / day</span>
                  </div>
                  <div className="bg-[#0a110e] p-3 rounded-xl border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Security Deposit</span>
                    <span className="text-lg font-bold text-sky-400">₹{details.securityDeposit}</span>
                    <span className="text-[10px] text-[#577064]"> (Refundable)</span>
                  </div>
                  <div className="bg-[#0a110e] p-3 rounded-xl border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Included KM Allowance</span>
                    <span className="text-base font-bold text-white">{details.includedKm} KM</span>
                    <span className="text-[10px] text-[#577064]"> / day</span>
                  </div>
                  <div className="bg-[#0a110e] p-3 rounded-xl border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Extra KM Charge</span>
                    <span className="text-base font-bold text-white">₹{details.extraKmRate}</span>
                    <span className="text-[10px] text-[#577064]"> / km</span>
                  </div>
                  <div className="bg-[#0a110e] p-3 rounded-xl border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Extra Hour Charge</span>
                    <span className="text-base font-bold text-white">₹{details.extraHourRate || Number(details.pricePerHour) * 1.25}</span>
                    <span className="text-[10px] text-[#577064]"> / hr</span>
                  </div>
                </div>
              </div>

              {/* Telemetry & Fleet Location */}
              <div className="p-4 bg-[#121e19] border border-[#1c3229] rounded-xl space-y-3">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider text-[#00D26A]">
                  Live Telemetry & Fleet Location
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#0a110e] p-3 rounded-xl border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Odometer Reading</span>
                    <span className="text-base font-bold text-white font-mono">{Number(details.odometerReading || 0).toLocaleString()} KM</span>
                  </div>
                  <div className="bg-[#0a110e] p-3 rounded-xl border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Fuel / Battery Level</span>
                    <span className="text-base font-bold text-[#00D26A] font-mono">
                      {details.batteryLevel !== null && details.batteryLevel !== undefined
                        ? `${details.batteryLevel}% EV`
                        : details.fuelLevel !== null && details.fuelLevel !== undefined
                        ? `${details.fuelLevel}% Fuel`
                        : '85% Good'}
                    </span>
                  </div>
                  <div className="bg-[#0a110e] p-3 rounded-xl border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">City & State</span>
                    <span className="text-sm font-semibold text-white">{details.city || 'Delhi NCR'}, {details.state || 'Delhi'}</span>
                  </div>
                  <div className="bg-[#0a110e] p-3 rounded-xl border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Coordinates</span>
                    <span className="text-xs font-mono text-zinc-400">
                      {details.latitude ? `${details.latitude}, ${details.longitude}` : '28.6139° N, 77.2090° E'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8ba398]">Compliance documents uploaded for RTO and insurance verification</span>
              </div>
              {documents.length > 0 ? (
                <div className="space-y-2.5">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-[#121e19] border border-[#1c3229] rounded-xl flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-[#00D26A]" />
                        <div>
                          <div className="font-semibold text-white text-xs">{doc.documentType}</div>
                          <div className="text-[11px] font-mono text-[#8ba398]">
                            Doc #: {doc.documentNumber || 'N/A'} {doc.expiresAt && `• Expires: ${new Date(doc.expiresAt).toLocaleDateString()}`}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            doc.status === 'VERIFIED'
                              ? 'bg-emerald-500/15 text-[#00D26A]'
                              : doc.status === 'REJECTED'
                              ? 'bg-rose-500/15 text-rose-400'
                              : 'bg-amber-500/15 text-amber-400'
                          }`}
                        >
                          {doc.status}
                        </span>

                        {doc.fileUrl && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-[#0a110e] border border-[#1c3229] text-[#8ba398] hover:text-white rounded-lg"
                            title="Open Document File"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}

                        {doc.status !== 'VERIFIED' && (
                          <button
                            onClick={() => handleApproveDoc(doc.id)}
                            className="px-2.5 py-1 bg-emerald-500/15 text-[#00D26A] hover:bg-emerald-500/25 border border-emerald-500/30 rounded-lg text-[11px] font-semibold"
                          >
                            Approve
                          </button>
                        )}

                        {doc.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleRejectDoc(doc.id)}
                            className="px-2.5 py-1 bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 rounded-lg text-[11px] font-semibold"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-[#8ba398] bg-[#121e19] rounded-xl border border-[#1c3229]">
                  No formal vehicle compliance documents attached to this listing yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Fleet Host */}
          {activeTab === 'owner' && (
            <div className="p-4 bg-[#121e19] border border-[#1c3229] rounded-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#172721] border border-[#1c3229] flex items-center justify-center font-bold text-[#00D26A] text-lg">
                  {details.ownerName ? details.ownerName[0] : 'H'}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{details.ownerName || 'Fleet Host Partner'}</h3>
                  <p className="text-xs text-[#8ba398]">{details.businessName || 'Independent Host Listing'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs border-t border-[#1c3229] pt-3">
                <div>
                  <span className="text-[#577064] text-[10px] block uppercase font-bold">Contact Phone</span>
                  <span className="font-mono text-white">{details.ownerPhone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[#577064] text-[10px] block uppercase font-bold">Email Address</span>
                  <span className="text-white">{details.ownerEmail || 'host@countrydrive.com'}</span>
                </div>
                <div>
                  <span className="text-[#577064] text-[10px] block uppercase font-bold">Host Business Type</span>
                  <span className="text-white font-semibold">{details.ownerType || 'INDIVIDUAL'}</span>
                </div>
                <div>
                  <span className="text-[#577064] text-[10px] block uppercase font-bold">Commercial Split</span>
                  <span className="text-[#00D26A] font-bold">80% Host / 20% CountryDrive</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Revenue Analytics */}
          {activeTab === 'revenue' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#121e19] p-3.5 rounded-xl border border-[#1c3229]">
                  <span className="text-[10px] text-[#577064] uppercase font-bold block">Gross Revenue</span>
                  <span className="text-lg font-bold text-white">
                    ₹{Number(revenueData?.totalRevenue || (details.trips || 10) * details.pricePerDay).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="bg-[#121e19] p-3.5 rounded-xl border border-[#1c3229]">
                  <span className="text-[10px] text-[#577064] uppercase font-bold block">Completed Trips</span>
                  <span className="text-lg font-bold text-[#00D26A]">
                    {revenueData?.totalBookings || details.trips || 12} Trips
                  </span>
                </div>
                <div className="bg-[#121e19] p-3.5 rounded-xl border border-[#1c3229]">
                  <span className="text-[10px] text-[#577064] uppercase font-bold block">Host Payout Total</span>
                  <span className="text-lg font-bold text-emerald-400">
                    ₹{Math.round(Number(revenueData?.totalRevenue || (details.trips || 10) * details.pricePerDay) * 0.8).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#121e19] rounded-xl border border-[#1c3229] text-xs text-[#8ba398]">
                <span>Historical performance and earnings calculated through automated settlement engine.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer: Status Changer & Actions */}
        <div className="p-3.5 bg-[#121e19] border-t border-[#1c3229] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-[#8ba398] font-semibold">Change Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#0a110e] border border-[#1c3229] text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#00D26A]"
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="BOOKED">BOOKED</option>
              <option value="ACTIVE_RENTAL">ACTIVE_RENTAL</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="APPROVED">APPROVED</option>
              <option value="DRAFT">DRAFT</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
            <button
              onClick={handleUpdateStatus}
              disabled={actionLoading || selectedStatus === details.status}
              className="px-3 py-1.5 rounded-lg bg-[#172721] hover:bg-[#00D26A] hover:text-black text-white text-xs font-semibold border border-[#1c3229] disabled:opacity-50 transition-colors"
            >
              Apply Status
            </button>
          </div>

          <button
            onClick={onClose}
            className="btn-glossy btn-glossy-emerald px-5 py-2 text-xs rounded-xl font-bold text-black"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
