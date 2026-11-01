import React, { useState } from 'react';
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Users,
  CreditCard,
  MapPin,
  Building2,
  Tag,
  Star,
  Bell,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  Sparkles,
  X,
  PanelLeftClose,
  Zap,
  Percent,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar = ({
  activeTab,
  setActiveTab,
  openAddVehicleModal,
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed,
}) => {
  const [vehiclesOpen, setVehiclesOpen] = useState(true);
  const [bookingsOpen, setBookingsOpen] = useState(true);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0a110e] border-r border-[#1c3229] flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileOpen
            ? 'translate-x-0'
            : isCollapsed
            ? '-translate-x-full'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 flex items-center justify-between border-b border-[#1c3229]">
          <div
            onClick={() => handleTabClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none group"
            title="Go to Dashboard Overview"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D26A] to-[#059669] flex items-center justify-center text-black font-bold shadow-lg shadow-[#00D26A]/20 group-hover:scale-105 transition-transform">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" x2="4" y1="22" y2="15" />
              </svg>
            </div>
            <div>
              <h1 className="font-semibold text-white text-lg leading-tight tracking-tight flex items-center gap-1 group-hover:text-[#00D26A] transition-colors">
                Country Drive
              </h1>
              <p className="text-[11px] text-[#8ba398] font-medium tracking-wide">
                Admin Panel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Desktop Collapse Sidebar Button */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="hidden lg:flex p-1.5 rounded-lg text-[#8ba398] hover:text-white hover:bg-[#121e19] transition-colors cursor-pointer"
              title="Hide Sidebar (Ctrl + B)"
              aria-label="Hide Sidebar"
            >
              <PanelLeftClose size={18} />
            </button>
           
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 text-[#8ba398] hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-sm font-medium">
          {/* Dashboard Item */}
          <button
            onClick={() => handleTabClick('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'dashboard'
                ? 'btn-glossy btn-glossy-emerald'
                : 'text-[#8ba398] hover:text-white hover:bg-[#121e19]'
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          {/* Vehicles Dropdown */}
          <div className="pt-1">
            <button
              onClick={() => setVehiclesOpen(!vehiclesOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
                activeTab.startsWith('vehicles')
                  ? 'text-[#00D26A] bg-[#121e19] border border-[#00D26A]/30'
                  : 'text-[#8ba398] hover:text-white hover:bg-[#121e19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Car size={18} />
                <span>Vehicles</span>
              </div>
              {vehiclesOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </button>

            {vehiclesOpen && (
              <div className="ml-7 mt-1 space-y-0.5 border-l border-[#1c3229] pl-3 text-xs">
                <button
                  onClick={() => handleTabClick('vehicles')}
                  className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors ${
                    activeTab === 'vehicles'
                      ? 'text-[#00D26A] font-semibold bg-[#172721]'
                      : 'text-[#8ba398] hover:text-white'
                  }`}
                >
                  All Vehicles
                </button>
                <button
                  onClick={() => {
                    openAddVehicleModal();
                    handleTabClick('vehicles');
                  }}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-[#8ba398] hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <PlusCircle size={12} className="text-[#00D26A]" />
                  Add Vehicle
                </button>
                <button
                  onClick={() => handleTabClick('vehicles')}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-[#8ba398] hover:text-white transition-colors"
                >
                  Categories
                </button>
                <button
                  onClick={() => handleTabClick('vehicles')}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-[#8ba398] hover:text-white transition-colors"
                >
                  Availability
                </button>
              </div>
            )}
          </div>

          {/* Bookings Dropdown */}
          <div className="pt-1">
            <button
              onClick={() => {
                handleTabClick('bookings');
                setBookingsOpen(true);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
                activeTab.startsWith('bookings')
                  ? 'text-[#00D26A] bg-[#121e19] border border-[#00D26A]/30'
                  : 'text-[#8ba398] hover:text-white hover:bg-[#121e19]'
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarCheck size={18} />
                <span>Bookings</span>
              </div>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setBookingsOpen(!bookingsOpen);
                }}
                className="p-1 hover:text-white"
              >
                {bookingsOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </span>
            </button>

            {bookingsOpen && (
              <div className="ml-7 mt-1 space-y-0.5 border-l border-[#1c3229] pl-3 text-xs">
                <button
                  onClick={() => handleTabClick('bookings')}
                  className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors ${
                    activeTab === 'bookings' || activeTab === 'bookings:All'
                      ? 'text-[#00D26A] font-semibold bg-[#172721]'
                      : 'text-[#8ba398] hover:text-white'
                  }`}
                >
                  All Bookings
                </button>
                <button
                  onClick={() => handleTabClick('bookings:Pending')}
                  className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg transition-colors ${
                    activeTab === 'bookings:Pending'
                      ? 'text-amber-400 font-semibold bg-[#172721]'
                      : 'text-[#8ba398] hover:text-white'
                  }`}
                >
                  <span>Pending</span>
                  <span className="bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.5 rounded text-[10px]">
                    Review
                  </span>
                </button>
                <button
                  onClick={() => handleTabClick('bookings:Confirmed')}
                  className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg transition-colors ${
                    activeTab === 'bookings:Confirmed'
                      ? 'text-[#00D26A] font-semibold bg-[#172721]'
                      : 'text-[#8ba398] hover:text-white'
                  }`}
                >
                  <span>Confirmed</span>
                  <span className="bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded text-[10px]">
                    Upcoming
                  </span>
                </button>
                <button
                  onClick={() => handleTabClick('bookings:Active')}
                  className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg transition-colors ${
                    activeTab === 'bookings:Active'
                      ? 'text-sky-400 font-semibold bg-[#172721]'
                      : 'text-[#8ba398] hover:text-white'
                  }`}
                >
                  <span>Active</span>
                  <span className="bg-sky-500/20 text-sky-400 font-bold px-1.5 py-0.5 rounded text-[10px]">
                    Live
                  </span>
                </button>
                <button
                  onClick={() => handleTabClick('bookings:Completed')}
                  className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg transition-colors ${
                    activeTab === 'bookings:Completed'
                      ? 'text-teal-400 font-semibold bg-[#172721]'
                      : 'text-[#8ba398] hover:text-white'
                  }`}
                >
                  <span>Completed</span>
                  <span className="bg-teal-500/20 text-teal-400 font-bold px-1.5 py-0.5 rounded text-[10px]">
                    Done
                  </span>
                </button>
                <button
                  onClick={() => handleTabClick('bookings:Cancelled')}
                  className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg transition-colors ${
                    activeTab === 'bookings:Cancelled'
                      ? 'text-rose-400 font-semibold bg-[#172721]'
                      : 'text-[#8ba398] hover:text-white'
                  }`}
                >
                  <span>Cancelled</span>
                  <span className="bg-rose-500/20 text-rose-400 font-bold px-1.5 py-0.5 rounded text-[10px]">
                    Void
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Other Menu Items */}
          <button
            onClick={() => handleTabClick('users')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'users' || activeTab === 'customers' || activeTab === 'kyc'
                ? 'btn-glossy btn-glossy-emerald'
                : 'text-[#8ba398] hover:text-white hover:bg-[#121e19]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users size={18} />
              <span>Users & KYC</span>
            </div>
            <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              3 Pending
            </span>
          </button>

          <button
            onClick={() => handleTabClick('owners')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'owners' || activeTab === 'vendors'
                ? 'btn-glossy btn-glossy-emerald'
                : 'text-[#8ba398] hover:text-white hover:bg-[#121e19]'
            }`}
          >
            <Building2 size={18} />
            <span>Owners (80% Split)</span>
          </button>

          {/* Offers & Coupons (Matching backend 'offers' module) */}
          <button
            onClick={() => handleTabClick('offers')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'offers' || activeTab === 'coupons'
                ? 'btn-glossy btn-glossy-emerald'
                : 'text-[#8ba398] hover:text-white hover:bg-[#121e19]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Percent size={18} />
              <span>Offers & Coupons</span>
            </div>
            <span className="bg-[#00D26A]/20 text-[#00D26A] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              5 Active
            </span>
          </button>

          {/* Banners & Promo (Matching backend 'banners' module) */}
          <button
            onClick={() => handleTabClick('banners')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'banners'
                ? 'btn-glossy btn-glossy-emerald'
                : 'text-[#8ba398] hover:text-white hover:bg-[#121e19]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles size={18} />
              <span>Banners & Hero</span>
            </div>
            <span className="bg-sky-500/20 text-sky-400 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              Carousel
            </span>
          </button>

          {/* Subscriptions Hub (Matching backend 'subscriptions' module) */}
          <button
            onClick={() => handleTabClick('subscriptions')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'subscriptions'
                ? 'btn-glossy btn-glossy-emerald'
                : 'text-[#8ba398] hover:text-white hover:bg-[#121e19]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Zap size={18} />
              <span>Subscriptions</span>
            </div>
            <span className="bg-purple-500/20 text-purple-400 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              MRR
            </span>
          </button>

          {/* Pricing Rules */}
          <button
            onClick={() => handleTabClick('pricing')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'pricing'
                ? 'btn-glossy btn-glossy-emerald'
                : 'text-[#8ba398] hover:text-white hover:bg-[#121e19]'
            }`}
          >
            <Tag size={18} />
            <span>Pricing Rules</span>
          </button>

          <button
            onClick={() => handleTabClick('payments')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'payments'
                ? 'btn-glossy btn-glossy-emerald'
                : 'text-[#8ba398] hover:text-white hover:bg-[#121e19]'
            }`}
          >
            <CreditCard size={18} />
            <span>Payments & Finance</span>
          </button>

          <button
            onClick={() => handleTabClick('support')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'support' || activeTab === 'reviews'
                ? 'btn-glossy btn-glossy-emerald'
                : 'text-[#8ba398] hover:text-white hover:bg-[#121e19]'
            }`}
          >
            <Star size={18} />
            <span>Support Helpdesk</span>
          </button>

          <button
            onClick={() => handleTabClick('notifications')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'notifications'
                ? 'btn-glossy btn-glossy-emerald'
                : 'text-[#8ba398] hover:text-white hover:bg-[#121e19]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell size={18} />
              <span>Notifications</span>
            </div>
            <span className="bg-rose-500 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-full">
              12
            </span>
          </button>

          <button
            onClick={() => handleTabClick('reports')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'reports'
                ? 'btn-glossy btn-glossy-emerald'
                : 'text-[#8ba398] hover:text-white hover:bg-[#121e19]'
            }`}
          >
            <BarChart3 size={18} />
            <span>Reports & Analytics</span>
          </button>

          <button
            onClick={() => handleTabClick('audit')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'audit'
                ? 'btn-glossy btn-glossy-emerald'
                : 'text-[#8ba398] hover:text-white hover:bg-[#121e19]'
            }`}
          >
            <ShieldCheck size={18} />
            <span>Audit Logs</span>
          </button>

          <button
            onClick={() => handleTabClick('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              activeTab === 'settings'
                ? 'btn-glossy btn-glossy-emerald'
                : 'text-[#8ba398] hover:text-white hover:bg-[#121e19]'
            }`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>

        {/* Bottom Collapse Sidebar Action */}
        <div className="hidden lg:block px-3 py-2 border-t border-[#1c3229]">
          <button
            onClick={() => setIsCollapsed(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#8ba398] hover:text-white hover:bg-[#121e19] transition-colors border border-transparent hover:border-[#1c3229] cursor-pointer"
            title="Hide / Collapse Sidebar (Ctrl + B)"
          >
            <div className="flex items-center gap-2.5">
              <PanelLeftClose size={16} />
              <span>Hide Sidebar</span>
            </div>
            <span className="text-[10px] text-[#577064] font-mono bg-[#0a110e] px-1.5 py-0.5 rounded border border-[#1c3229]">
              Ctrl+B
            </span>
          </button>
        </div>

        {/* Promo Sidebar Banner Card */}
        <div className="p-3 border-t border-[#1c3229]">
          <div className="relative rounded-2xl overflow-hidden p-3 bg-gradient-to-br from-[#14261e] to-[#0e1814] border border-[#1c3229] group">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-500"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=400")',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a110e] via-[#0a110e]/70 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-center gap-1.5 text-[#00D26A] font-bold text-xs mb-1">
                <Sparkles size={14} />
                <span>Country Drive</span>
              </div>
              <h4 className="font-semibold text-white text-xs leading-snug drop-shadow">
                Explore More Roads
                <br />
                <span className="text-[#00D26A]">More Freedom.</span>
              </h4>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
