'use client';

import React, { useState } from 'react';
import { X, Car, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function AddVehicleModal({ onClose, onAddVehicle }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    vehicleType: 'Car',
    brand: '',
    modelVariant: '',
    manufacturingYear: '',
    regNumber: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: '5',
    frontPhoto: null,
    rearPhoto: null,
    leftPhoto: null,
    rightPhoto: null,
    interiorPhoto: null,
    dashboardPhoto: null,
    odometer: '',
    scratchesOrDamage: '',
    rcFile: null,
    insuranceFile: null,
    pucFile: null,
    rcExpiry: '',
    insuranceExpiry: '',
    pickupAddress: '',
    city: '',
    serviceArea: '',
    hourlyRate: '',
    includedKms: '10',
    extraKmRate: '12',
    securityDeposit: '2000',
    rentalRules: 'No smoking, valid ID required.',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e, fieldKey) => {
    const file = e.target.files?.[0];
    setError('');
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be 5 MB or less.');
      return;
    }
    setFormData((prev) => ({ ...prev, [fieldKey]: file }));
  };

  const handleNextStep = () => {
    setError('');
    if (currentStep === 1) {
      if (!formData.brand || !formData.modelVariant || !formData.regNumber) {
        setError('Please fill in Brand, Model, and Registration Number.');
        return;
      }
    } else if (currentStep === 5) {
      if (!formData.hourlyRate || Number(formData.hourlyRate) <= 0) {
        setError('Please enter a valid hourly rate.');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const handlePrevStep = () => {
    setError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      const newVehicle = {
        id: `VEH-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: `${formData.brand} ${formData.modelVariant}`,
        regNumber: formData.regNumber.trim().toUpperCase(),
        category: formData.vehicleType,
        fuelType: formData.fuelType,
        status: 'PENDING_VERIFICATION',
        ratePerHour: Number(formData.hourlyRate),
        includedKmPerHour: Number(formData.includedKms),
        totalTrips: 0,
        totalEarned: 0,
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&q=80',
        frontPhoto: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&q=80',
      };

      await onAddVehicle(newVehicle);
    } catch (err) {
      setError(err.message || 'Failed to submit vehicle. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10';

  const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
              <Car className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Multi-Step Vehicle Onboarding
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Step {currentStep} of 6 — Complete all details for verification
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b bg-slate-50/50 px-6 py-3 overflow-x-auto gap-2">
          {['Basic Info', 'Photos & Condition', 'Documents', 'Location', 'Pricing', 'Review'].map((stepName, idx) => (
            <div
              key={stepName}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                currentStep === idx + 1
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : currentStep > idx + 1
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              <span>{idx + 1}.</span> {stepName}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto px-6 py-5 flex-1">
          {currentStep === 1 && (
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Step 1 — Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Vehicle Type *</label>
                  <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className={inputClass}>
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                    <option value="Scooter">Scooter</option>
                    <option value="EV">Electric Vehicle (EV)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Brand / Manufacturer *</label>
                  <input type="text" name="brand" placeholder="e.g. Maruti, Honda, Ather" value={formData.brand} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Model and Variant *</label>
                  <input type="text" name="modelVariant" placeholder="e.g. Swift ZXi / 450X" value={formData.modelVariant} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Manufacturing Year</label>
                  <input type="number" name="manufacturingYear" placeholder="e.g. 2024" value={formData.manufacturingYear} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Registration Number *</label>
                  <input type="text" name="regNumber" placeholder="e.g. DL 01 AB 1234" value={formData.regNumber} onChange={handleChange} className={`${inputClass} uppercase font-mono`} required />
                </div>
                <div>
                  <label className={labelClass}>Fuel / Energy Type</label>
                  <select name="fuelType" value={formData.fuelType} onChange={handleChange} className={inputClass}>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="EV">EV</option>
                  </select>
                </div>
              </div>
            </section>
          )}

          {currentStep === 2 && (
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Step 2 — Photos & Condition</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['frontPhoto', 'rearPhoto', 'leftPhoto', 'rightPhoto', 'interiorPhoto', 'dashboardPhoto'].map((photoKey) => (
                  <div key={photoKey} className="border rounded-xl p-2 bg-slate-50 flex flex-col items-center">
                    <span className="text-xs font-semibold capitalize text-slate-700 mb-1">{photoKey.replace('Photo', '')} Photo</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, photoKey)} className="text-[10px] w-full" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {currentStep === 3 && (
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Step 3 — Documents Verification</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border rounded-xl p-3 bg-slate-50">
                  <label className={labelClass}>Registration Certificate (RC) *</label>
                  <input type="file" onChange={(e) => handleFileChange(e, 'rcFile')} className="text-xs w-full" />
                </div>
                <div className="border rounded-xl p-3 bg-slate-50">
                  <label className={labelClass}>Insurance Document *</label>
                  <input type="file" onChange={(e) => handleFileChange(e, 'insuranceFile')} className="text-xs w-full" />
                </div>
                <div className="border rounded-xl p-3 bg-slate-50">
                  <label className={labelClass}>PUC Certificate</label>
                  <input type="file" onChange={(e) => handleFileChange(e, 'pucFile')} className="text-xs w-full" />
                </div>
              </div>
            </section>
          )}

          {currentStep === 4 && (
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Step 4 — Location & Pickup</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Pickup Address *</label>
                  <textarea name="pickupAddress" rows={2} placeholder="Complete street address" value={formData.pickupAddress} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>City *</label>
                  <input type="text" name="city" placeholder="e.g. Bengaluru / Delhi" value={formData.city} onChange={handleChange} className={inputClass} required />
                </div>
              </div>
            </section>
          )}

          {currentStep === 5 && (
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Step 5 — Pricing & Packages</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Hourly Rate (₹) *</label>
                  <input type="number" name="hourlyRate" placeholder="250" value={formData.hourlyRate} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Included KM / Hour</label>
                  <input type="number" name="includedKms" placeholder="10" value={formData.includedKms} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Security Deposit (₹)</label>
                  <input type="number" name="securityDeposit" placeholder="2000" value={formData.securityDeposit} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </section>
          )}

          {currentStep === 6 && (
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Step 6 — Review & Submit Summary</h3>
              <div className="rounded-xl border bg-slate-50 p-4 space-y-2 text-sm text-slate-700">
                <p><span className="font-semibold">Vehicle:</span> {formData.brand} {formData.modelVariant} ({formData.vehicleType})</p>
                <p><span className="font-semibold">Registration No:</span> {formData.regNumber}</p>
                <p><span className="font-semibold">City:</span> {formData.city || 'N/A'}</p>
                <p><span className="font-semibold">Pricing:</span> ₹{formData.hourlyRate}/hr</p>
              </div>
            </section>
          )}

          {error && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
            ) : <div />}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-1 px-5 py-2.5 rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm"
              >
                Next Step <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                {submitting ? 'Submitting...' : 'Submit for Verification'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}