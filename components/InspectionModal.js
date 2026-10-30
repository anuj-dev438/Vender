// components/InspectionModal.js
import React, { useState } from 'react';
import { X, FileCheck, Camera, ShieldCheck, AlertTriangle, Clock, CheckCircle2, Upload } from 'lucide-react';
import { VENDOR_DATA, calculateRevenueSplit } from '../data';

export default function InspectionModal({ booking, onClose, onConfirm }) {
  const [inspectionType, setInspectionType] = useState('RETURN'); // 'PICKUP' or 'RETURN'
  const [form, setForm] = useState({
    endOdometer: booking.startOdometer + booking.allowedKm + 25,
    endFuel: '75%',
    damageNotes: '',
    lateHours: 0,
    identityVerified: true,
    inspectionPhotos: []
  });
  const [summary, setSummary] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    const endOdo = parseInt(form.endOdometer, 10) || booking.startOdometer;
    const distanceTraveled = endOdo - booking.startOdometer;
    const extraKm = Math.max(0, distanceTraveled - booking.allowedKm);
    const extraKmCharge = extraKm * VENDOR_DATA.pricingRules.extraKmRate;
    const lateFee = (parseInt(form.lateHours, 10) || 0) * VENDOR_DATA.pricingRules.lateFeePerHour;

    const totalGross = booking.grossAmount + extraKmCharge + lateFee;
    const split = calculateRevenueSplit(totalGross);

    setSummary({
      distanceTraveled,
      extraKm,
      extraKmCharge,
      lateFee,
      totalGross,
      ownerShare: split.ownerShare,
      platformShare: split.platformShare
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 z-50">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
              <FileCheck className="w-5 h-5 text-indigo-600" /> Vehicle Condition Inspection Checklist
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Booking ID: <span className="font-mono font-semibold">{booking.id}</span></p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tab */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 p-1.5 gap-2 px-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setInspectionType('RETURN')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              inspectionType === 'RETURN' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            Return Inspection
          </button>
          <button
            type="button"
            onClick={() => setInspectionType('PICKUP')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              inspectionType === 'PICKUP' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            Pickup Audit Evidence
          </button>
        </div>

        <form onSubmit={handleCalculate} className="p-5 space-y-4 text-xs text-slate-600 overflow-y-auto flex-1">
          {/* Vehicle & Customer Summary Card */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-900 text-sm">{booking.vehicleName}</p>
              <p className="text-slate-500 mt-0.5">Customer: <span className="font-medium text-slate-800">{booking.customerName}</span></p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-[10px] uppercase font-bold">Start Odometer</p>
              <p className="font-mono text-slate-900 font-bold">{booking.startOdometer} KM</p>
            </div>
          </div>

          {/* Form Fields for Return Inspection */}
          {inspectionType === 'RETURN' ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Return Odometer (KM) *</label>
                  <input
                    type="number"
                    required
                    value={form.endOdometer}
                    onChange={(e) => setForm({ ...form, endOdometer: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Return Fuel / Battery Level *</label>
                  <input
                    type="text"
                    required
                    value={form.endFuel}
                    onChange={(e) => setForm({ ...form, endFuel: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Late Hours Overage */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Late Return Duration (Hours)</label>
                <input
                  type="number"
                  min="0"
                  value={form.lateHours}
                  onChange={(e) => setForm({ ...form, lateHours: e.target.value })}
                  placeholder="0 hours"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Exterior/Interior Photo Evidence Upload */}
              <div className="border rounded-xl p-3 bg-slate-50 space-y-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-indigo-600" /> Condition & Damage Evidence Upload
                </span>
                <p className="text-[11px] text-slate-500">Upload mandatory return condition photos (Odometer, Fuel gauge, Scratch/Damage angles).</p>
                
                <div className="flex items-center gap-2 pt-1">
                  <input type="file" multiple accept="image/*" className="text-xs w-full file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                </div>
              </div>

              {/* Damage Notes */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">New Scratch / Damage Notes</label>
                <textarea
                  rows={2}
                  value={form.damageNotes}
                  onChange={(e) => setForm({ ...form, damageNotes: e.target.value })}
                  placeholder="Mention any new damage observed during return inspection..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              {/* Calculate Button */}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition shadow-sm"
              >
                Calculate Final Settlement & Charges
              </button>

              {/* Calculation Summary Box */}
              {summary && (
                <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                  <h4 className="font-bold text-slate-900 text-sm border-b pb-2 flex justify-between items-center">
                    <span>Final Billing Summary</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-semibold">PRD 80/20 Split</span>
                  </h4>

                  <div className="flex justify-between">
                    <span>Traveled Distance</span>
                    <span className="font-mono font-medium text-slate-900">
                      {summary.distanceTraveled} KM (Allowed: {booking.allowedKm} KM)
                    </span>
                  </div>

                  {summary.extraKm > 0 && (
                    <div className="flex justify-between text-amber-700 font-medium">
                      <span>Extra KM Charge ({summary.extraKm} KM × ₹{VENDOR_DATA.pricingRules.extraKmRate})</span>
                      <span className="font-mono">+₹{summary.extraKmCharge}</span>
                    </div>
                  )}

                  {summary.lateFee > 0 && (
                    <div className="flex justify-between text-rose-700 font-medium">
                      <span>Late Return Fee ({form.lateHours} hrs × ₹{VENDOR_DATA.pricingRules.lateFeePerHour})</span>
                      <span className="font-mono">+₹{summary.lateFee}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t">
                    <span>Total Gross Fare</span>
                    <span>₹{summary.totalGross}</span>
                  </div>

                  <div className="flex justify-between font-bold text-emerald-700 pt-1">
                    <span>Owner Receivable (80%)</span>
                    <span>₹{summary.ownerShare}</span>
                  </div>

                  <div className="flex justify-between text-indigo-700 text-[11px]">
                    <span>Platform Commission (20%)</span>
                    <span>₹{summary.platformShare}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onConfirm(form.endOdometer, summary)}
                    className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Confirm & Complete Inspection
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Pickup Audit View */
            <div className="space-y-4">
              <div className="border rounded-xl p-4 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Pickup Audit Verification
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">VERIFIED</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Customer ID Verified</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">{booking.faceVerified ? 'Yes (Govt ID + Face KYC)' : 'Pending'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Start Fuel / Battery</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">{booking.startFuel || '100% Full'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>Damage disputes must satisfy platform verification rules. Recorded pickup evidence is immutable once rental begins.</p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}