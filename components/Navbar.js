'use client';

import React from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  Bell,
  ShieldCheck,
} from 'lucide-react';

export default function ReportsNavbar({
  owner,
  selectedDateFilter = '30_DAYS',
  customStartDate = '',
  customEndDate = '',
  onDateFilterChange,
  onCustomDateChange,
  ledgerData = [],
  unreadNotificationsCount = 2,
  onNotificationClick,
}) {
  const handleExportStatement = () => {
    if (!ledgerData || ledgerData.length === 0) {
      alert('Export karne ke liye koi ledger records available nahi hain.');
      return;
    }

    const headers = [
      'Transaction ID',
      'Date',
      'Booking Reference',
      'Transaction Type',
      'Gross Total (INR)',
      'Owner Net Share (80%)',
      'Platform Fee (20%)',
      'Payout Status',
    ];

    const rows = ledgerData.map((tx) => [
      `"${tx.id || ''}"`,
      `"${tx.date || ''}"`,
      `"${tx.bookingId || ''}"`,
      `"${tx.type || ''}"`,
      `"${tx.grossAmount || 0}"`,
      `"${tx.ownerEarning || 0}"`,
      `"${tx.platformFee || 0}"`,
      `"${tx.status || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `DriveHub_Financial_Statement_${selectedDateFilter}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:px-5 sm:py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        
        {/* Top Header Row on Mobile */}
        <div className="flex w-full items-center justify-between lg:w-auto">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm sm:h-11 sm:w-11">
              <BarChart3 className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold leading-tight text-slate-900 sm:text-base">
                DriveHub Partner
              </h1>
              <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
                Vendor Portal & Reports
              </p>
            </div>
          </div>

          {/* Right Action Icons for Mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={onNotificationClick}
              className="relative rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100"
            >
              <Bell className="h-4 w-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>KYC</span>
            </div>
          </div>
        </div>

        {/* Date Filter & Export Row (Wraps automatically on Mobile) */}
        <div className="flex w-full flex-wrap items-center justify-between gap-2 overflow-x-auto pb-1 pt-1 lg:w-auto lg:justify-end lg:pb-0 lg:pt-0">
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50/90 p-1">
            <Calendar className="ml-1.5 h-3.5 w-3.5 text-slate-400 shrink-0" />
            {[
              { id: 'TODAY', label: 'Today' },
              { id: '7_DAYS', label: '7D' },
              { id: '30_DAYS', label: '30D' },
              { id: 'CUSTOM', label: 'Custom' },
              { id: 'ALL', label: 'All' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onDateFilterChange?.(item.id)}
                className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition whitespace-nowrap ${
                  selectedDateFilter === item.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Custom Date Pickers for Mobile & Desktop */}
          {selectedDateFilter === 'CUSTOM' && (
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-[11px]">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => onCustomDateChange?.(e.target.value, customEndDate)}
                className="bg-transparent text-slate-700 outline-none w-24"
              />
              <span className="text-slate-400">-</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => onCustomDateChange?.(customStartDate, e.target.value)}
                className="bg-transparent text-slate-700 outline-none w-24"
              />
            </div>
          )}

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExportStatement}
            className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-black shrink-0"
          >
            <Download className="h-3.5 w-3.5 text-indigo-400" />
            Export
          </button>
        </div>

        {/* Desktop Profile Info */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onNotificationClick}
            className="relative rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100"
          >
            <Bell className="h-5 w-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">KYC Verified</span>
          </div>

          <div className="text-right">
            <p className="max-w-36 truncate text-sm font-semibold text-slate-800">{owner?.name || 'Anuj Kumar'}</p>
            <p className="text-xs text-slate-500">ID: {owner?.id || 'Anuj_7518'}</p>
          </div>
        </div>

      </div>
    </header>
  );
}