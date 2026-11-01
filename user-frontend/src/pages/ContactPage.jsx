import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Booking Inquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    showToast('Your message has been sent to Country Drive support team!', 'success');
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="contact-page">
      <div className="section-inner contact-container">
        <div className="info-page-header">
          <span className="hero-eyebrow" style={{ color: 'var(--orange-primary)' }}>GET IN TOUCH</span>
          <h1>We're Here to Help 24/7</h1>
          <p>Have questions about your rental, corporate tie-ups, or vehicle hosting? Reach out to us.</p>
        </div>

        <div className="contact-grid">
          {/* Left: Contact Info */}
          <div className="contact-info-col">
            <div className="contact-card">
              <h3>Support Channels</h3>

              <div className="contact-detail-row">
                <div className="contact-icon-wrap">
                  <Phone size={18} color="var(--orange-primary)" />
                </div>
                <div>
                  <strong>Customer Helpline</strong>
                  <p>+91 1800 123 4567 (Toll-Free, 24/7)</p>
                </div>
              </div>

              <div className="contact-detail-row">
                <div className="contact-icon-wrap">
                  <Mail size={18} color="var(--orange-primary)" />
                </div>
                <div>
                  <strong>Email Support</strong>
                  <p>support@countrydrive.in</p>
                </div>
              </div>

              <div className="contact-detail-row">
                <div className="contact-icon-wrap">
                  <MapPin size={18} color="var(--orange-primary)" />
                </div>
                <div>
                  <strong>Headquarters</strong>
                  <p>CountryDrive Mobility Hub, Bandra Kurla Complex (BKC), Mumbai 400051</p>
                </div>
              </div>

              <div className="contact-detail-row">
                <div className="contact-icon-wrap">
                  <Clock size={18} color="var(--orange-primary)" />
                </div>
                <div>
                  <strong>Operating Hours</strong>
                  <p>Vehicle Pickups &amp; Returns: 24 Hours / 365 Days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="contact-form-col">
            <div className="contact-form-card">
              <h3>Send Us a Message</h3>

              {sent ? (
                <div className="contact-sent-box">
                  <CheckCircle2 size={48} color="#10B981" />
                  <h4>Message Received!</h4>
                  <p>Our dedicated operations team will get in touch with you shortly.</p>
                  <button className="btn-app" onClick={() => setSent(false)} style={{ marginTop: '16px' }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="modal-form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="modal-form-group">
                    <label>Mobile Number *</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="modal-form-group">
                    <label>Subject</label>
                    <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                      <option value="Booking Inquiry">Booking Inquiry</option>
                      <option value="KYC Assistance">KYC / License Assistance</option>
                      <option value="Deposit Refund">Deposit / Refund Inquiry</option>
                      <option value="Host a Vehicle">Host / List My Vehicle</option>
                      <option value="Corporate Rental">Corporate Rental</option>
                    </select>
                  </div>

                  <div className="modal-form-group">
                    <label>Message *</label>
                    <textarea
                      rows={4}
                      placeholder="How can we help you today?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-app contact-submit-btn">
                    <Send size={16} />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
