import React, { useState } from 'react';
import { Bell, Send, CheckCircle, Smartphone, Mail, MessageCircle, Plus } from 'lucide-react';
import { initialNotifications } from '@/data/mockData';

export const NotificationsView = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!title || !message) return;

    const newNotif = {
      id: String(Date.now()),
      title,
      description: message,
      time: 'Just now',
      read: false,
      channel: 'Push + SMS',
    };

    setNotifications([newNotif, ...notifications]);
    setBroadcastModalOpen(false);
    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Notifications & Broadcast Hub
          </h1>
          <p className="text-xs text-[#8ba398] mt-0.5">
            Monitor automated system triggers (KYC, Booking, Return, Payouts) and broadcast operational alerts to drivers and owners.
          </p>
        </div>

        <button
          onClick={() => setBroadcastModalOpen(true)}
          className="btn-glossy btn-glossy-emerald px-4 py-2 text-xs rounded-xl self-start sm:self-auto"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Push Broadcast</span>
        </button>
      </div>

      {/* Notifications History List */}
      <div className="bg-[#121e19] border border-[#1c3229] rounded-2xl p-4 space-y-3">
        <h3 className="font-semibold text-white text-base mb-2">Automated Event Trigger Stream</h3>
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => setSelectedNotif(n)}
              className="p-3 bg-[#0a110e] border border-[#1c3229] rounded-xl flex items-center justify-between hover:bg-[#172721] hover:border-[#00D26A] transition-all cursor-pointer select-none group"
              title="Click notification to inspect trigger payload"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00D26A]/15 text-[#00D26A] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                  <Bell size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-xs flex items-center gap-2 group-hover:text-[#00D26A] transition-colors">
                    {n.title}
                    {n.channel && (
                      <span className="bg-[#172721] text-[#8ba398] text-[10px] px-2 py-0.2 rounded border border-[#1c3229]">
                        {n.channel}
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-[#8ba398]">{n.description}</p>
                </div>
              </div>
              <span className="text-[10px] text-[#577064] font-mono whitespace-nowrap">{n.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Inspection Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-[#1c3229] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#00D26A]/15 text-[#00D26A] flex items-center justify-center">
                  <Bell size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Notification Event Log</h3>
                  <span className="text-[10px] font-mono text-[#8ba398]">{selectedNotif.time}</span>
                </div>
              </div>
              <button onClick={() => setSelectedNotif(null)} className="text-[#8ba398] hover:text-white">✕</button>
            </div>

            <div className="p-4 bg-[#121e19] rounded-xl border border-[#1c3229] space-y-2">
              <h4 className="text-white font-bold text-sm">{selectedNotif.title}</h4>
              <p className="text-xs text-[#8ba398] leading-relaxed">{selectedNotif.description}</p>
              <div className="flex justify-between items-center pt-2 border-t border-[#1c3229] text-[11px]">
                <span className="text-[#577064]">Delivery Channel:</span>
                <span className="text-[#00D26A] font-semibold">{selectedNotif.channel || 'Push + In-App'}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#1c3229]">
              <button
                onClick={() => setSelectedNotif(null)}
                className="btn-glossy btn-glossy-emerald px-5 py-1.5 rounded-xl text-xs font-bold text-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121e19] border border-[#1c3229] rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-[#1c3229] pb-3">
              <h3 className="font-semibold text-white text-base flex items-center gap-2">
                <Send size={18} className="text-[#00D26A]" />
                Send Push Notification Broadcast
              </h3>
              <button onClick={() => setBroadcastModalOpen(false)} className="text-[#8ba398] hover:text-white">✕</button>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#8ba398] mb-1 font-medium">Notification Title</label>
                <input
                  type="text"
                  placeholder="e.g. Special Weekend Offer 20% Off!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-[#0a110e] border border-[#1c3229] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00D26A]"
                />
              </div>
              <div>
                <label className="block text-[#8ba398] mb-1 font-medium">Message Body</label>
                <textarea
                  placeholder="Type broadcast announcement message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-[#0a110e] border border-[#1c3229] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00D26A]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#1c3229]">
                <button type="button" onClick={() => setBroadcastModalOpen(false)} className="btn-glossy btn-glossy-dark px-4 py-2 text-xs rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="btn-glossy btn-glossy-emerald px-4 py-2 text-xs rounded-xl">
                  <Send size={14} /> Send Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
