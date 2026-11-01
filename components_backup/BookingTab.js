'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Eye,
  X,
  User,
  Car,
  Clock,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  FileText,
  DollarSign,
  ChevronRight
} from 'lucide-react';

export default function BookingsTab({ bookings = [], onOpenInspection }) {
  const bookingList = Array.isArray(bookings) ? bookings : [];

  // Filter & Search states
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal for Detailed Booking View Page
  const [selectedBooking, setSelectedBooking] = useState(null);

  const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString('en-IN');

  // Filter logic
  const filteredBookings = useMemo(() => {
    return bookingList.filter((b) => {
      const matchesSearch =
        (b.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.vehicleName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.customerName || '').toLowerCase().includes(searchQuery.toLowerCase());

      if (activeTab === 'ALL') return matchesSearch;
      if (activeTab === 'UPCOMING') return matchesSearch && (b.status === 'UPCOMING' || b.status === 'CONFIRMED');
      if (activeTab === 'ACTIVE') return matchesSearch && (b.status === 'ACTIVE' || b.status === 'PICKUP_PENDING' || b.status === 'RETURN_PENDING');
      if (activeTab === 'COMPLETED') return matchesSearch && b.status === 'COMPLETED';
      if (activeTab === 'CANCELLED') return matchesSearch && b.status === 'CANCELLED';
      if (activeTab === 'DISPUTED') return matchesSearch && b.status === 'DISPUTED';

      return matchesSearch;
    });
  }, [bookingList, searchQuery, activeTab]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'border-emerald-200 bg-emerald-50 text-emerald-700';
      case 'ACTIVE':
        return 'border-blue-200 bg-blue-50 text-blue-700';
      case 'PICKUP_PENDING':
      case 'RETURN_PENDING':
      case 'INSPECTION':
        return 'border-amber-200 bg-amber-50 text-amber-700';
      case 'UPCOMING':
      case 'CONFIRMED':
        return 'border-indigo-200 bg-indigo-50 text-indigo-700';
      case 'CANCELLED':
        return 'border-rose-200 bg-rose-50 text-rose-700';
      case 'DISPUTED':
        return 'border-purple-200 bg-purple-50 text-purple-700';
      default:
        return 'border-slate-200 bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Stats Bar */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Booking Management & Lifecycle
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Monitor active rentals, upcoming pickups, settlements & dispute resolutions.
            </p>
          </div>

          <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
            {bookingList.length} Total Bookings
          </span>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 px-5 py-2.5 overflow-x-auto gap-2">
          {[
            { id: 'ALL', label: 'All Bookings' },
            { id: 'UPCOMING', label: 'Upcoming' },
            { id: 'ACTIVE', label: 'Active Rentals' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'CANCELLED', label: 'Cancelled' },
            { id: 'DISPUTED', label: 'Disputed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, vehicle, or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="whitespace-nowrap px-4 py-4">Booking ID</th>
                <th className="whitespace-nowrap px-4 py-4">Vehicle</th>
                <th className="whitespace-nowrap px-4 py-4">Customer</th>
                <th className="whitespace-nowrap px-4 py-4">Pickup / Return</th>
                <th className="whitespace-nowrap px-4 py-4">Status</th>
                <th className="whitespace-nowrap px-4 py-4">Gross Fare</th>
                <th className="whitespace-nowrap px-4 py-4 text-emerald-700">
                  Owner Share (80%)
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-indigo-700">
                  Platform (20%)
                </th>
                <th className="whitespace-nowrap px-4 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => {
                  const statusStyle = getStatusBadge(b.status);

                  return (
                    <tr
                      key={b.id}
                      className="transition-colors hover:bg-slate-50/80 cursor-pointer"
                      onClick={() => setSelectedBooking(b)}
                    >
                      <td className="whitespace-nowrap px-4 py-4 font-mono font-medium text-slate-700">
                        {b.id}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-900">
                        {b.vehicleName}
                      </td>

                      <td className="px-4 py-4">
                        <div className="whitespace-nowrap font-medium text-slate-800">
                          {b.customerName || 'Customer'}
                        </div>
                        <div className="mt-0.5 whitespace-nowrap text-[11px] text-slate-500">
                          {b.customerPhone || 'N/A'}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="whitespace-nowrap text-[11px] font-medium text-slate-700">
                          {b.pickupTime || 'N/A'}
                        </div>
                        <div className="whitespace-nowrap text-[10px] text-slate-400">
                          to {b.returnTime || 'N/A'}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusStyle}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {b.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-900">
                        ₹{formatCurrency(b.grossAmount)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-emerald-700">
                        ₹{formatCurrency(b.ownerShare)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-indigo-700">
                        ₹{formatCurrency(b.platformShare)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(b)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                          >
                            <Eye className="h-3.5 w-3.5 text-indigo-600" /> View
                          </button>

                          {b.status !== 'COMPLETED' && b.status !== 'CANCELLED' && (
                            <button
                              type="button"
                              onClick={() => onOpenInspection?.(b)}
                              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                            >
                              Inspect
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-14 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <p className="mt-3 font-semibold text-slate-800">
                      No bookings found
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      No bookings match your current search or tab filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-5 py-3">
          <span className="text-xs text-slate-500">
            Booking Management System
          </span>
          <span className="text-xs font-medium text-slate-500">
            {filteredBookings.length} records shown
          </span>
        </div>
      </div>

      {/* DETAILED BOOKING PAGE / MODAL SHEET */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 backdrop-blur-sm sm:p-5"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    Booking Details ({selectedBooking.id})
                  </h3>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusBadge(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Comprehensive breakdown of customer, vehicle, pricing & lifecycle state.
                </p>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Section 1: Customer & Booking Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Customer Information</span>
                <p className="font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-indigo-600" />
                  {selectedBooking.customerName || 'Verified Customer'}
                </p>
                <p className="text-slate-600 mt-0.5">{selectedBooking.customerPhone || 'N/A'}</p>
                {selectedBooking.faceVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-1">
                    <ShieldCheck className="h-3 w-3" /> Face KYC Verified
                  </span>
                )}
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Rental Duration & Timing</span>
                <p className="font-semibold text-slate-800 mt-1">
                  Pickup: <span className="text-slate-900">{selectedBooking.pickupTime || 'N/A'}</span>
                </p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  Return: <span className="text-slate-900">{selectedBooking.returnTime || 'N/A'}</span>
                </p>
              </div>
            </div>

            {/* Section 2: Vehicle & Location Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Vehicle & Pickup Details</h4>
              <div className="rounded-xl border p-4 space-y-2 text-xs bg-white">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Car className="h-4 w-4 text-indigo-600" />
                    {selectedBooking.vehicleName}
                  </span>
                  <span className="font-mono text-slate-500">{selectedBooking.vehicleId}</span>
                </div>
                <div className="text-slate-600 pt-2 border-t flex items-start gap-1.5">
                  <MapPin className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Pickup Location: Main City Fleet Yard / Partner Hub</span>
                </div>
              </div>
            </div>

            {/* Section 3: Financial & Revenue Split */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Payment & Revenue Split (80/20)</h4>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl border bg-slate-50 p-3">
                  <span className="text-slate-500 block">Gross Fare</span>
                  <span className="text-sm font-bold text-slate-900 mt-1 block">
                    ₹{formatCurrency(selectedBooking.grossAmount)}
                  </span>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
                  <span className="text-emerald-700 font-medium block">Owner Share (80%)</span>
                  <span className="text-sm font-bold text-emerald-800 mt-1 block">
                    ₹{formatCurrency(selectedBooking.ownerShare)}
                  </span>
                </div>

                <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-3">
                  <span className="text-indigo-700 font-medium block">Platform Fee (20%)</span>
                  <span className="text-sm font-bold text-indigo-800 mt-1 block">
                    ₹{formatCurrency(selectedBooking.platformShare)}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 4: Pickup & Inspection Metrics */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pickup & Inspection Audit</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border p-3 bg-slate-50">
                  <span className="text-slate-500">Start Odometer</span>
                  <p className="font-mono font-bold text-slate-800 mt-1">
                    {selectedBooking.startOdometer ? `${selectedBooking.startOdometer} KM` : 'Recorded at Pickup'}
                  </p>
                </div>

                <div className="rounded-lg border p-3 bg-slate-50">
                  <span className="text-slate-500">Start Fuel / Charge</span>
                  <p className="font-bold text-slate-800 mt-1">
                    {selectedBooking.startFuel || '100% Full'}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: Extra Usage & Dispute Status */}
            {selectedBooking.status === 'DISPUTED' ? (
              <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-xs text-purple-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-purple-600" /> Disputed Booking
                </p>
                <p>This booking is currently under support review regarding damages or late fee calculation.</p>
              </div>
            ) : null}

            {/* Modal Actions Footer */}
            <div className="flex justify-end gap-3 border-t pt-4">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200"
              >
                Close Window
              </button>

              {selectedBooking.status !== 'COMPLETED' && (
                <button
                  type="button"
                  onClick={() => {
                    const b = selectedBooking;
                    setSelectedBooking(null);
                    onOpenInspection?.(b);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 shadow-sm"
                >
                  Start Return Inspection
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}