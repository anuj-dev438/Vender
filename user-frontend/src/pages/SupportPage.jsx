import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supportService } from '../services/supportService';
import { LifeBuoy, Plus, MessageSquare, AlertCircle, CheckCircle2, Clock, Send, ShieldAlert } from 'lucide-react';

export default function SupportPage() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' or 'disputes'
  const [tickets, setTickets] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active item detail view
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // New ticket modal
  const [newTicketModal, setNewTicketModal] = useState(false);
  const [newCategory, setNewCategory] = useState('BOOKING');
  const [newSubject, setNewSubject] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState('MEDIUM');
  const [submittingTicket, setSubmittingTicket] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'tickets') {
        const list = await supportService.getMyTickets();
        setTickets(Array.isArray(list) ? list : (list.tickets || []));
      } else {
        const list = await supportService.getMyDisputes();
        setDisputes(Array.isArray(list) ? list : (list.disputes || []));
      }
    } catch (err) {
      console.warn('Failed to load support data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTicket = async (ticket) => {
    try {
      setSelectedDispute(null);
      const details = await supportService.getTicketDetails(ticket.id);
      setSelectedTicket(details);
    } catch (err) {
      showToast(err.message || 'Failed to load ticket details', 'error');
    }
  };

  const handleSelectDispute = async (dispute) => {
    try {
      setSelectedTicket(null);
      const details = await supportService.getDisputeDetails(dispute.id);
      setSelectedDispute(details);
    } catch (err) {
      showToast(err.message || 'Failed to load dispute details', 'error');
    }
  };

  const handleSendTicketReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket?.id) return;

    try {
      setSendingReply(true);
      await supportService.addTicketMessage(selectedTicket.id, { message: replyMessage });
      setReplyMessage('');
      // Reload ticket details
      const updated = await supportService.getTicketDetails(selectedTicket.id);
      setSelectedTicket(updated);
      showToast('Message sent to support team', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to send message', 'error');
    } finally {
      setSendingReply(false);
    }
  };

  const handleSendDisputeReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedDispute?.id) return;

    try {
      setSendingReply(true);
      await supportService.addDisputeMessage(selectedDispute.id, { message: replyMessage });
      setReplyMessage('');
      // Reload dispute details
      const updated = await supportService.getDisputeDetails(selectedDispute.id);
      setSelectedDispute(updated);
      showToast('Message sent in dispute mediation', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to send dispute message', 'error');
    } finally {
      setSendingReply(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) {
      showToast('Please provide both subject and description', 'error');
      return;
    }

    try {
      setSubmittingTicket(true);
      await supportService.createTicket({
        category: newCategory,
        subject: newSubject,
        description: newDescription,
        priority: newPriority,
      });
      showToast('Support ticket created successfully', 'success');
      setNewTicketModal(false);
      setNewSubject('');
      setNewDescription('');
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to create ticket', 'error');
    } finally {
      setSubmittingTicket(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bookings-unauth-container">
        <LifeBuoy size={48} color="var(--orange-primary)" />
        <h2>Please Log In to Access Help &amp; Support</h2>
        <p style={{ color: '#6B7280', marginTop: '8px' }}>
          Track your tickets, talk to customer agents, or review dispute mediation.
        </p>
        <button className="btn-app" onClick={openAuthModal} style={{ marginTop: '20px' }}>
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="how-it-works-page">
      <div className="section-inner">
        <div className="info-page-header">
          <span className="hero-eyebrow" style={{ color: 'var(--orange-primary)' }}>24/7 CUSTOMER CARE</span>
          <h1>Help &amp; Support Center</h1>
          <p>We are here to assist with bookings, vehicle queries, security deposit settlements, and mediation.</p>
        </div>

        {/* Tab Controls & New Ticket CTA */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
          borderBottom: '1px solid #E5E7EB',
          paddingBottom: '16px',
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => { setActiveTab('tickets'); setSelectedTicket(null); setSelectedDispute(null); }}
              style={{
                background: activeTab === 'tickets' ? 'var(--orange-primary)' : 'transparent',
                color: activeTab === 'tickets' ? '#fff' : '#4B5563',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <MessageSquare size={16} />
              Support Tickets
            </button>
            <button
              onClick={() => { setActiveTab('disputes'); setSelectedTicket(null); setSelectedDispute(null); }}
              style={{
                background: activeTab === 'disputes' ? '#111827' : 'transparent',
                color: activeTab === 'disputes' ? '#fff' : '#4B5563',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ShieldAlert size={16} />
              Disputes &amp; Mediation
            </button>
          </div>

          {activeTab === 'tickets' && (
            <button
              onClick={() => setNewTicketModal(true)}
              className="btn-app"
              style={{ borderRadius: '10px', padding: '10px 18px', fontSize: '13px' }}
            >
              <Plus size={16} />
              <span>Raise Support Ticket</span>
            </button>
          )}
        </div>

        {/* Main Content Layout: Master-Detail */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: (selectedTicket || selectedDispute) ? '1fr 1.5fr' : '1fr',
          gap: '24px',
          alignItems: 'start',
        }}>
          {/* List Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Loading items...</div>
            ) : activeTab === 'tickets' ? (
              tickets.length === 0 ? (
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '40px 24px',
                  textAlign: 'center',
                  border: '1px solid #E5E7EB',
                }}>
                  <MessageSquare size={36} color="#9CA3AF" style={{ margin: '0 auto 12px auto' }} />
                  <h3 style={{ fontSize: '16px', color: '#111827', margin: '0 0 6px 0' }}>No Support Tickets</h3>
                  <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px 0' }}>
                    Need help with a trip or profile verification? Raise a ticket.
                  </p>
                  <button onClick={() => setNewTicketModal(true)} className="btn-app" style={{ margin: '0 auto' }}>
                    Create Ticket
                  </button>
                </div>
              ) : (
                tickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleSelectTicket(t)}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '14px',
                      padding: '18px 20px',
                      border: selectedTicket?.id === t.id ? '2px solid var(--orange-primary)' : '1px solid #E5E7EB',
                      cursor: 'pointer',
                      transition: 'border 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--orange-primary)', textTransform: 'uppercase' }}>
                        {t.category}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: t.status === 'RESOLVED' ? '#ECFDF5' : '#FFF8F0',
                        color: t.status === 'RESOLVED' ? '#059669' : '#D97706',
                      }}>
                        {t.status}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: '0 0 6px 0' }}>
                      {t.subject}
                    </h4>
                    <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 10px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.description}
                    </p>
                    <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )
            ) : (
              disputes.length === 0 ? (
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '40px 24px',
                  textAlign: 'center',
                  border: '1px solid #E5E7EB',
                }}>
                  <ShieldAlert size={36} color="#9CA3AF" style={{ margin: '0 auto 12px auto' }} />
                  <h3 style={{ fontSize: '16px', color: '#111827', margin: '0 0 6px 0' }}>No Active Disputes</h3>
                  <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                    You have no ongoing deposit or damage disputes. All completed rentals are in good standing!
                  </p>
                </div>
              ) : (
                disputes.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleSelectDispute(d)}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '14px',
                      padding: '18px 20px',
                      border: selectedDispute?.id === d.id ? '2px solid var(--orange-primary)' : '1px solid #E5E7EB',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#DC2626', textTransform: 'uppercase' }}>
                        {d.disputeType}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', background: '#F3F4F6' }}>
                        {d.status || 'UNDER_REVIEW'}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: '0 0 6px 0' }}>
                      {d.title}
                    </h4>
                    <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                      {new Date(d.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )
            )}
          </div>

          {/* Details / Conversation Column */}
          {selectedTicket && (
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            }}>
              <div style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--orange-primary)' }}>
                    TICKET #{selectedTicket.id?.slice(0, 8)}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>• {selectedTicket.category}</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>
                  {selectedTicket.subject}
                </h3>
                <p style={{ fontSize: '13px', color: '#4B5563', margin: 0, lineHeight: '1.5' }}>
                  {selectedTicket.description}
                </p>
              </div>

              {/* Message Thread */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '360px', overflowY: 'auto', marginBottom: '20px', paddingRight: '4px' }}>
                {(selectedTicket.messages || []).map((msg, i) => (
                  <div
                    key={msg.id || i}
                    style={{
                      background: msg.isStaff || msg.senderRole === 'ADMIN' || msg.senderRole === 'SUPPORT' ? '#FFF8F0' : '#F9FAFB',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      borderLeft: msg.isStaff ? '3px solid var(--orange-primary)' : '3px solid #9CA3AF',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                      <strong style={{ color: msg.isStaff ? 'var(--orange-primary)' : '#111827' }}>
                        {msg.isStaff ? 'CountryDrive Support Agent' : 'You'}
                      </strong>
                      <span style={{ color: '#9CA3AF', fontSize: '11px' }}>
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#374151', lineHeight: '1.4' }}>{msg.message}</p>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendTicketReply} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Type a reply to CountryDrive agent..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  style={{
                    flexGrow: 1,
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid #D1D5DB',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={sendingReply || !replyMessage.trim()}
                  className="btn-app"
                  style={{ padding: '0 20px', borderRadius: '10px' }}
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}

          {selectedDispute && (
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              padding: '24px',
            }}>
              <div style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <ShieldAlert size={16} color="#DC2626" />
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#DC2626' }}>
                    {selectedDispute.disputeType}
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>
                  {selectedDispute.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#4B5563', margin: 0 }}>
                  {selectedDispute.description}
                </p>
              </div>

              {/* Dispute Messages */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '360px', overflowY: 'auto', marginBottom: '20px' }}>
                {(selectedDispute.messages || []).map((msg, i) => (
                  <div key={msg.id || i} style={{ background: '#F9FAFB', borderRadius: '12px', padding: '12px 16px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#374151' }}>{msg.message}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendDisputeReply} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Provide evidence or dispute explanation..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  style={{ flexGrow: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid #D1D5DB' }}
                />
                <button type="submit" disabled={sendingReply || !replyMessage.trim()} className="btn-app">
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Modal: Create Ticket */}
        {newTicketModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: '0 0 16px 0' }}>
                Raise a Support Ticket
              </h2>

              <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                  >
                    <option value="BOOKING">Booking &amp; Trip Issue</option>
                    <option value="PAYMENT">Payment &amp; Refund</option>
                    <option value="VEHICLE">Vehicle Condition / Fastag</option>
                    <option value="KYC">KYC &amp; DL Verification</option>
                    <option value="OTHER">General Inquiries</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brief summary of your query"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                    Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe what happened in detail..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setNewTicketModal(false)}
                    style={{
                      background: '#F3F4F6',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      color: '#4B5563',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingTicket}
                    className="btn-app"
                    style={{ borderRadius: '8px', padding: '10px 20px' }}
                  >
                    {submittingTicket ? 'Submitting...' : 'Submit Ticket'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
