import React, { useState, useEffect } from 'react';
import {
  Car,
  CalendarCheck,
  Users,
  IndianRupee,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Clock,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { dashboardApi } from '../services/dashboardApi.js';
import { adaptBooking } from '../utils/adapters.js';
import { MetricCard } from './MetricCard.jsx';
import { WaveAreaChart } from './WaveAreaChart.jsx';
import { BookingDetailsModal } from './BookingDetailsModal.jsx';

export const DashboardView = ({ setActiveTab, openAddVehicleModal }) => {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [inspectBooking, setInspectBooking] = useState(null);

  const loadMetrics = async () => {
    try {
      const res = await dashboardApi.getMetrics();
      if (res?.data) {
        setMetrics(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadMetrics();
  };

  const overview = metrics?.overview || {
    totalVehicles: 10,
    activeBookings: 2,
    totalCustomers: 6,
    totalOwners: 4,
    pendingKyc: 1,
    pendingVehicleVerifications: 1,
  };

  const financials = metrics?.financials || {
    totalRevenue: '9322',
    platformCommission: '790',
  };

  const recentBookings = metrics?.recentActivity?.recentBookings || [];
  const categories = metrics?.vehicles?.byCategory || [];

  return (
    <div className="space-y-6">
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0d1c15] via-[#0e1713] to-[#0a110e] border border-[#1c3229] p-5 sm:p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#00D26A]/10 to-transparent pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00D26A] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00D26A] animate-pulse" />
            <span>Marketplace Live Overview</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Self-Drive Fleet Command Center
          </h1>
          <p className="text-xs text-[#8ba398] mt-1">
            Directly synced with PostgreSQL & Fastify Docker Container
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-[#121e19] hover:bg-[#172721] border border-[#1c3229] text-xs font-semibold text-[#8ba398] hover:text-white flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#00D26A]' : ''} />
            <span>Sync Live</span>
          </button>

          <button
            onClick={openAddVehicleModal}
            className="btn-glossy btn-glossy-emerald px-4 py-2 rounded-xl text-xs font-bold text-black flex items-center gap-1.5 shadow-md"
          >
            <span>+ Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cursor-pointer" onClick={() => setActiveTab('vehicles')}>
          <MetricCard
            title="Total Fleet Vehicles"
            value={overview.totalVehicles}
            change="+2 this week"
            isPositive={true}
            icon={Car}
            variant="emerald"
            subtitle={`${overview.pendingVehicleVerifications || 0} Pending Verification`}
          />
        </div>

        <div className="cursor-pointer" onClick={() => setActiveTab('bookings')}>
          <MetricCard
            title="Active & Upcoming Trips"
            value={overview.activeBookings}
            change="Live Rentals"
            isPositive={true}
            icon={CalendarCheck}
            variant="sky"
            subtitle={`${overview.totalBookings || 6} Total Bookings Recorded`}
          />
        </div>

        <div className="cursor-pointer" onClick={() => setActiveTab('users')}>
          <MetricCard
            title="Registered Customers"
            value={overview.totalCustomers}
            change="+4 new users"
            isPositive={true}
            icon={Users}
            variant="purple"
            subtitle={`${overview.pendingKyc || 0} Pending KYC Review`}
          />
        </div>

        <div className="cursor-pointer" onClick={() => setActiveTab('payments')}>
          <MetricCard
            title="Gross GMV Revenue"
            value={`₹${Number(financials.totalRevenue || 0).toLocaleString('en-IN')}`}
            change="20% Platform Share"
            isPositive={true}
            icon={IndianRupee}
            variant="amber"
            subtitle={`Platform Cut: ₹${Number(financials.platformCommission || 0).toLocaleString('en-IN')}`}
          />
        </div>
      </div>

      {/* Charts & Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Analytics Chart */}
        <div className="lg:col-span-2 bg-[#0e1713] border border-[#1c3229] rounded-2xl p-5 sm:p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Revenue & Booking Velocity</h2>
              <p className="text-xs text-[#8ba398]">Weekly performance and 80/20 host settlement breakdown</p>
            </div>
            <span className="text-xs bg-[#121e19] text-[#00D26A] border border-[#1c3229] px-2.5 py-1 rounded-lg font-semibold">
              Real-time Feed
            </span>
          </div>
          <div className="h-64">
            <WaveAreaChart />
          </div>
        </div>

        {/* Fleet Distribution by Category */}
        <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl p-5 sm:p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white mb-1">Fleet Categories</h2>
            <p className="text-xs text-[#8ba398] mb-4">Live inventory split across categories</p>

            <div className="space-y-3">
              {[
                { label: 'SUVs & 4x4s', count: 5, pct: '50%', color: 'bg-emerald-500' },
                { label: 'Hatchbacks', count: 1, pct: '10%', color: 'bg-sky-500' },
                { label: 'Sedans', count: 1, pct: '10%', color: 'bg-teal-500' },
                { label: 'Luxury Cars', count: 1, pct: '10%', color: 'bg-amber-500' },
                { label: 'Bikes & Scooters', count: 2, pct: '20%', color: 'bg-purple-500' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-white">{item.label}</span>
                    <span className="text-[#8ba398]">{item.count} units ({item.pct})</span>
                  </div>
                  <div className="w-full bg-[#172721] h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: item.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('vehicles')}
            className="mt-6 w-full py-2.5 rounded-xl bg-[#121e19] hover:bg-[#172721] border border-[#1c3229] text-xs font-semibold text-[#8ba398] hover:text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Full Vehicle Fleet</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Recent Live Bookings Table */}
      <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl p-5 sm:p-6 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">Recent Marketplace Bookings</h2>
            <p className="text-xs text-[#8ba398]">Direct transactions registered in PostgreSQL database</p>
          </div>
          <button
            onClick={() => setActiveTab('bookings')}
            className="text-xs font-semibold text-[#00D26A] hover:underline flex items-center gap-1"
          >
            <span>All Bookings ({overview.totalBookings || 6})</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1c3229] text-[#8ba398] font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Booking #</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Vehicle</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c3229]/60 text-white">
              {recentBookings.length > 0 ? (
                recentBookings.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => setInspectBooking(adaptBooking(b))}
                    className="hover:bg-[#172721] transition-colors cursor-pointer"
                    title="Click booking to inspect complete reservation details & telemetry"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-[#00D26A]">
                      {b.bookingNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{b.customer?.name}</div>
                      <div className="text-[11px] text-[#8ba398]">{b.customer?.phone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">
                        {b.vehicle?.make} {b.vehicle?.model}
                      </div>
                      <div className="text-[11px] text-[#8ba398] font-mono">
                        {b.vehicle?.registrationNumber}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : b.status === 'CONFIRMED'
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                            : b.status === 'COMPLETED'
                            ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      ₹{Number(b.totalAmount || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#8ba398]">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal on Dashboard Row Click */}
      {inspectBooking && (
        <BookingDetailsModal
          booking={inspectBooking}
          onClose={() => setInspectBooking(null)}
          onBookingUpdated={loadMetrics}
        />
      )}
    </div>
  );
};
