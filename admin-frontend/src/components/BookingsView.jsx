import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  XCircle,
  Eye,
  MapPin,
  Calendar,
  Filter,
  RefreshCw,
  Car,
  Clock,
  IndianRupee,
  CalendarCheck,
  TrendingUp,
} from 'lucide-react';

import { bookingsApi } from '../services/bookingsApi.js';
import { adaptBooking } from '../utils/adapters.js';
import { initialBookings } from '../data/mockData.js';
import { BookingDetailsModal } from './BookingDetailsModal.jsx';

const statusTabs = ['All', 'Confirmed', 'Pending', 'Active', 'Completed', 'Cancelled'];

const matchesStatusTab = (bookingStatus, tab) => {
  if (tab === 'All') return true;
  const s = (bookingStatus || '').toUpperCase();
  switch (tab) {
    case 'Confirmed':
      return s === 'CONFIRMED' || s === 'UPCOMING';
    case 'Pending':
      return s === 'PENDING' || s === 'DRAFT' || s === 'PAYMENT_PENDING' || s === 'PICKUP_PENDING';
    case 'Active':
      return s === 'ACTIVE' || s === 'RETURN_PENDING' || s === 'INSPECTION';
    case 'Completed':
      return s === 'COMPLETED' || s === 'SETTLEMENT';
    case 'Cancelled':
      return s === 'CANCELLED' || s === 'REJECTED' || s === 'EXPIRED' || s === 'DISPUTED';
    default:
      return s === tab.toUpperCase();
  }
};

export const BookingsView = ({
  bookings: initialPropBookings,
  onOpenBookingDetails,
  searchQuery = '',
  activeStatusFilter = 'All',
}) => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(activeStatusFilter || 'All');
  const [search, setSearch] = useState(searchQuery || '');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Sync tab when prop changes from sidebar navigation
  useEffect(() => {
    if (activeStatusFilter && statusTabs.includes(activeStatusFilter)) {
      setActiveTab(activeStatusFilter);
    }
  }, [activeStatusFilter]);

  // Sync search query from global header
  useEffect(() => {
    if (searchQuery !== undefined) {
      setSearch(searchQuery);
    }
  }, [searchQuery]);

  const loadBookings = async () => {
    try {
      const res = await bookingsApi.getBookings();
      const raw = Array.isArray(res?.data) ? res.data : res?.data?.bookings || [];
      if (raw.length > 0) {
        const adapted = raw.map(adaptBooking).filter(Boolean);
        setBookings(adapted);
      } else if (initialBookings && initialBookings.length > 0) {
        // Graceful fallback to rich mock data if DB has no bookings
        setBookings(initialBookings);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.warn('Backend bookings fetch notice, using fallback data:', err);
      if (initialBookings && initialBookings.length > 0) {
        setBookings(initialBookings);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (initialPropBookings && initialPropBookings.length > 0) {
      setBookings(initialPropBookings);
      setIsLoading(false);
    } else {
      loadBookings();
    }
  }, [initialPropBookings]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadBookings();
  };

  const handleOpenDetails = (booking) => {
    if (onOpenBookingDetails) {
      onOpenBookingDetails(booking);
    } else {
      setSelectedBooking(booking);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'CONFIRMED' || s === 'UPCOMING') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-[#00D26A] border border-[#00D26A]/30">
          <CheckCircle size={11} />
          {s === 'UPCOMING' ? 'Upcoming' : 'Confirmed'}
        </span>
      );
    }
    if (s === 'ACTIVE' || s === 'RETURN_PENDING' || s === 'INSPECTION') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">
          <PlayCircle size={11} />
          Active Trip
        </span>
      );
    }
    if (s === 'COMPLETED' || s === 'SETTLEMENT') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
          <CheckCircle size={11} />
          Completed
        </span>
      );
    }
    if (s === 'CANCELLED' || s === 'REJECTED' || s === 'EXPIRED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <XCircle size={11} />
          Cancelled
        </span>
      );
    }
    // Default Pending / Draft
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
        <AlertCircle size={11} />
        {s === 'PAYMENT_PENDING' ? 'Pay Pending' : 'Pending'}
      </span>
    );
  };

  const list = bookings || [];

  const filteredBookings = list.filter((b) => {
    const bNum = b.bookingNumber || b.id || '';
    const custName = b.customer?.name || b.customerName || '';
    const custPhone = b.customer?.phone || b.customerPhone || '';
    const vehName = b.vehicle?.name || b.vehicleName || '';
    const vehReg = b.vehicle?.registrationNumber || b.registrationNo || '';
    const loc = b.pickupLocation || b.vehicle?.city || '';

    const matchesTab = matchesStatusTab(b.status, activeTab);

    const matchesSearch =
      bNum.toLowerCase().includes(search.toLowerCase()) ||
      custName.toLowerCase().includes(search.toLowerCase()) ||
      custPhone.includes(search) ||
      vehName.toLowerCase().includes(search.toLowerCase()) ||
      vehReg.toLowerCase().includes(search.toLowerCase()) ||
      loc.toLowerCase().includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // KPI calculations
  const totalCount = list.length;
  const confirmedCount = list.filter((b) => matchesStatusTab(b.status, 'Confirmed')).length;
  const activeCount = list.filter((b) => matchesStatusTab(b.status, 'Active')).length;
  const totalGrossRevenue = list.reduce(
    (sum, b) => sum + Number(b.totalAmount || b.amount || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarCheck size={24} className="text-[#00D26A]" />
            <span>Bookings Directory</span>
          </h1>
          <p className="text-xs text-[#8ba398] mt-0.5">
            Manage customer reservations, track live rental sessions, review commercial splits, and process cancellations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-[#121e19] hover:bg-[#172721] border border-[#1c3229] text-xs font-semibold text-[#8ba398] hover:text-white flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#00D26A]' : ''} />
            <span>Sync Live</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121e19] border border-[#1c3229] rounded-2xl p-4 flex flex-col justify-between hover:border-[#00D26A]/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#8ba398] font-medium">Total Reservations</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-[#00D26A]">
              <CalendarCheck size={18} />
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{totalCount}</h3>
            <p className="text-[11px] text-[#577064] mt-1">All recorded marketplace bookings</p>
          </div>
        </div>

        <div className="bg-[#121e19] border border-[#1c3229] rounded-2xl p-4 flex flex-col justify-between hover:border-[#00D26A]/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#8ba398] font-medium">Confirmed & Upcoming</span>
            <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <CheckCircle size={18} />
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-sky-400">{confirmedCount}</h3>
            <p className="text-[11px] text-[#577064] mt-1">Scheduled for pickup</p>
          </div>
        </div>

        <div className="bg-[#121e19] border border-[#1c3229] rounded-2xl p-4 flex flex-col justify-between hover:border-[#00D26A]/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#8ba398] font-medium">Active Trips on Road</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-[#00D26A]">
              <Car size={18} />
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#00D26A]">{activeCount}</h3>
            <p className="text-[11px] text-[#577064] mt-1">Vehicles currently out with drivers</p>
          </div>
        </div>

        <div className="bg-[#121e19] border border-[#1c3229] rounded-2xl p-4 flex flex-col justify-between hover:border-[#00D26A]/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#8ba398] font-medium">Gross Booking Value</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <IndianRupee size={18} />
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              ₹{totalGrossRevenue.toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-[#577064] mt-1">Including 20% platform share</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-[#121e19] border border-[#1c3229] rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1 bg-[#0a110e] p-1 rounded-xl border border-[#1c3229] overflow-x-auto w-full md:w-auto">
          {statusTabs.map((tab) => {
            const count = list.filter((b) => matchesStatusTab(b.status, tab)).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === tab
                    ? 'btn-glossy btn-glossy-pill-active'
                    : 'btn-glossy-pill-inactive'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === tab
                      ? 'bg-black/20 text-black'
                      : 'bg-[#172721] text-[#8ba398]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-2.5 text-[#577064]" />
          <input
            type="text"
            placeholder="Search ID, customer, vehicle, reg #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a110e] border border-[#1c3229] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#577064] focus:outline-none focus:border-[#00D26A]"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#121e19] border border-[#1c3229] rounded-2xl p-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1c3229] text-[11px] text-[#577064] uppercase font-medium">
              <th className="pb-3 px-2">Booking ID</th>
              <th className="pb-3 px-2">Customer</th>
              <th className="pb-3 px-2">Vehicle</th>
              <th className="pb-3 px-2">Pickup Location</th>
              <th className="pb-3 px-2">Date & Time</th>
              <th className="pb-3 px-2">Duration</th>
              <th className="pb-3 px-2">Total Amount</th>
              <th className="pb-3 px-2">Status</th>
              <th className="pb-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c3229]/60 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-[#8ba398]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <RefreshCw size={20} className="animate-spin text-[#00D26A]" />
                    <span className="text-xs">Loading marketplace bookings...</span>
                  </div>
                </td>
              </tr>
            ) : filteredBookings.length > 0 ? (
              filteredBookings.map((b) => {
                const bookingNo = b.bookingNumber || b.id || '';
                const customerName = b.customer?.name || b.customerName || 'Customer';
                const customerPhone = b.customer?.phone || b.customerPhone || '';
                const vehicleName = b.vehicle?.name || b.vehicleName || 'Vehicle';
                const vehicleReg = b.vehicle?.registrationNumber || b.registrationNo || '';
                const pickupLoc = b.pickupLocation || b.vehicle?.city || 'Delhi NCR';
                const dateDisplay =
                  b.dateTime ||
                  (b.startDate
                    ? new Date(b.startDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Scheduled');
                const totalAmount = Number(b.totalAmount || b.amount || 0);

                return (
                  <tr
                    key={b.id}
                    onClick={() => handleOpenDetails(b)}
                    className="hover:bg-[#172721] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-2 font-mono font-semibold text-[#00D26A]">
                      {bookingNo}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-600/20 border border-[#1c3229] flex items-center justify-center font-bold text-[#00D26A] text-xs">
                          {customerName[0]?.toUpperCase() || 'C'}
                        </div>
                        <div>
                          <p className="font-semibold text-white leading-tight group-hover:text-[#00D26A] transition-colors">
                            {customerName}
                          </p>
                          <p className="text-[10px] text-[#577064]">{customerPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div>
                        <span className="font-medium text-white">{vehicleName}</span>
                        {vehicleReg && (
                          <span className="block text-[10px] font-mono text-[#577064]">
                            {vehicleReg}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-[#8ba398]">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-[#00D26A] flex-shrink-0" />
                        <span className="truncate max-w-[130px]">{pickupLoc}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-[#8ba398] whitespace-nowrap">{dateDisplay}</td>
                    <td className="py-3 px-2 text-[#8ba398]">{b.planType || b.duration || 'Daily'}</td>
                    <td className="py-3 px-2 font-semibold text-white whitespace-nowrap">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-2 whitespace-nowrap">{getStatusBadge(b.status)}</td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetails(b);
                        }}
                        className="p-1.5 rounded-lg text-[#8ba398] hover:text-white hover:bg-[#0a110e] border border-transparent hover:border-[#1c3229] transition-all"
                        title="View Full Booking Details"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="py-10 text-center text-[#8ba398]">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <CalendarCheck size={28} className="text-[#577064]" />
                    <p className="text-sm font-semibold text-white">No bookings found</p>
                    <p className="text-xs text-[#577064]">
                      {search ? `No bookings matched "${search}"` : `No bookings in "${activeTab}" status`}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onBookingUpdated={() => {
            loadBookings();
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
};
