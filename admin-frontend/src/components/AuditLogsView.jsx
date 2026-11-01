import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Clock,
  User,
  CheckCircle2,
  RefreshCw,
  Search,
  Download,
  Eye,
  Filter,
  X,
  Loader2,
} from 'lucide-react';
import { auditApi } from '../services/auditApi.js';
import { adaptAuditLog } from '../utils/adapters.js';

export const AuditLogsView = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await auditApi.getAuditLogs();
      const raw = Array.isArray(res?.data) ? res.data : res?.data?.logs || [];
      setLogs(raw.map(adaptAuditLog).filter(Boolean));
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await auditApi.exportLogs();
      const blob = new Blob([typeof res === 'string' ? res : JSON.stringify(logs, null, 2)], {
        type: 'text/csv;charset=utf-8;',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `countrydrive-audit-trail-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      const dummyCsv = 'id,action,entityType,actor,createdAt\n' + logs.map(l => `${l.id},${l.action},${l.entityType},${l.actorName},${l.createdAt}`).join('\n');
      const blob = new Blob([dummyCsv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `countrydrive-audit-trail-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsExporting(false);
    }
  };

  const entities = ['ALL', 'Vehicle', 'Booking', 'User', 'Payment', 'KycVerification', 'SystemSetting'];

  const filtered = logs.filter((l) => {
    const matchesSearch =
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.entityType.toLowerCase().includes(search.toLowerCase()) ||
      l.actorName.toLowerCase().includes(search.toLowerCase());

    const matchesEntity =
      selectedEntity === 'ALL' ||
      l.entityType.toLowerCase() === selectedEntity.toLowerCase();

    return matchesSearch && matchesEntity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Platform Audit & Security Logs
          </h1>
          <p className="text-xs text-[#8ba398] mt-0.5">
            Immutable audit trail of administrator actions, vehicle approvals, and compliance changes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchLogs}
            className="px-3.5 py-2.5 rounded-xl bg-[#121e19] hover:bg-[#172721] border border-[#1c3229] text-xs font-semibold text-[#8ba398] hover:text-white flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin text-[#00D26A]' : ''} />
            <span>Sync</span>
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="btn-glossy btn-glossy-emerald px-4 py-2.5 text-xs rounded-xl flex items-center gap-1.5 font-bold text-black disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            <span>Export Trail</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#121e19] border border-[#1c3229] p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-3 text-[#577064]" />
          <input
            type="text"
            placeholder="Search action, entity or actor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a110e] border border-[#1c3229] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#577064] focus:outline-none focus:border-[#00D26A]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {entities.map((ent) => (
            <button
              key={ent}
              onClick={() => setSelectedEntity(ent)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedEntity === ent
                  ? 'bg-[#00D26A] text-black font-bold'
                  : 'bg-[#0a110e] text-[#8ba398] hover:text-white border border-[#1c3229]'
              }`}
            >
              {ent}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#121e19] border border-[#1c3229] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1c3229] text-[#577064] font-semibold uppercase tracking-wider bg-[#0a110e]">
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Entity Type</th>
                <th className="py-3.5 px-4">Entity ID</th>
                <th className="py-3.5 px-4">Performed By</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c3229]/60 text-white">
              {filtered.length > 0 ? (
                filtered.map((l) => (
                  <tr
                    key={l.id}
                    onClick={() => setSelectedLog(l)}
                    className="hover:bg-[#172721] transition-colors cursor-pointer"
                    title="Click row to inspect full JSON audit payload & metadata"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-[#00D26A] text-xs">{l.action}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#0a110e] border border-[#1c3229] font-mono text-[10px] text-white">
                        {l.entityType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-400 text-[11px]">
                      {l.entityId ? l.entityId.slice(0, 10) + '...' : 'System'}
                    </td>
                    <td className="py-3.5 px-4 text-white font-semibold">
                      {l.actorName || 'System Service'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-500 text-[11px]">
                      {l.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-3.5 px-4 text-[#8ba398] font-mono text-[11px]">
                      {new Date(l.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(l);
                        }}
                        className="px-2.5 py-1 bg-[#172721] hover:bg-[#00D26A] hover:text-black text-[#00D26A] rounded-lg border border-[#1c3229] text-[11px] font-bold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#8ba398]">
                    No security audit logs match the current search or entity filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Payload Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1713] border border-[#1c3229] rounded-2xl w-full max-w-lg shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#1c3229] pb-3">
              <div>
                <h3 className="font-bold text-white text-base">Audit Event Payload</h3>
                <p className="text-xs text-[#00D26A] font-mono">{selectedLog.action} on {selectedLog.entityType}</p>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-[#8ba398] hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-[#121e19] rounded-xl border border-[#1c3229]">
                <div>
                  <span className="text-[#577064] block">Actor:</span>
                  <span className="text-white font-semibold">{selectedLog.actorName}</span>
                </div>
                <div>
                  <span className="text-[#577064] block">Entity ID:</span>
                  <span className="text-white font-mono">{selectedLog.entityId || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[#577064] block">IP Address:</span>
                  <span className="text-white font-mono">{selectedLog.ipAddress || '127.0.0.1'}</span>
                </div>
                <div>
                  <span className="text-[#577064] block">Timestamp:</span>
                  <span className="text-white">{new Date(selectedLog.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <span className="text-[#8ba398] font-bold block mb-1">New State / Payload Data:</span>
                <pre className="p-3 bg-[#0a110e] border border-[#1c3229] rounded-xl text-[#00D26A] font-mono text-[11px] overflow-x-auto max-h-48">
                  {JSON.stringify(selectedLog.newValues || { message: selectedLog.message }, null, 2)}
                </pre>
              </div>

              {selectedLog.oldValues && (
                <div>
                  <span className="text-[#8ba398] font-bold block mb-1">Previous State (Old Values):</span>
                  <pre className="p-3 bg-[#0a110e] border border-[#1c3229] rounded-xl text-amber-400 font-mono text-[11px] overflow-x-auto max-h-36">
                    {JSON.stringify(selectedLog.oldValues, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-[#1c3229]">
              <button
                onClick={() => setSelectedLog(null)}
                className="btn-glossy btn-glossy-emerald px-5 py-2 text-xs rounded-xl font-bold text-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
