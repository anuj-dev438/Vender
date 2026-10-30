import React from 'react';
import { TrendingUp, Wallet, Car, Clock } from 'lucide-react';

export default function OverviewTab({ stats, bookings, onOpenInspection }) {
  const activeBookings = (Array.isArray(bookings) ? bookings : []).filter(
    (b) => b.status === 'ACTIVE' || b.status === 'RETURN_PENDING'
  );

  const formatINR = (amount) =>
    (Number(amount) || 0).toLocaleString('en-IN');

  return (
    <div className="space-y-6 bg-white">
      {/* 80/20 Commission Banner */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-indigo-200 bg-indigo-50 p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-indigo-100 bg-white p-2.5 text-indigo-600 shadow-sm">
            <TrendingUp className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">
              Revenue Commission Model Active
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              You receive{' '}
              <span className="font-bold text-emerald-700">80%</span> of gross
              booking revenue. Platform commission is{' '}
              <span className="font-bold text-indigo-700">20%</span>.
            </p>
          </div>
        </div>

        <span className="whitespace-nowrap rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700">
          PRD Commercial Standard
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Gross Revenue */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Gross Revenue
            </span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-slate-900">
            ₹{formatINR(stats.totalRevenue)}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Total customer payments
          </p>
        </div>

        {/* Owner Earnings */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              My Share (80%)
            </span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-emerald-700">
            ₹{formatINR(stats.ownerEarnings)}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Net owner earnings
          </p>
        </div>

        {/* Platform Fee */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Platform Fee (20%)
            </span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Car className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-indigo-700">
            ₹{formatINR(stats.platformCommission)}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Platform service fee
          </p>
        </div>

        {/* Pending Payout */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-200 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Payout
            </span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-amber-700">
            ₹{formatINR(stats.pendingSettlement)}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Next payout batch
          </p>
        </div>
      </div>

      {/* Active Rentals */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Active & Pending Rentals
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Manage ongoing rentals and vehicle returns.
            </p>
          </div>
          <span className="ml-auto rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
            {activeBookings.length} rentals
          </span>
        </div>

        <div className="space-y-3 p-4 sm:p-5">
          {activeBookings.length > 0 ? (
            activeBookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:bg-slate-50/70 md:flex-row md:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {b.vehicleName}
                    </span>

                    <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                      {b.id}
                    </span>

                    {b.status === 'RETURN_PENDING' && (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        Return Due
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Customer:{' '}
                    <span className="font-medium text-slate-800">
                      {b.customerName}
                    </span>{' '}
                    <span className="text-slate-500">
                      ({b.customerPhone})
                    </span>
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Pickup:{' '}
                    <span className="text-slate-700">
                      {b.pickupTime}
                    </span>{' '}
                    <span className="mx-1 text-slate-300">|</span>
                    Return:{' '}
                    <span className="text-slate-700">
                      {b.returnTime}
                    </span>
                  </p>
                </div>

                <div className="flex w-full items-center justify-between gap-4 border-t border-slate-100 pt-3 md:w-auto md:justify-end md:border-0 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="block text-xs text-slate-500">
                      Owner Share (80%)
                    </span>
                    <span className="mt-1 block text-lg font-bold text-emerald-700">
                      ₹{formatINR(b.ownerShare)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenInspection(b)}
                    className="rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Inspect & Return
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <Car className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800">
                No active rentals
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Active and pending rentals will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}