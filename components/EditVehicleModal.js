'use client';

import React, { useState } from 'react';
import { X, Edit3, Save, Car, DollarSign } from 'lucide-react';

export default function EditVehicleModal({ vehicle, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: vehicle.id,
    name: vehicle.name || '',
    regNumber: vehicle.regNumber || '',
    category: vehicle.category || 'SUV',
    fuelType: vehicle.fuelType || 'Petrol',
    transmission: vehicle.transmission || 'Manual',
    hourlyRate: vehicle.hourlyRate || 150,
    perKmRate: vehicle.perKmRate || 12,
    extraKmRate: vehicle.extraKmRate || 15,
    minDuration: vehicle.minDuration || 4,
    deposit: vehicle.deposit || 2000,
    status: vehicle.status || 'ACTIVE'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-5 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Edit Vehicle & Pricing Rules
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
          {/* Section 1: Vehicle Specs */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b pb-1">
              <Car className="h-4 w-4 text-indigo-600" /> Vehicle Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Vehicle Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-lg p-2 bg-slate-50 text-slate-900 font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Registration Number *</label>
                <input
                  type="text"
                  required
                  value={formData.regNumber}
                  onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                  className="w-full border rounded-lg p-2 bg-slate-50 font-mono text-slate-900 font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Fuel Type</label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  className="w-full border rounded-lg p-2 bg-slate-50 text-slate-800"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric (EV)">Electric (EV)</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Transmission</label>
                <select
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                  className="w-full border rounded-lg p-2 bg-slate-50 text-slate-800"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing Model Configuration */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b pb-1">
              <DollarSign className="h-4 w-4 text-emerald-600" /> Rental Rates & Deposit
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Hourly Rate (₹/hr)</label>
                <input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                  className="w-full border rounded-lg p-2 font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Per KM Rate (₹/KM)</label>
                <input
                  type="number"
                  value={formData.perKmRate}
                  onChange={(e) => setFormData({ ...formData, perKmRate: Number(e.target.value) })}
                  className="w-full border rounded-lg p-2 font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Extra KM Overage Rate (₹)</label>
                <input
                  type="number"
                  value={formData.extraKmRate}
                  onChange={(e) => setFormData({ ...formData, extraKmRate: Number(e.target.value) })}
                  className="w-full border rounded-lg p-2 font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  value={formData.deposit}
                  onChange={(e) => setFormData({ ...formData, deposit: Number(e.target.value) })}
                  className="w-full border rounded-lg p-2 font-mono text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-slate-700 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 shadow-sm"
            >
              <Save className="h-4 w-4" /> Save Vehicle Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}