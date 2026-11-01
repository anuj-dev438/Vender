'use client';

import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Lock,
  Bell,
  Globe,
  LogOut,
  CheckCircle2,
  AlertCircle,
  FileText,
  Edit3,
  Save,
  HelpCircle
} from 'lucide-react';

export default function VendorProfileAndSettingsTab({ ownerData, onUpdateProfile }) {
  const [profile, setProfile] = useState({
    name: ownerData?.name || 'Anuj Kumar',
    phone: ownerData?.phone || '+91 9876543210',
    email: ownerData?.email || 'anuj.partner@drivehub.in',
    address: ownerData?.address || 'Fleet Yard Sector 14, Main Road, Gurugram',
    status: ownerData?.status || 'VERIFIED', // VERIFIED, PENDING, SUSPENDED
  });

  const [bank, setBank] = useState({
    bankName: ownerData?.bankDetails?.bankName || 'HDFC Bank',
    accountNo: ownerData?.bankDetails?.accountNo || '•••• •••• 4821',
    ifsc: ownerData?.bankDetails?.ifsc || 'HDFC0001234',
    status: 'VERIFIED'
  });

  const [settings, setSettings] = useState({
    pushNotif: true,
    emailAlerts: true,
    whatsappUpdates: true,
    language: 'English (IN)',
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditingProfile(false);
    setSuccessMessage('Profile details successfully updated!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Success Notification Banner */}
      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {successMessage}
        </div>
      )}

      {/* Account Suspension Warning / Notice if applicable */}
      {profile.status === 'SUSPENDED' && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Account Temporarily Suspended</p>
            <p className="mt-0.5">Vehicle publishing and new bookings are restricted until admin document review is completed.</p>
          </div>
        </div>
      )}

      {/* 1. Vendor Profile & Verification Status */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-5 border-b bg-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Owner Profile & KYC Information</h3>
            <p className="text-xs text-slate-500">Manage your partner identity, address, and verification credentials</p>
          </div>
          <button
            type="button"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Edit3 className="h-3.5 w-3.5 text-indigo-600" />
            {isEditingProfile ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSaveProfile} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Owner Full Name</label>
              <input
                type="text"
                disabled={!isEditingProfile}
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full border rounded-lg p-2.5 bg-slate-50 disabled:bg-slate-50 disabled:text-slate-700 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Mobile Number</label>
              <input
                type="text"
                disabled={!isEditingProfile}
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full border rounded-lg p-2.5 bg-slate-50 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                disabled={!isEditingProfile}
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full border rounded-lg p-2.5 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Account Verification Status</label>
              <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-emerald-50 text-emerald-700 font-semibold">
                <ShieldCheck className="h-4 w-4" />
                <span>KYC Approved & Verified</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Business / Fleet Address</label>
            <input
              type="text"
              disabled={!isEditingProfile}
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full border rounded-lg p-2.5 bg-slate-50"
            />
          </div>

          {isEditingProfile && (
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 shadow-sm"
              >
                <Save className="h-4 w-4" /> Save Changes
              </button>
            </div>
          )}
        </form>
      </div>

      {/* 2. Bank and Settlement Verification */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-5 border-b bg-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Bank & Payout Account</h3>
            <p className="text-xs text-slate-500">Masked financial account details for 80/20 settlements</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800">
            <CheckCircle2 className="h-3 w-3" /> VERIFIED
          </span>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border bg-slate-50">
              <span className="text-slate-400 block">Bank Name</span>
              <p className="font-bold text-slate-900 mt-1">{bank.bankName}</p>
            </div>

            <div className="p-4 rounded-xl border bg-slate-50">
              <span className="text-slate-400 block">Account Number</span>
              <p className="font-mono font-bold text-slate-900 mt-1">{bank.accountNo}</p>
            </div>

            <div className="p-4 rounded-xl border bg-slate-50">
              <span className="text-slate-400 block">IFSC Code</span>
              <p className="font-mono font-bold text-slate-900 mt-1">{bank.ifsc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Settings & Preferences */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-5 border-b bg-slate-50">
          <h3 className="text-sm font-bold text-slate-900">Portal Settings & Preferences</h3>
          <p className="text-xs text-slate-500">Configure notification channels, security, and display options</p>
        </div>

        <div className="p-6 divide-y text-xs">
          {/* Notification Preferences */}
          <div className="py-3.5 flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-900">Push Notifications & Booking Alerts</p>
              <p className="text-slate-500 text-[11px]">Receive instant alerts on new bookings, pickups, and return reminders.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.pushNotif}
              onChange={(e) => setSettings({ ...settings, pushNotif: e.target.checked })}
              className="h-4 w-4 rounded accent-indigo-600"
            />
          </div>

          <div className="py-3.5 flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-900">WhatsApp Dispatch & Settlement Updates</p>
              <p className="text-slate-500 text-[11px]">Get daily payout summaries and customer communication via WhatsApp.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.whatsappUpdates}
              onChange={(e) => setSettings({ ...settings, whatsappUpdates: e.target.checked })}
              className="h-4 w-4 rounded accent-indigo-600"
            />
          </div>

          {/* Session & Security */}
          <div className="py-4 flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-900">Password & Security</p>
              <p className="text-slate-500 text-[11px]">Manage your portal login credentials and active sessions.</p>
            </div>
            <button
              type="button"
              onClick={() => alert('Password reset link sent to your registered email.')}
              className="px-3 py-1.5 rounded-lg border text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Reset Password
            </button>
          </div>

          {/* Logout Action */}
          <div className="pt-4 flex justify-between items-center">
            <div>
              <p className="font-bold text-rose-600">Logout from Partner Portal</p>
              <p className="text-slate-500 text-[11px]">End current vendor session securely.</p>
            </div>
            <button
              type="button"
              onClick={() => alert('Logged out successfully.')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 font-semibold hover:bg-rose-100"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}