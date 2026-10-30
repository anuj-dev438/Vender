// components/VendorReportsAndSupportTab.jsx
'use client';

import React, { useState } from 'react';
import {
  Users,
  Bell,
  LifeBuoy,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  Plus,
  FileText,
  Search,
  Filter,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  Download
} from 'lucide-react';

export default function VendorReportsAndSupportTab({ bookings = [], ledger = [], vehicles = [] }) {
  const [activeSubTab, setActiveSubTab] = useState('REPORTS');

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 'NOTIF-1', title: 'Vehicle Approved', desc: 'Hyundai Creta (KA-01-MJ-4321) has been verified and approved.', time: '2 hours ago', unread: true, type: 'SUCCESS' },
    { id: 'NOTIF-2', title: 'New Booking Confirmed', desc: 'Booking BK-8092 confirmed for Hyundai Creta.', time: '5 hours ago', unread: true, type: 'BOOKING' },
    { id: 'NOTIF-3', title: 'Settlement Processed', desc: 'Payout of ₹12,400 transferred to HDFC Bank •••• 4821.', time: '1 day ago', unread: false, type: 'FINANCE' },
  ]);

  // Support Tickets State
  const [tickets, setTickets] = useState([
    { id: 'TCK-501', category: 'Payment', subject: 'Payout delay for transaction TX-901', status: 'IN_REVIEW', date: '2026-10-25' },
    { id: 'TCK-489', category: 'Damage', subject: 'Dispute over minor scratch on Thar bumper', status: 'RESOLVED', date: '2026-10-20' },
  ]);

  const [newTicket, setNewTicket] = useState({ category: 'Booking', subject: '', description: '' });
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  const formatCurrency = (amount) => Number(amount || 0).toLocaleString('en-IN');

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTicket.subject) return;
    const ticket = {
      id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
      category: newTicket.category,
      subject: newTicket.subject,
      status: 'OPEN',
      date: new Date().toISOString().split('T')[0]
    };
    setTickets([ticket, ...tickets]);
    setNewTicket({ category: 'Booking', subject: '', description: '' });
    setShowNewTicketModal(false);
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Sub-Tab Navigation */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Analytics, Notifications & Support Center
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Track business performance metrics, customer history, real-time alerts, and file support tickets.
            </p>
          </div>
        </div>

        <div className="flex border-b border-slate-100 bg-slate-50/50 px-5 py-2.5 overflow-x-auto gap-2">
          {[
            { id: 'REPORTS', label: 'Reports & Analytics', icon: BarChart3 },
            { id: 'CUSTOMERS', label: 'Customer History', icon: Users },
            { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell },
            { id: 'SUPPORT', label: 'Support & Disputes', icon: LifeBuoy },
          ].map((tab) => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeSubTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <IconComp className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 1. REPORTS & ANALYTICS TAB ================= */}
      {activeSubTab === 'REPORTS' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Total Bookings Executed</span>
              <p className="mt-2 text-2xl font-bold text-slate-900">{bookings.length}</p>
              <p className="mt-1 text-[11px] text-emerald-600 font-semibold">100% Backend Reconciled</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Fleet Utilization Rate</span>
              <p className="mt-2 text-2xl font-bold text-slate-900">78.5%</p>
              <p className="mt-1 text-[11px] text-indigo-600 font-semibold">Active vs Maintenance Ratio</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Average Booking Value</span>
              <p className="mt-2 text-2xl font-bold text-slate-900">₹2,100</p>
              <p className="mt-1 text-[11px] text-slate-400">Based on completed rentals</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Vehicle Performance Breakdown</h3>
                <p className="text-xs text-slate-500">Revenue and trip metrics per vehicle</p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-md font-semibold">Last 30 Days</span>
            </div>

            <div className="divide-y text-xs">
              {vehicles.map((v) => (
                <div key={v.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900">{v.name}</p>
                    <p className="text-slate-500 font-mono text-[11px]">{v.regNumber} — {v.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-700">₹{v.totalEarned || 15000}</p>
                    <p className="text-slate-500 text-[11px]">{v.totalTrips || 12} Trips completed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. CUSTOMER HISTORY TAB ================= */}
      {activeSubTab === 'CUSTOMERS' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5 border-b bg-slate-50 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Authorized Customer Directory</h3>
              <p className="text-xs text-slate-500">Associated renters and permitted contact records</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 font-semibold border-b">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">KYC Status</th>
                  <th className="p-4">Total Rentals</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{b.customerName || 'Rahul Verma'}</td>
                    <td className="p-4 font-mono text-slate-600">{b.customerPhone || '+91 9123456789'}</td>
                    <td className="p-4">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        Verified
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">3 Trips</td>
                    <td className="p-4 text-right">
                      <span className="text-indigo-600 font-semibold hover:underline cursor-pointer">View History</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= 3. NOTIFICATIONS TAB ================= */}
      {activeSubTab === 'NOTIFICATIONS' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5 border-b bg-slate-50 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Notification Center</h3>
              <p className="text-xs text-slate-500">Real-time alerts for bookings, approvals, and settlements</p>
            </div>
            <button
              onClick={markAllRead}
              className="text-xs font-semibold text-indigo-600 hover:underline bg-indigo-50 px-3 py-1.5 rounded-lg"
            >
              Mark all as read
            </button>
          </div>

          <div className="divide-y">
            {notifications.map((n) => (
              <div key={n.id} className={`p-4 flex items-start gap-3 transition ${n.unread ? 'bg-indigo-50/40' : 'bg-white'}`}>
                <div className={`mt-0.5 p-2 rounded-xl ${n.unread ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 4. SUPPORT & DISPUTES TAB ================= */}
      {activeSubTab === 'SUPPORT' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Vendor Support & Ticket Management</h3>
              <p className="text-xs text-slate-500">Raise issues regarding bookings, payouts, or vehicle damages</p>
            </div>
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 shadow-sm"
            >
              <Plus className="h-4 w-4" /> Raise New Ticket
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 font-semibold border-b">
                  <tr>
                    <th className="p-4">Ticket ID</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono font-medium text-slate-700">{t.id}</td>
                      <td className="p-4 font-semibold text-slate-900">{t.category}</td>
                      <td className="p-4 text-slate-800">{t.subject}</td>
                      <td className="p-4 text-slate-500">{t.date}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                          t.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* New Ticket Modal */}
          {showNewTicketModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b pb-3">Create Support Ticket</h3>
                <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                      className="w-full border rounded-lg p-2.5 bg-white text-slate-800"
                    >
                      <option value="Booking">Booking</option>
                      <option value="Payment">Payment / Settlement</option>
                      <option value="Vehicle">Vehicle Verification</option>
                      <option value="Damage">Damage / Accident Dispute</option>
                      <option value="Technical">Technical Issue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="Brief summary of issue"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                      className="w-full border rounded-lg p-2.5 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Provide detailed context or booking reference..."
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                      className="w-full border rounded-lg p-2.5 text-slate-800"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNewTicketModal(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                    >
                      Submit Ticket
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}