'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { VENDOR_DATA } from '../data';
import Navbar from '../components/Navbar';
import OverviewTab from '../components/OverviewTab';
import VehiclesTab from '../components/VehiclesTab';
import BookingsTab from '../components/BookingTab';
import EarningsTab from '../components/EarningsTab';
import VendorReportsAndSupportTab from '../components/VendorReportsAndSupportTab';
import VendorProfileAndSettingsTab from '../components/VendorProfileAndSettingsTab';
import InspectionModal from '../components/InspectionModal';
import AddVehicleModal from '../components/AddVehicleModal';

export default function VendorDashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [vehicles, setVehicles] = useState(VENDOR_DATA.vehicles);
  const [bookings, setBookings] = useState(VENDOR_DATA.bookings);
  const [ledger, setLedger] = useState(VENDOR_DATA.ledger);

  const [dateFilter, setDateFilter] = useState('30_DAYS');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [notifications, setNotifications] = useState([
    { id: 'NOTIF-1', title: 'Vehicle Approved', desc: 'Hyundai Creta verified and approved.', time: '2 hours ago', unread: true },
    { id: 'NOTIF-2', title: 'New Booking Confirmed', desc: 'Booking BK-8092 confirmed.', time: '5 hours ago', unread: true },
    { id: 'NOTIF-3', title: 'Settlement Processed', desc: 'Payout of ₹12,400 transferred.', time: '1 day ago', unread: false },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);

  const [selectedBookingForInspection, setSelectedBookingForInspection] = useState(null);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);

  const isDateWithinRange = (dateString, range) => {
    if (!dateString || range === 'ALL') return true;
    const itemDate = new Date(dateString);

    if (range === 'CUSTOM') {
      if (!startDate && !endDate) return true;
      const start = startDate ? new Date(startDate) : new Date('2020-01-01');
      const end = endDate ? new Date(endDate) : new Date();
      end.setHours(23, 59, 59, 999);
      return itemDate >= start && itemDate <= end;
    }

    const now = typeof window !== 'undefined' ? new Date() : new Date('2026-01-01');
    const diffInMs = now.getTime() - itemDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (range === 'TODAY') return diffInDays <= 1 && diffInDays >= 0;
    if (range === '7_DAYS') return diffInDays <= 7 && diffInDays >= 0;
    if (range === '30_DAYS') return diffInDays <= 30 && diffInDays >= 0;
    return true;
  };

  const filteredBookings = useMemo(() => {
    if (!mounted) return bookings;
    return bookings.filter((b) => isDateWithinRange(b.pickupTime || b.date, dateFilter));
  }, [bookings, dateFilter, startDate, endDate, mounted]);

  const filteredLedger = useMemo(() => {
    if (!mounted) return ledger;
    return ledger.filter((l) => isDateWithinRange(l.date, dateFilter));
  }, [ledger, dateFilter, startDate, endDate, mounted]);

  const handleToggleVehicleStatus = (vehicleId) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, status: v.status === 'ACTIVE' ? 'MAINTENANCE' : 'ACTIVE' } : v))
    );
  };

  const handleAddVehicle = (newVehicle) => {
    setVehicles((prev) => [newVehicle, ...prev]);
    setIsAddVehicleOpen(false);
  };

  const handleResubmitVehicle = (vehicleToResubmit) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleToResubmit.id ? { ...v, status: 'PENDING_VERIFICATION', rejectionReason: null } : v))
    );
  };

  const handleConfirmReturn = (endOdometer, summary) => {
    if (!selectedBookingForInspection) return;
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === selectedBookingForInspection.id
          ? {
              ...booking,
              status: 'COMPLETED',
              endOdometer: parseInt(endOdometer, 10),
              grossAmount: summary.totalGross,
              ownerShare: summary.ownerShare,
              platformShare: summary.platformShare,
            }
          : booking
      )
    );
    setSelectedBookingForInspection(null);
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard Overview' },
    { id: 'vehicles', label: `My Vehicles (${vehicles.length})` },
    { id: 'bookings', label: `Rentals & Inspections (${filteredBookings.length})` },
    { id: 'earnings', label: 'Earnings & Settlements (80/20)' },
    { id: 'reports_support', label: 'Reports & Support Center' },
    { id: 'profile_settings', label: 'Profile & Settings' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Navbar
        owner={VENDOR_DATA.owner}
        selectedDateFilter={dateFilter}
        customStartDate={startDate}
        customEndDate={endDate}
        onDateFilterChange={(range) => setDateFilter(range)}
        onCustomDateChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
        ledgerData={filteredLedger}
        unreadNotificationsCount={unreadCount}
        onNotificationClick={() => setActiveTab('reports_support')}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-indigo-600">
              Vendor Portal
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Vendor Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage your fleet, bookings, earnings, and profile in one place.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            Filter: <span className="text-indigo-600 font-bold">{dateFilter === 'CUSTOM' ? `${startDate || 'Start'} to ${endDate || 'End'}` : dateFilter.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 overflow-x-auto border-b border-slate-200">
          <div className="flex min-w-max gap-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative rounded-t-lg px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {tab.label}

                  {isActive && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-indigo-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Contents */}
        <section className="min-w-0">
          {activeTab === 'overview' && (
            <OverviewTab
              stats={VENDOR_DATA.stats}
              bookings={filteredBookings}
              onOpenInspection={(booking) =>
                setSelectedBookingForInspection(booking)
              }
            />
          )}

          {activeTab === 'vehicles' && (
            <VehiclesTab
              vehicles={vehicles}
              onToggleStatus={handleToggleVehicleStatus}
              onOpenAddModal={() => setIsAddVehicleOpen(true)}
              onResubmitVehicle={handleResubmitVehicle}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsTab
              bookings={filteredBookings}
              onOpenInspection={(booking) =>
                setSelectedBookingForInspection(booking)
              }
            />
          )}

          {activeTab === 'earnings' && (
            <EarningsTab
              ledger={filteredLedger}
              stats={VENDOR_DATA.stats}
              bankDetails={VENDOR_DATA.owner.bankDetails}
            />
          )}

          {activeTab === 'reports_support' && (
            <VendorReportsAndSupportTab
              bookings={filteredBookings}
              ledger={filteredLedger}
              vehicles={vehicles}
              notifications={notifications}
              onUpdateNotifications={setNotifications}
            />
          )}

          {activeTab === 'profile_settings' && (
            <VendorProfileAndSettingsTab ownerData={VENDOR_DATA.owner} />
          )}
        </section>
      </main>

      {/* Return Inspection Modal */}
      {selectedBookingForInspection && (
        <InspectionModal
          booking={selectedBookingForInspection}
          onClose={() => setSelectedBookingForInspection(null)}
          onConfirm={handleConfirmReturn}
        />
      )}

      {/* Add Vehicle Modal */}
      {isAddVehicleOpen && (
        <AddVehicleModal
          onClose={() => setIsAddVehicleOpen(false)}
          onAddVehicle={handleAddVehicle}
        />
      )}
    </div>
  );
}