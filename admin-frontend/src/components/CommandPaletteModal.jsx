import React, { useState, useEffect } from 'react';
import { Search, Car, Calendar, User, X, ArrowRight } from 'lucide-react';
import { initialVehicles, initialBookings, initialCustomers } from '@/data/mockData';

export const CommandPaletteModal = ({
  isOpen,
  onClose,
  onNavigateTab,
  setActiveTab,
}) => {
  const [query, setQuery] = useState('');
  const navigate = onNavigateTab || setActiveTab;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedVehicles = initialVehicles.filter((v) =>
    v.name.toLowerCase().includes(query.toLowerCase())
  );
  const matchedBookings = initialBookings.filter(
    (b) =>
      b.id.toLowerCase().includes(query.toLowerCase()) ||
      b.customerName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
      <div className="bg-[#121e19] border border-[#1c3229] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Header Input */}
        <div className="p-4 border-b border-[#1c3229] flex items-center gap-3 bg-[#172721]">
          <Search size={18} className="text-[#00D26A]" />
          <input
            type="text"
            placeholder="Search vehicles, bookings, customers, or commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-[#8ba398] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#8ba398] hover:text-white rounded-lg bg-[#0a110e]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-4">
          {/* Quick Pages */}
          {!query && (
            <div>
              <p className="text-[10px] font-bold uppercase text-[#577064] px-2 mb-1.5">
                Quick Navigation
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { name: 'Dashboard Overview', tab: 'dashboard' },
                  { name: 'Vehicles Inventory', tab: 'vehicles' },
                  { name: 'Bookings Directory', tab: 'bookings' },
                  { name: 'Customer Directory', tab: 'customers' },
                  { name: 'Offers & Coupons', tab: 'offers' },
                  { name: 'Banners & Hero', tab: 'banners' },
                  { name: 'Subscriptions Hub', tab: 'subscriptions' },
                  { name: 'Payment Transactions', tab: 'payments' },
                  { name: 'Reports & Analytics', tab: 'reports' },
                  { name: 'Audit Security Logs', tab: 'audit' },
                ].map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => {
                      navigate && navigate(item.tab);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-xl text-[#8ba398] hover:text-white hover:bg-[#172721] transition-colors text-left"
                  >
                    <span>{item.name}</span>
                    <ArrowRight size={13} className="text-[#00D26A]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Vehicles Results */}
          {matchedVehicles.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase text-[#577064] px-2 mb-1.5">
                Vehicles ({matchedVehicles.length})
              </p>
              <div className="space-y-1">
                {matchedVehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      navigate && navigate('vehicles');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs hover:bg-[#172721] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Car size={15} className="text-[#00D26A]" />
                      <div>
                        <p className="font-semibold text-white">{v.name}</p>
                        <p className="text-[10px] text-[#577064]">{v.registrationNo}</p>
                      </div>
                    </div>
                    <span className="text-[#00D26A] font-semibold">₹{v.pricePerDay}/day</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bookings Results */}
          {matchedBookings.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase text-[#577064] px-2 mb-1.5">
                Bookings ({matchedBookings.length})
              </p>
              <div className="space-y-1">
                {matchedBookings.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      navigate && navigate('bookings');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs hover:bg-[#172721] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar size={15} className="text-amber-400" />
                      <div>
                        <p className="font-semibold text-white">
                          {b.id} - {b.customerName}
                        </p>
                        <p className="text-[10px] text-[#577064]">{b.vehicleName}</p>
                      </div>
                    </div>
                    <span className="text-white font-semibold">₹{b.amount}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-2.5 border-t border-[#1c3229] bg-[#0a110e] text-[11px] text-[#577064] flex items-center justify-between px-4">
          <span>Press <kbd className="bg-[#1c3229] px-1 rounded text-white">ESC</kbd> to close</span>
          <span>Country Drive Command Palette</span>
        </div>
      </div>
    </div>
  );
};
