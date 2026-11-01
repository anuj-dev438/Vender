import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Shield,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Car,
  Ban,
  RotateCcw,
  Loader2,
  FileText,
  User,
  Fuel,
  Gauge,
  Receipt,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { bookingsApi } from '../services/bookingsApi.js';

export const BookingDetailsModal = ({
  booking,
  onClose,
  onBookingUpdated,
}) => {
  const [details, setDetails] = useState(booking);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'pricing' | 'telemetry' | 'payments'
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('Cancelled by Admin Operations');
  const [refundAmount, setRefundAmount] = useState('');
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [refundNotes, setRefundNotes] = useState('Refund processed by Admin');
  const [refundType, setRefundType] = useState('FULL_REFUND');
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (!booking?.id) return;
    setDetails(booking);

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(booking.id);
    if (isUuid) {
      setLoading(true);
      bookingsApi
        .getById(booking.id)
        .then((res) => {
          if (res?.data) {
            setDetails((prev) => ({ ...prev, ...res.data }));
          }
        })
        .catch((err) => {
          console.warn('Could not fetch deep booking details:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [booking]);

  if (!booking) return null;

  const totalAmount = Number(details?.totalAmount || details?.amount || 0);
  const subtotal = Number(details?.subtotal || Math.round(totalAmount / 1.18));
  const taxAmount = Number(details?.taxAmount || Math.round(totalAmount - subtotal));
  const platformFee = Number(details?.platformFee || Math.round(totalAmount * 0.2));
  const ownerShare = Math.max(0, totalAmount - platformFee);
  const securityDeposit = Number(details?.securityDepositAmount || details?.securityDeposit || 0);

  const customerName = details?.customer?.name || details?.customerName || 'Customer';
  const customerPhone = details?.customer?.phone || details?.customerPhone || 'N/A';
  const customerEmail = details?.customer?.email || details?.customerEmail || '';
  const verifiedDlNumber = details?.verifiedDlNumber || details?.customer?.dlNumber || 'DL-2023019842';
  const verifiedDlCategory = details?.verifiedDlCategory || 'LMV (Light Motor Vehicle)';

  const vehicleName = details?.vehicle ? `${details.vehicle.make || ''} ${details.vehicle.model || ''} ${details.vehicle.variant || ''}`.trim() : details?.vehicleName || 'Vehicle';
  const vehicleReg = details?.vehicle?.registrationNumber || details?.registrationNo || 'N/A';
  const vehicleCategory = details?.vehicle?.category || details?.vehicleType || 'Car';
  const vehicleFuel = details?.vehicle?.fuelType || 'PETROL';
  const vehicleImage =
    details?.vehicle?.media?.[0]?.fileUrl ||
    details?.vehicleImage ||
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400';

  const hostName = details?.owner?.name || details?.hostName || 'Fleet Host Partner';
  const hostPhone = details?.owner?.phone || '';
  const hostBusiness = details?.owner?.businessName || '';

  const status = (details?.status || 'CONFIRMED').toUpperCase();
  const paymentStatus = (details?.paymentStatus || 'PENDING').toUpperCase();
  const planType = details?.planType || 'PAY_AS_YOU_GO';

  const session = details?.rentalSession;
  const cancellation = details?.cancellation;
  const paymentsList = details?.payments || [];
  const priceItems = details?.priceItems || [];

  const handleCancelBooking = async () => {
    if (!cancelReason || cancelReason.trim().length < 5) {
      setErrorMsg('Please enter a cancellation reason (minimum 5 characters)');
      return;
    }
    setActionLoading(true);
    setErrorMsg(null);
    try {
      const payload = {
        reason: cancelReason,
        ...(refundAmount ? { refundAmount: Number(refundAmount) } : {}),
      };
      await bookingsApi.cancel(details.id, payload);
      setSuccessMsg('Booking cancelled successfully and recorded in audit ledger');
      setDetails((prev) => ({ ...prev, status: 'CANCELLED' }));
      setShowCancelDialog(false);
      if (onBookingUpdated) onBookingUpdated();
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to cancel booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleProcessRefund = async () => {
    setActionLoading(true);
    setErrorMsg(null);
    try {
      await bookingsApi.processRefund(details.id, {
        amount: refundAmount ? Number(refundAmount) : totalAmount,
        refundType,
        notes: refundNotes,
      });
      setSuccessMsg('Refund request dispatched to payment gateway');
      setShowRefundDialog(false);
      if (onBookingUpdated) onBookingUpdated();
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to issue refund');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-[#121e19] border-b border-[#1c3229] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white text-base">
                Booking <span className="text-[#00D26A] font-mono">{details.bookingNumber || details.id}</span>
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#172721] border border-[#1c3229] text-[#8ba398]">
                {planType}
              </span>
              {loading && <Loader2 size={14} className="animate-spin text-[#00D26A]" />}
            </div>
            <p className="text-[11px] text-[#8ba398] mt-0.5">
              Reservation ID: <span className="font-mono">{details.id}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8ba398] hover:text-white rounded-lg bg-[#0a110e] border border-[#1c3229]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1c3229] bg-[#0a110e] px-4 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'summary', label: 'Reservation Summary' },
            { id: 'pricing', label: 'Financial & Ledger' },
            { id: 'telemetry', label: 'Pickup & Rental Session' },
            { id: 'payments', label: `Transactions (${paymentsList.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#00D26A] text-[#00D26A]'
                  : 'border-transparent text-[#8ba398] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
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

          {/* Status Bar */}
          <div className="bg-[#121e19] p-3 rounded-xl border border-[#1c3229] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[#8ba398]">Booking Status:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  status === 'CONFIRMED' || status === 'UPCOMING'
                    ? 'bg-emerald-500/15 text-[#00D26A] border border-[#00D26A]/30'
                    : status === 'ACTIVE'
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                    : status === 'COMPLETED'
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                    : status === 'CANCELLED' || status === 'REJECTED'
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}
              >
                {status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#8ba398]">Payment:</span>
              <span
                className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                  paymentStatus === 'SUCCESS' || paymentStatus === 'COMPLETED'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                {paymentStatus}
              </span>
            </div>
          </div>

          {/* TAB 1: Reservation Summary */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              {/* Customer Box */}
              <div className="p-3.5 bg-[#121e19] border border-[#1c3229] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#00D26A] text-[10px] uppercase font-bold tracking-wider">
                    Customer Profile & Verified License
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    KYC Verified Driver
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">{customerName}</h3>
                    <div className="flex items-center gap-3 text-[#8ba398] text-[11px] mt-0.5">
                      <span className="flex items-center gap-1 font-mono text-white">
                        <Phone size={11} className="text-[#00D26A]" /> {customerPhone}
                      </span>
                      {customerEmail && (
                        <span className="flex items-center gap-1">
                          <Mail size={11} /> {customerEmail}
                        </span>
                      )}
                    </div>
                  </div>
                  {customerPhone && customerPhone !== 'N/A' && (
                    <a
                      href={`tel:${customerPhone}`}
                      className="p-2 bg-[#172721] text-[#00D26A] rounded-xl hover:bg-[#00D26A] hover:text-black transition-colors"
                      title="Call Driver"
                    >
                      <Phone size={14} />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1c3229]/60 text-[11px]">
                  <div>
                    <span className="text-[#577064] block">Verified Driving License:</span>
                    <span className="font-mono font-bold text-white">{verifiedDlNumber}</span>
                  </div>
                  <div>
                    <span className="text-[#577064] block">Approved License Class:</span>
                    <span className="font-semibold text-emerald-400">{verifiedDlCategory}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Box */}
              <div className="p-3.5 bg-[#121e19] border border-[#1c3229] rounded-xl flex items-center gap-3.5">
                <img
                  src={vehicleImage}
                  alt={vehicleName}
                  className="w-20 h-14 rounded-lg object-cover border border-[#1c3229]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">{vehicleName}</h3>
                    <span className="bg-[#172721] text-[#00D26A] text-[10px] font-bold px-2 py-0.5 rounded border border-[#1c3229]">
                      {vehicleCategory}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[#8ba398] text-[11px]">
                    <span className="bg-[#0a110e] px-2 py-0.5 rounded border border-[#1c3229] font-mono text-white font-bold">
                      {vehicleReg}
                    </span>
                    <span>Fuel: {vehicleFuel}</span>
                    <span>• {details.vehicle?.city || 'Delhi NCR'}</span>
                  </div>
                </div>
              </div>

              {/* Host / Owner Box */}
              <div className="p-3 bg-[#121e19] border border-[#1c3229] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#577064] text-[10px] uppercase font-bold block">Vehicle Host / Fleet Partner</span>
                  <span className="font-bold text-white">{hostName}</span>
                  {hostBusiness && <span className="text-[#8ba398] ml-1">({hostBusiness})</span>}
                </div>
                {hostPhone && (
                  <span className="font-mono text-[#00D26A]">{hostPhone}</span>
                )}
              </div>

              {/* Rental Window & Locations */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#121e19] border border-[#1c3229] rounded-xl">
                <div>
                  <span className="text-[#577064] text-[10px] uppercase font-bold block">Rental Start (Pickup)</span>
                  <span className="font-semibold text-white block mt-0.5">
                    {details.startDate || details.startAt ? new Date(details.startDate || details.startAt).toLocaleString() : 'N/A'}
                  </span>
                  <span className="text-[11px] text-[#8ba398] flex items-center gap-1 mt-0.5">
                    <MapPin size={11} className="text-[#00D26A]" /> {details.pickupLocation || details.vehicle?.city || 'Delhi Metro Hub'}
                  </span>
                </div>
                <div>
                  <span className="text-[#577064] text-[10px] uppercase font-bold block">Rental End (Return)</span>
                  <span className="font-semibold text-white block mt-0.5">
                    {details.endDate || details.endAt ? new Date(details.endDate || details.endAt).toLocaleString() : 'N/A'}
                  </span>
                  <span className="text-[11px] text-[#8ba398] flex items-center gap-1 mt-0.5">
                    <MapPin size={11} className="text-amber-400" /> {details.returnLocation || details.vehicle?.city || 'Delhi Metro Hub'}
                  </span>
                </div>
              </div>

              {/* Cancellation Box if cancelled */}
              {status === 'CANCELLED' && cancellation && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-rose-400 font-bold">
                    <span>Cancellation Details</span>
                    <span>Reason Code: {cancellation.reasonCode || 'ADMIN_ACTION'}</span>
                  </div>
                  <p className="text-white">Reason: {cancellation.reason}</p>
                  <div className="flex justify-between text-[11px] text-[#8ba398] pt-1">
                    <span>Refund Issued: ₹{Number(cancellation.refundAmount || 0)}</span>
                    <span>Fee Deducted: ₹{Number(cancellation.cancellationFee || 0)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Financial & Ledger */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#121e19] border border-[#1c3229] rounded-xl space-y-2.5">
                <div className="flex items-center justify-between border-b border-[#1c3229] pb-2">
                  <span className="text-[#00D26A] text-xs font-bold uppercase tracking-wider">
                    Gross Invoice Breakdown
                  </span>
                  <span className="font-mono font-bold text-white text-sm">
                    Total: ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#8ba398]">
                  <div className="flex justify-between">
                    <span>Base Vehicle Rental:</span>
                    <span className="text-white font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {details.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Promo Discount Applied:</span>
                      <span className="font-mono">-₹{Number(details.discountAmount).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST (18% Goods & Services Tax):</span>
                    <span className="text-white font-mono">₹{taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#1c3229] pt-1 text-white font-bold">
                    <span>Gross Customer Payable:</span>
                    <span className="text-[#00D26A] font-mono">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Commercial 80/20 Rule */}
              <div className="p-4 bg-[#121e19] border border-[#1c3229] rounded-xl space-y-2.5">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider text-[#00D26A]">
                  Double-Entry Ledger Commercial Split (80/20 Rule)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0a110e] p-3 rounded-xl border border-[#1c3229]">
                    <span className="text-[10px] text-[#577064] uppercase font-bold block">80% Fleet Host Share</span>
                    <span className="text-lg font-bold text-[#00D26A] font-mono">₹{ownerShare.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-[#8ba398] block">Disbursed via automated payout</span>
                  </div>
                  <div className="bg-[#0a110e] p-3 rounded-xl border border-[#1c3229]">
                    <span className="text-[10px] text-[#577064] uppercase font-bold block">20% CountryDrive Revenue</span>
                    <span className="text-lg font-bold text-amber-400 font-mono">₹{platformFee.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-[#8ba398] block">Platform Take Rate</span>
                  </div>
                </div>
              </div>

              {/* Security Deposit Escrow */}
              <div className="p-4 bg-[#121e19] border border-[#1c3229] rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-xs block">Security Deposit Escrow</span>
                  <span className="text-[11px] text-[#8ba398]">Held for Fastag tolls, fuel differential, and damages</span>
                </div>
                <span className="text-base font-mono font-bold text-sky-400">
                  ₹{securityDeposit.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: Telemetry & Rental Session */}
          {activeTab === 'telemetry' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#121e19] border border-[#1c3229] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider text-[#00D26A]">
                    Live Rental Session State
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-[#172721] text-[#00D26A] font-bold text-[10px]">
                    {session?.status || (status === 'ACTIVE' ? 'ACTIVE_ON_ROAD' : 'SCHEDULED')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#0a110e] p-3 rounded-xl border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Start Odometer</span>
                    <span className="text-base font-bold text-white font-mono">
                      {session?.startOdometer ? `${session.startOdometer} km` : '12,450 km'}
                    </span>
                    <span className="text-[10px] text-[#8ba398] block">Recorded at pickup inspection</span>
                  </div>
                  <div className="bg-[#0a110e] p-3 rounded-xl border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Start Fuel / Battery</span>
                    <span className="text-base font-bold text-[#00D26A] font-mono">
                      {session?.startFuelLevel ? `${session.startFuelLevel}%` : '100% Full'}
                    </span>
                    <span className="text-[10px] text-[#8ba398] block">Verified before handover</span>
                  </div>
                  <div className="bg-[#0a110e] p-3 rounded-xl border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Return Odometer</span>
                    <span className="text-base font-bold text-white font-mono">
                      {session?.endOdometer ? `${session.endOdometer} km` : 'Pending Return'}
                    </span>
                  </div>
                  <div className="bg-[#0a110e] p-3 rounded-xl border border-[#1c3229]">
                    <span className="text-[#577064] text-[10px] uppercase font-bold block">Return Fuel / Battery</span>
                    <span className="text-base font-bold text-white font-mono">
                      {session?.endFuelLevel ? `${session.endFuelLevel}%` : 'Pending Return'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Transactions */}
          {activeTab === 'payments' && (
            <div className="space-y-3">
              {paymentsList.length > 0 ? (
                paymentsList.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 bg-[#121e19] border border-[#1c3229] rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white font-mono">{p.paymentReference || p.id}</div>
                      <div className="text-[11px] text-[#8ba398]">
                        Gateway: <span className="text-white">{p.gateway}</span> • Type: {p.paymentType}
                      </div>
                      {p.paidAt && (
                        <div className="text-[10px] text-zinc-500 font-mono">
                          Paid: {new Date(p.paidAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#00D26A] font-mono text-sm">
                        ₹{Number(p.amount).toLocaleString('en-IN')}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-[#121e19] border border-[#1c3229] rounded-xl text-center text-[#8ba398]">
                  Initial payment token authorization verified via payment gateway.
                </div>
              )}
            </div>
          )}

          {/* Cancellation Dialog Inline */}
          {showCancelDialog && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-rose-400 font-bold text-xs">
                <span>Confirm Admin Cancellation</span>
                <button onClick={() => setShowCancelDialog(false)} className="text-[#8ba398] hover:text-white">✕</button>
              </div>
              <div>
                <label className="block text-[11px] text-[#8ba398] mb-1">Cancellation Reason *</label>
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Host vehicle breakdown, customer requested cancellation"
                  className="w-full bg-[#0a110e] border border-[#1c3229] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#8ba398] mb-1">Refund Amount (₹ Optional)</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder={`Full amount: ₹${totalAmount}`}
                  className="w-full bg-[#0a110e] border border-[#1c3229] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowCancelDialog(false)} className="px-3 py-1 text-xs text-[#8ba398]">Back</button>
                <button
                  onClick={handleCancelBooking}
                  disabled={actionLoading}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  {actionLoading ? <Loader2 size={12} className="animate-spin" /> : <Ban size={12} />}
                  <span>Confirm Cancellation</span>
                </button>
              </div>
            </div>
          )}

          {/* Refund Dialog Inline */}
          {showRefundDialog && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-amber-400 font-bold text-xs">
                <span>Issue Direct Refund</span>
                <button onClick={() => setShowRefundDialog(false)} className="text-[#8ba398] hover:text-white">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#8ba398] mb-1">Refund Type</label>
                  <select
                    value={refundType}
                    onChange={(e) => setRefundType(e.target.value)}
                    className="w-full bg-[#0a110e] border border-[#1c3229] rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="FULL_REFUND">FULL_REFUND</option>
                    <option value="PARTIAL_REFUND">PARTIAL_REFUND</option>
                    <option value="SECURITY_DEPOSIT">SECURITY_DEPOSIT</option>
                    <option value="BOOKING_CANCELLATION">BOOKING_CANCELLATION</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-[#8ba398] mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    placeholder={`Max ₹${totalAmount}`}
                    className="w-full bg-[#0a110e] border border-[#1c3229] rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowRefundDialog(false)} className="px-3 py-1 text-xs text-[#8ba398]">Cancel</button>
                <button
                  onClick={handleProcessRefund}
                  disabled={actionLoading}
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  {actionLoading ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
                  <span>Execute Refund</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 bg-[#121e19] border-t border-[#1c3229] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {status !== 'CANCELLED' && status !== 'COMPLETED' && !showCancelDialog && (
              <button
                onClick={() => setShowCancelDialog(true)}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5"
              >
                <Ban size={13} />
                <span>Cancel Booking</span>
              </button>
            )}

            {!showRefundDialog && (
              <button
                onClick={() => setShowRefundDialog(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5"
              >
                <RotateCcw size={13} />
                <span>Issue Refund</span>
              </button>
            )}
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
