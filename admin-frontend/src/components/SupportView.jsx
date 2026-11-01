import React, { useState, useEffect } from 'react';
import {
  Search,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Send,
  Eye,
  RefreshCw,
  Scale,
  ShieldAlert,
  User,
  Phone,
  Calendar,
  Loader2,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { initialSupportTickets } from '@/data/mockData';
import { supportApi } from '@/services/supportApi.js';
import { adaptTicket } from '@/utils/adapters.js';

export const SupportView = () => {
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' | 'disputes'
  const [tickets, setTickets] = useState(initialSupportTickets);
  const [disputes, setDisputes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selected Ticket inspection
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Selected Dispute inspection
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [disputeResolution, setDisputeResolution] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [ticketsRes, disputesRes] = await Promise.allSettled([
        supportApi.listTickets(),
        supportApi.listDisputes(),
      ]);

      if (ticketsRes.status === 'fulfilled') {
        const items = ticketsRes.value?.data?.tickets || (Array.isArray(ticketsRes.value?.data) ? ticketsRes.value.data : null);
        if (items && items.length > 0) {
          setTickets(items.map(adaptTicket));
        }
      }

      if (disputesRes.status === 'fulfilled') {
        const dItems = disputesRes.value?.data?.disputes || (Array.isArray(disputesRes.value?.data) ? disputesRes.value.data : []);
        setDisputes(dItems);
      }
    } catch (err) {
      console.warn('Support load notice:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    setActionLoading(true);
    try {
      const targetId = selectedTicket.rawId || selectedTicket.id;
      await supportApi.respondToTicket(targetId, {
        message: replyText.trim(),
        isInternal: isInternalNote,
      });

      // Append locally
      const newMsg = {
        id: `msg-${Date.now()}`,
        senderName: isInternalNote ? 'Internal Staff' : 'CountryDrive Support',
        message: replyText.trim(),
        isInternal: isInternalNote,
        createdAt: new Date().toISOString(),
      };

      setSelectedTicket((prev) => ({
        ...prev,
        messages: [...(prev.messages || []), newMsg],
      }));
      setReplyText('');
      setSuccessMsg('Message posted to ticket thread');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to post reply');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateTicketStatus = async (newStatus) => {
    if (!selectedTicket) return;
    setActionLoading(true);
    try {
      const targetId = selectedTicket.rawId || selectedTicket.id;
      await supportApi.updateTicketStatus(targetId, { status: newStatus });
      setTickets((prev) =>
        prev.map((t) => (t.id === selectedTicket.id ? { ...t, status: newStatus } : t))
      );
      setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
      setSuccessMsg(`Ticket status set to ${newStatus}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update ticket status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveDispute = async () => {
    if (!selectedDispute || !disputeResolution.trim()) {
      alert('Please enter a resolution summary');
      return;
    }
    setActionLoading(true);
    try {
      await supportApi.resolveDispute(selectedDispute.id, {
        resolution: disputeResolution,
        outcome: 'SETTLED',
      });
      setDisputes((prev) =>
        prev.map((d) => (d.id === selectedDispute.id ? { ...d, status: 'RESOLVED', resolution: disputeResolution } : d))
      );
      setSuccessMsg('Dispute marked as RESOLVED and ledger settled');
      setSelectedDispute(null);
      setDisputeResolution('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to resolve dispute');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Customer Support & Dispute Mediation
          </h1>
          <p className="text-xs text-[#8ba398] mt-0.5">
            Full Prisma spec: inquiry tickets, internal notes, damage claims, and mediation settlements.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-3.5 py-2.5 rounded-xl bg-[#121e19] hover:bg-[#172721] border border-[#1c3229] text-xs font-semibold text-[#8ba398] hover:text-white flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin text-[#00D26A]' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[#00D26A] text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#1c3229] gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`pb-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'tickets'
              ? 'border-[#00D26A] text-[#00D26A]'
              : 'border-transparent text-[#8ba398] hover:text-white'
          }`}
        >
          <MessageSquare size={14} />
          <span>Helpdesk Inquiry Tickets ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`pb-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'disputes'
              ? 'border-[#00D26A] text-[#00D26A]'
              : 'border-transparent text-[#8ba398] hover:text-white'
          }`}
        >
          <Scale size={14} />
          <span>Damage & Rental Disputes ({disputes.length})</span>
        </button>
      </div>

      {/* TAB 1: Support Tickets Table */}
      {activeTab === 'tickets' && (
        <div className="bg-[#121e19] border border-[#1c3229] rounded-2xl p-4 overflow-x-auto shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1c3229] text-[11px] text-[#577064] uppercase font-medium">
                <th className="pb-3 px-2">Ticket ID</th>
                <th className="pb-3 px-2">Customer / Host</th>
                <th className="pb-3 px-2">Category</th>
                <th className="pb-3 px-2">Subject / Summary</th>
                <th className="pb-3 px-2">Priority</th>
                <th className="pb-3 px-2">Created</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c3229]/60 text-xs">
              {tickets.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className="hover:bg-[#172721] transition-colors cursor-pointer"
                  title="Click anywhere on row to inspect ticket conversation & resolve"
                >
                  <td className="py-3 px-2 font-mono font-bold text-[#00D26A]">{t.id}</td>
                  <td className="py-3 px-2 font-medium text-white">{t.customer || t.userName}</td>
                  <td className="py-3 px-2">
                    <span className="bg-[#0a110e] px-2 py-0.5 rounded text-[#8ba398] border border-[#1c3229] font-mono">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-white max-w-xs truncate">{t.subject}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ['HIGH', 'URGENT'].includes((t.priority || '').toUpperCase())
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-[#8ba398]">{t.date || new Date(t.createdAt || Date.now()).toLocaleDateString()}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        ['RESOLVED', 'CLOSED'].includes((t.status || '').toUpperCase())
                          ? 'bg-emerald-500/15 text-[#00D26A]'
                          : t.status === 'In Progress' || t.status === 'IN_PROGRESS'
                          ? 'bg-sky-500/15 text-sky-400'
                          : 'bg-amber-500/15 text-amber-400'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTicket(t);
                      }}
                      className="px-3 py-1 rounded-lg bg-[#172721] hover:bg-[#00D26A] hover:text-black text-[#00D26A] border border-[#1c3229] transition-colors font-bold"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: Disputes Table */}
      {activeTab === 'disputes' && (
        <div className="bg-[#121e19] border border-[#1c3229] rounded-2xl p-4 overflow-x-auto shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1c3229] text-[11px] text-[#577064] uppercase font-medium">
                <th className="pb-3 px-2">Dispute ID</th>
                <th className="pb-3 px-2">Booking #</th>
                <th className="pb-3 px-2">Type</th>
                <th className="pb-3 px-2">Claim Title</th>
                <th className="pb-3 px-2">Priority</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c3229]/60 text-xs">
              {disputes.length > 0 ? (
                disputes.map((d) => (
                  <tr
                    key={d.id}
                    onClick={() => setSelectedDispute(d)}
                    className="hover:bg-[#172721] transition-colors cursor-pointer"
                    title="Click anywhere on row to mediate dispute & view evidence"
                  >
                    <td className="py-3 px-2 font-mono font-bold text-amber-400">{d.id.slice(0, 8)}</td>
                    <td className="py-3 px-2 font-mono text-white">{d.booking?.bookingNumber || d.bookingId?.slice(0, 8) || 'BK-2026-00101'}</td>
                    <td className="py-3 px-2">
                      <span className="bg-[#0a110e] px-2 py-0.5 rounded text-white border border-[#1c3229] font-mono text-[10px]">
                        {d.disputeType || 'DAMAGE_CLAIM'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-white max-w-xs truncate">{d.title}</td>
                    <td className="py-3 px-2 font-bold text-rose-400">{d.priority || 'HIGH'}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400">
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDispute(d);
                        }}
                        className="px-3 py-1 rounded-lg bg-[#172721] hover:bg-amber-400 hover:text-black text-amber-400 border border-[#1c3229] transition-colors font-bold"
                      >
                        Mediate
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                [
                  { id: 'DSP-2918', bk: 'BK-2026-00104', type: 'DAMAGE_SCRATCH', title: 'Rear bumper scratch during return', priority: 'HIGH', status: 'UNDER_REVIEW' },
                  { id: 'DSP-2919', bk: 'BK-2026-00102', type: 'PAYMENT_TOLL', title: 'FASTag toll deducted twice on Delhi-Meerut expressway', priority: 'MEDIUM', status: 'OPEN' },
                ].map((d) => (
                  <tr
                    key={d.id}
                    onClick={() => setSelectedDispute({ id: d.id, title: d.title, disputeType: d.type, bookingNumber: d.bk })}
                    className="hover:bg-[#172721] transition-colors cursor-pointer"
                    title="Click anywhere on row to mediate dispute"
                  >
                    <td className="py-3 px-2 font-mono font-bold text-amber-400">{d.id}</td>
                    <td className="py-3 px-2 font-mono text-white">{d.bk}</td>
                    <td className="py-3 px-2">
                      <span className="bg-[#0a110e] px-2 py-0.5 rounded text-white border border-[#1c3229] font-mono text-[10px]">
                        {d.type}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-white max-w-xs truncate">{d.title}</td>
                    <td className="py-3 px-2 font-bold text-rose-400">{d.priority}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400">
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDispute({ id: d.id, title: d.title, disputeType: d.type, bookingNumber: d.bk });
                        }}
                        className="px-3 py-1 rounded-lg bg-[#172721] hover:bg-amber-400 hover:text-black text-amber-400 border border-[#1c3229] transition-colors font-bold"
                      >
                        Mediate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Ticket Inspection & Conversation Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-2xl shadow-2xl p-5 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#1c3229] pb-3">
              <div>
                <h3 className="font-bold text-white text-base">
                  Ticket <span className="text-[#00D26A] font-mono">{selectedTicket.id}</span>
                </h3>
                <p className="text-xs text-[#8ba398]">{selectedTicket.subject}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-[#8ba398] hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-[#121e19] rounded-xl border border-[#1c3229] text-xs">
              <div>
                <span className="text-[#577064] block">User / Contact:</span>
                <span className="font-bold text-white">{selectedTicket.customer || selectedTicket.userName}</span>
              </div>
              <div>
                <span className="text-[#577064] block">Category & Priority:</span>
                <span className="text-white font-mono">{selectedTicket.category} • {selectedTicket.priority}</span>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="space-y-2.5">
              <span className="text-[10px] text-[#577064] uppercase font-bold tracking-wider block">
                Thread Messages
              </span>
              <div className="p-3 bg-[#121e19] rounded-xl border border-[#1c3229] space-y-1 text-xs">
                <div className="flex items-center justify-between text-[#8ba398]">
                  <span className="font-bold text-white">{selectedTicket.customer || 'User'}</span>
                  <span className="text-[10px]">Initial Inquiry</span>
                </div>
                <p className="text-zinc-200">
                  {selectedTicket.description || `Inquiry regarding ${selectedTicket.subject}. Please check booking schedule and refund status.`}
                </p>
              </div>

              {(selectedTicket.messages || []).map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl border text-xs space-y-1 ${
                    m.isInternal
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-[#172721] border-[#1c3229]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold flex items-center gap-1 ${m.isInternal ? 'text-amber-400' : 'text-[#00D26A]'}`}>
                      {m.isInternal && <Lock size={11} />}
                      {m.senderName}
                    </span>
                    <span className="text-[10px] text-zinc-500">{new Date(m.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-white">{m.message}</p>
                </div>
              ))}
            </div>

            {/* Post Reply Area */}
            <div className="p-3 bg-[#121e19] rounded-xl border border-[#1c3229] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white font-semibold">Post Message to Thread</span>
                <label className="flex items-center gap-1.5 cursor-pointer text-[#8ba398] text-[11px]">
                  <input
                    type="checkbox"
                    checked={isInternalNote}
                    onChange={(e) => setIsInternalNote(e.target.checked)}
                    className="accent-amber-400"
                  />
                  <span>Internal Staff Note Only</span>
                </label>
              </div>
              <textarea
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={isInternalNote ? 'Write internal note visible only to admins...' : 'Write reply to customer / host...'}
                className="w-full bg-[#0a110e] border border-[#1c3229] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#00D26A]"
              />
              <div className="flex justify-between items-center pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#8ba398]">Status:</span>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleUpdateTicketStatus(e.target.value)}
                    className="bg-[#0a110e] border border-[#1c3229] text-xs text-white rounded-lg px-2 py-1"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="WAITING_FOR_USER">WAITING_FOR_USER</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>

                <button
                  onClick={handleSendReply}
                  disabled={actionLoading || !replyText.trim()}
                  className="btn-glossy btn-glossy-emerald px-4 py-1.5 rounded-xl text-xs font-bold text-black flex items-center gap-1.5 disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Mediation Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-lg shadow-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-[#1c3229] pb-3">
              <div>
                <h3 className="font-bold text-white text-base">Mediate Dispute: {selectedDispute.id}</h3>
                <p className="text-xs text-amber-400">{selectedDispute.title}</p>
              </div>
              <button onClick={() => setSelectedDispute(null)} className="text-[#8ba398] hover:text-white">✕</button>
            </div>

            <div className="p-3 bg-[#121e19] rounded-xl border border-[#1c3229] space-y-1 text-xs">
              <span className="text-[#577064] block">Booking Ref: {selectedDispute.bookingNumber || 'BK-2026-00104'}</span>
              <p className="text-white">Claim: Customer disputed damage charge of ₹1,500. Evidence photos reviewed.</p>
            </div>

            <div>
              <label className="block text-xs text-white font-semibold mb-1">
                Admin Mediation Resolution & Settlement Summary:
              </label>
              <textarea
                rows={3}
                value={disputeResolution}
                onChange={(e) => setDisputeResolution(e.target.value)}
                placeholder="e.g. Damage confirmed minor pre-existing. Releasing 100% security deposit back to customer."
                className="w-full bg-[#121e19] border border-[#1c3229] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#00D26A]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#1c3229]">
              <button onClick={() => setSelectedDispute(null)} className="px-3 py-1.5 text-xs text-[#8ba398]">Cancel</button>
              <button
                onClick={handleResolveDispute}
                disabled={actionLoading}
                className="btn-glossy btn-glossy-emerald px-4 py-1.5 text-xs font-bold text-black flex items-center gap-1.5"
              >
                {actionLoading && <Loader2 size={12} className="animate-spin" />}
                <span>Settle & Resolve Dispute</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
