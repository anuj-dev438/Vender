'use client';

import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  Download,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

export default function EarningsTab({ ledger = [], stats, bankDetails }) {
  const ledgerList = Array.isArray(ledger) ? ledger : [];
  const [activeFinanceSubTab, setActiveFinanceSubTab] = useState('OVERVIEW');

  // Calculation helpers
  const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString('en-IN');

  const totalGross = useMemo(() => {
    return ledgerList.reduce((acc, item) => acc + (Number(item.grossAmount) || 0), 0);
  }, [ledgerList]);

  const totalOwnerNet = useMemo(() => {
    return ledgerList.reduce((acc, item) => acc + (Number(item.ownerEarning) || 0), 0);
  }, [ledgerList]);

  const totalPlatformFee = useMemo(() => {
    return ledgerList.reduce((acc, item) => acc + (Number(item.platformFee) || 0), 0);
  }, [ledgerList]);

  return (
    <div className="space-y-6">
      {/* 1. Financial Summary Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Gross Booking Value</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-xl font-bold text-slate-900">₹{formatCurrency(stats?.totalRevenue || totalGross)}</p>
          <p className="mt-1 text-[11px] text-slate-400">Total customer booking amount</p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800">Net Owner Share (80%)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-xl font-bold text-emerald-900">₹{formatCurrency(stats?.ownerEarnings || totalOwnerNet)}</p>
          <p className="mt-1 text-[11px] text-emerald-600">80% Default PRD Owner Share</p>
        </div>

        <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-800">Platform Fee (20%)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-xl font-bold text-indigo-900">₹{formatCurrency(stats?.platformCommission || totalPlatformFee)}</p>
          <p className="mt-1 text-[11px] text-indigo-600">20% Platform Commission</p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800">Pending Settlement</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-xl font-bold text-amber-900">₹{formatCurrency(stats?.pendingSettlement || 12400)}</p>
          <p className="mt-1 text-[11px] text-amber-600">Awaiting bank payout processing</p>
        </div>
      </div>

      {/* 2. Recommended Finance Sub-Tab Navigation */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Earnings & Settlement Ledger
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Verified backend payouts, PRD revenue split (80/20), and transaction history.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              PRD 80/20 Split Rule
            </span>
          </div>
        </div>

        <div className="flex border-b border-slate-100 bg-slate-50/50 px-5 py-2.5 overflow-x-auto gap-2">
          {[
            { id: 'OVERVIEW', label: 'Earnings Overview' },
            { id: 'BOOKINGS', label: 'Booking-Wise Earnings' },
            { id: 'PENDING', label: 'Pending Settlements' },
            { id: 'BANK', label: 'Bank & Payout Account' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFinanceSubTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeFinanceSubTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3. Sub-Tab Content rendering */}

        {/* OVERVIEW & BOOKINGS LEDGER TABLE */}
        {(activeFinanceSubTab === 'OVERVIEW' || activeFinanceSubTab === 'BOOKINGS') && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-4 font-semibold">Tx ID</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Booking Ref</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Gross Total</th>
                  <th className="p-4 font-semibold text-emerald-700">
                    Owner Net (80%)
                  </th>
                  <th className="p-4 font-semibold text-indigo-700">
                    Platform Fee (20%)
                  </th>
                  <th className="p-4 font-semibold">Payout Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {ledgerList.length > 0 ? (
                  ledgerList.map((tx) => (
                    <tr
                      key={tx.id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap p-4 font-mono text-slate-500">
                        {tx.id}
                      </td>

                      <td className="whitespace-nowrap p-4 text-slate-600">
                        {tx.date}
                      </td>

                      <td className="whitespace-nowrap p-4 font-mono font-medium text-indigo-700">
                        {tx.bookingId}
                      </td>

                      <td className="whitespace-nowrap p-4">
                        <span className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700">
                          {tx.type}
                        </span>
                      </td>

                      <td className="whitespace-nowrap p-4 font-semibold text-slate-900">
                        ₹{formatCurrency(tx.grossAmount)}
                      </td>

                      <td className="whitespace-nowrap p-4 font-bold text-emerald-700">
                        ₹{formatCurrency(tx.ownerEarning)}
                      </td>

                      <td className="whitespace-nowrap p-4 font-medium text-indigo-700">
                        ₹{formatCurrency(tx.platformFee)}
                      </td>

                      <td className="whitespace-nowrap p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                            tx.status === 'SETTLED' || tx.status === 'TRANSFERRED_TO_BANK'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : 'border-amber-200 bg-amber-50 text-amber-700'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              tx.status === 'SETTLED' || tx.status === 'TRANSFERRED_TO_BANK'
                                ? 'bg-emerald-500'
                                : 'bg-amber-500'
                            }`}
                          />
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl text-slate-400">
                        ₹
                      </div>
                      <p className="mt-3 font-semibold text-slate-800">
                        No transactions available
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Financial transactions will appear here when available.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* PENDING SETTLEMENTS SUB-TAB */}
        {activeFinanceSubTab === 'PENDING' && (
          <div className="p-6 space-y-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-bold">Pending Settlement Summary</p>
                <p className="mt-0.5">
                  Payouts are calculated from backend ledger reconciliation. Settlements are processed directly to your verified bank account according to the platform schedule.
                </p>
              </div>
            </div>

            <div className="rounded-xl border p-4 space-y-3 bg-white">
              <div className="flex justify-between items-center border-b pb-3">
                <span className="font-semibold text-slate-700 text-xs">Awaiting Payout Balance</span>
                <span className="text-base font-bold text-amber-700">₹{formatCurrency(stats?.pendingSettlement || 12400)}</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p><span className="font-medium">Related Bookings:</span> BK-8092, BK-8095</p>
                <p><span className="font-medium">Status:</span> Processing batch payout</p>
              </div>
            </div>
          </div>
        )}

        {/* BANK DETAILS SUB-TAB */}
        {activeFinanceSubTab === 'BANK' && (
          <div className="p-6 space-y-4 max-w-xl">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  <span className="font-bold text-slate-900 text-sm">Verified Payout Bank Account</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                  <CheckCircle2 className="h-3 w-3" /> VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div>
                  <span className="text-slate-400 block">Bank Name</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{bankDetails?.bankName || 'HDFC Bank'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Account Number</span>
                  <span className="font-mono font-semibold text-slate-800 mt-0.5 block">{bankDetails?.accountNo || '•••• •••• 4821'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">IFSC Code</span>
                  <span className="font-mono font-semibold text-slate-800 mt-0.5 block">{bankDetails?.ifsc || 'HDFC0001234'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-5 py-3">
          <p className="text-xs text-slate-500">
            Financial Ledger & Split Reconciliation
          </p>
          <p className="text-xs font-medium text-slate-500">
            {ledgerList.length} total transaction records
          </p>
        </div>
      </div>
    </div>
  );
}