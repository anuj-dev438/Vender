import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { reviewService } from '../services/reviewService';
import { supportService } from '../services/supportService';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  FileText,
  KeyRound,
  AlertTriangle,
  Receipt,
  Star,
  Plus,
  XCircle,
  HelpCircle,
  Car,
  CreditCard
} from 'lucide-react';

export default function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paying, setPaying] = useState(false);

  // Cancellation state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelQuote, setCancelQuote] = useState(null);
  const [cancelReason, setCancelReason] = useState('Plans changed');
  const [cancelling, setCancelling] = useState(false);

  // Extension state
  const [extensionModalOpen, setExtensionModalOpen] = useState(false);
  const [newEndAt, setNewEndAt] = useState('');
  const [extending, setExtending] = useState(false);

  // Review state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [existingReview, setExistingReview] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    loadBookingAndReview();
  }, [id]);

  const loadBookingAndReview = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getBookingById(id);
      setBooking(data);

      if (data.status === 'COMPLETED') {
        try {
          const rev = await reviewService.getBookingReview(id);
          if (rev) setExistingReview(rev);
        } catch {
          // No review submitted yet
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Open cancellation modal and fetch quote
  const handleOpenCancelModal = async () => {
    try {
      setCancelling(true);
      const quote = await bookingService.getCancellationQuote(id);
      setCancelQuote(quote);
      setCancelModalOpen(true);
    } catch (err) {
      showToast(err.message || 'Failed to calculate cancellation quote', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const handleConfirmCancel = async () => {
    try {
      setCancelling(true);
      await bookingService.cancelBooking(id, {
        reason: cancelReason,
        reasonCode: 'CUSTOMER_REQUEST',
      });
      showToast('Booking cancelled successfully', 'info');
      setCancelModalOpen(false);
      loadBookingAndReview();
    } catch (err) {
      showToast(err.message || 'Failed to cancel booking', 'error');
    } finally {
      setCancelling(false);
    }
  };

  // Pay Now for PAYMENT_PENDING bookings
  const handlePayNow = async () => {
    try {
      setPaying(true);
      const orderData = await paymentService.createOrder(id);
      const order = orderData.data || orderData;

      if (order && window.Razorpay && order.razorpayOrderId) {
        const options = {
          key: order.keyId || 'rzp_test_key',
          amount: order.amount,
          currency: 'INR',
          name: 'CountryDrive Car Rental',
          description: `Booking Payment: #${booking?.bookingNumber || id}`,
          order_id: order.razorpayOrderId,
          prefill: {
            name: user?.name || '',
            contact: user?.phone || '',
            email: user?.email || '',
          },
          handler: async (resp) => {
            try {
              await paymentService.verifyPayment({
                bookingId: id,
                razorpayOrderId: resp.razorpay_order_id,
                razorpayPaymentId: resp.razorpay_payment_id,
                razorpaySignature: resp.razorpay_signature,
              });
              showToast('Payment verified & booking confirmed!', 'success');
              loadBookingAndReview();
            } catch (vErr) {
              showToast(vErr.message || 'Payment verification failed', 'error');
            }
          },
          theme: { color: '#FF7A00' },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        showToast('Payment order initialized. Razorpay gateway test mode.', 'info');
      }
    } catch (err) {
      showToast(err.message || 'Failed to initiate payment', 'error');
    } finally {
      setPaying(false);
    }
  };

  // Extension request
  const handleRequestExtension = async (e) => {
    e.preventDefault();
    if (!newEndAt) return;

    try {
      setExtending(true);
      const res = await bookingService.requestExtension(id, { newEndAt });

      if (res.razorpayOrderId && window.Razorpay) {
        const options = {
          key: res.keyId || 'rzp_test_key',
          amount: res.amount,
          currency: 'INR',
          name: 'CountryDrive Extension',
          description: 'Booking Extension Payment',
          order_id: res.razorpayOrderId,
          handler: async (resp) => {
            try {
              await bookingService.verifyExtensionPayment({
                extensionId: res.extensionId,
                razorpayOrderId: resp.razorpay_order_id,
                razorpayPaymentId: resp.razorpay_payment_id,
                razorpaySignature: resp.razorpay_signature,
              });
              showToast('Booking extended successfully!', 'success');
              setExtensionModalOpen(false);
              loadBookingAndReview();
            } catch (vErr) {
              showToast(vErr.message || 'Extension payment verification failed', 'error');
            }
          },
          theme: { color: '#FF7A00' },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        showToast('Extension requested successfully', 'success');
        setExtensionModalOpen(false);
        loadBookingAndReview();
      }
    } catch (err) {
      showToast(err.message || 'Failed to request extension', 'error');
    } finally {
      setExtending(false);
    }
  };

  // Review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      setSubmittingReview(true);
      const res = await reviewService.submitReview(id, {
        rating,
        title: reviewTitle,
        comment: reviewComment,
      });
      showToast('Thank you for rating your rental experience!', 'success');
      setExistingReview(res);
      setReviewModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="detail-loading-container">
        <div className="spinner"></div>
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="detail-error-container">
        <h2>Booking Not Found</h2>
        <p>Unable to retrieve booking information for reference #{id}.</p>
        <Link to="/my-bookings" className="btn-app" style={{ display: 'inline-flex', marginTop: '16px' }}>
          Back to My Bookings
        </Link>
      </div>
    );
  }

  const vehicle = booking.vehicle || {};
  const vehicleName = vehicle.variant
    ? `${vehicle.make} ${vehicle.model} ${vehicle.variant}`
    : vehicle.make ? `${vehicle.make} ${vehicle.model}` : 'Booked Vehicle';

  const image = vehicle.media?.[0]?.url || vehicle.coverImageUrl || '/uploads/cards/White Modern SUV Studio Render.png';

  const statuses = ['PAYMENT_PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED'];
  const currentStatusIdx = statuses.indexOf(booking.status);

  const canCancel = ['PAYMENT_PENDING', 'CONFIRMED', 'UPCOMING'].includes(booking.status);
  const canExtend = ['CONFIRMED', 'ACTIVE'].includes(booking.status);
  const canInspect = ['CONFIRMED', 'ACTIVE'].includes(booking.status);
  const canReview = booking.status === 'COMPLETED' && !existingReview;

  return (
    <div className="booking-detail-page">
      <div className="section-inner">
        <Link to="/my-bookings" className="detail-back-link">
          <ChevronLeft size={18} /> Back to My Bookings
        </Link>

        <div className="booking-detail-header">
          <div>
            <span className="booking-ref-number">#{booking.bookingNumber || booking.id}</span>
            <h1 className="booking-detail-title">{vehicleName}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className={`booking-status-pill status-${(booking.status || 'pending').toLowerCase()}`}>
              {booking.status}
            </span>
          </div>
        </div>

        {/* Status Lifecycle Progress Tracker */}
        <div className="status-progress-track">
          {[
            { label: 'Reserved', step: 'PAYMENT_PENDING' },
            { label: 'Confirmed', step: 'CONFIRMED' },
            { label: 'Active Rental', step: 'ACTIVE' },
            { label: 'Completed', step: 'COMPLETED' },
          ].map((s, idx) => (
            <div
              key={s.step}
              className={`track-step ${idx <= currentStatusIdx ? 'active' : ''}`}
            >
              <div className="step-circle">{idx + 1}</div>
              <span className="step-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="booking-detail-grid">
          {/* Left Column: Vehicle & Rental Specs */}
          <div className="booking-detail-left">
            <div className="detail-info-card">
              <div className="booking-vehicle-hero">
                <img
                  src={image}
                  alt={vehicleName}
                  className="booking-vehicle-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/uploads/cards/White Modern SUV Studio Render.png';
                  }}
                />
                <div className="booking-vehicle-details">
                  <h3>{vehicleName}</h3>
                  <p>{vehicle.registrationNumber || 'MH-12-AB-1234'} • {vehicle.fuelType || 'Petrol'} • {vehicle.transmission || 'Automatic'}</p>
                  <span className="pickup-station-badge">
                    <MapPin size={14} /> {vehicle.city || 'Mumbai'} Station Hub
                  </span>
                </div>
              </div>

              <div className="booking-time-schedule-box">
                <div className="time-block">
                  <span className="time-lbl">Pickup Date &amp; Time</span>
                  <strong>{new Date(booking.startAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</strong>
                </div>
                <div className="time-arrow">→</div>
                <div className="time-block">
                  <span className="time-lbl">Return Date &amp; Time</span>
                  <strong>{new Date(booking.endAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</strong>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', margin: '20px 0' }}>
                {booking.status === 'PAYMENT_PENDING' && (
                  <button
                    onClick={handlePayNow}
                    disabled={paying}
                    className="btn-app"
                    style={{ background: '#FF7A00', border: 'none', flexGrow: 1, justifyContent: 'center' }}
                  >
                    <CreditCard size={16} />
                    <span>{paying ? 'Processing...' : `Pay ₹${Number(booking.totalAmount) || 0} & Confirm Booking`}</span>
                  </button>
                )}

                {canInspect && (
                  <Link
                    to={`/active-rental/${booking.id}`}
                    className="btn-app"
                    style={{ flexGrow: 1, justifyContent: 'center' }}
                  >
                    <Car size={16} />
                    <span>Inspection &amp; Live Tracking</span>
                  </Link>
                )}

                {canExtend && (
                  <button
                    onClick={() => {
                      const next = new Date(new Date(booking.endAt).getTime() + 4 * 60 * 60 * 1000);
                      setNewEndAt(next.toISOString().slice(0, 16));
                      setExtensionModalOpen(true);
                    }}
                    style={{
                      background: '#F3F4F6',
                      border: '1px solid #D1D5DB',
                      color: '#374151',
                      borderRadius: '10px',
                      padding: '10px 18px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Clock size={15} /> Extend Rental
                  </button>
                )}

                {canCancel && (
                  <button
                    onClick={handleOpenCancelModal}
                    disabled={cancelling}
                    style={{
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#DC2626',
                      borderRadius: '10px',
                      padding: '10px 18px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <XCircle size={15} /> Cancel Booking
                  </button>
                )}

                {canReview && (
                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="btn-app"
                    style={{ background: '#10B981', border: 'none' }}
                  >
                    <Star size={15} /> Rate Experience
                  </button>
                )}
              </div>

              {/* Submitted Review Card */}
              {existingReview && (
                <div style={{
                  background: '#FFF8F0',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  border: '1px solid rgba(255,122,0,0.2)',
                  marginTop: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          fill={i < existingReview.rating ? '#FF7A00' : 'none'}
                          color="#FF7A00"
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Verified Renter Review</span>
                  </div>
                  {existingReview.title && <strong style={{ fontSize: '14px', color: '#111827' }}>{existingReview.title}</strong>}
                  {existingReview.comment && <p style={{ fontSize: '13px', color: '#4B5563', margin: '4px 0 0 0' }}>{existingReview.comment}</p>}
                </div>
              )}

              {/* Digital Key Section */}
              <div className="digital-key-card" style={{ marginTop: '20px' }}>
                <KeyRound size={24} color="var(--orange-primary)" />
                <div>
                  <h4>Smart Key Handover</h4>
                  <p>Vehicle unlocks keylessly via your smartphone once you arrive at the designated CountryDrive station hub.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Invoice & Pricing Breakdown */}
          <div className="booking-detail-right">
            <div className="invoice-summary-card">
              <div className="invoice-head">
                <Receipt size={18} color="var(--orange-primary)" />
                <h3>Official Tax Invoice</h3>
              </div>

              <div className="invoice-rows">
                <div className="invoice-row">
                  <span>Base Rental Subtotal</span>
                  <span>₹{Number(booking.subtotal) || 0}</span>
                </div>
                <div className="invoice-row">
                  <span>Platform Facilitation Fee</span>
                  <span>₹{Number(booking.platformFee) || 99}</span>
                </div>
                <div className="invoice-row">
                  <span>GST (18%)</span>
                  <span>₹{Number(booking.taxAmount) || 0}</span>
                </div>
                <div className="invoice-row invoice-deposit">
                  <span>Refundable Security Deposit</span>
                  <span>₹{Number(booking.securityDepositAmount) || 3000}</span>
                </div>
              </div>

              <div className="invoice-divider"></div>

              <div className="invoice-total">
                <span>Total Amount Paid</span>
                <strong>₹{Number(booking.totalAmount) || 0}</strong>
              </div>

              <div className="invoice-footer-note">
                <ShieldCheck size={16} color="#10B981" />
                <span>Security deposit is released automatically within 24 hours of successful vehicle inspection.</span>
              </div>

              {/* Need Help Link */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F3F4F6', textAlign: 'center' }}>
                <Link
                  to="/support"
                  style={{
                    color: '#6B7280',
                    fontSize: '13px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                  }}
                >
                  <HelpCircle size={15} color="var(--orange-primary)" />
                  Have questions about this trip? Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Cancellation Quote & Confirmation */}
        {cancelModalOpen && (
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
              padding: '28px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: '0 0 12px 0' }}>
                Cancel Booking #{booking.bookingNumber || booking.id.slice(0, 8)}?
              </h2>

              {cancelQuote && (
                <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '16px', margin: '14px 0', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#6B7280' }}>Total Paid:</span>
                    <strong style={{ color: '#111827' }}>₹{cancelQuote.totalPaid || booking.totalAmount}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#DC2626' }}>
                    <span>Cancellation Fee:</span>
                    <strong>-₹{cancelQuote.cancellationFee || 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#10B981', fontWeight: '700' }}>
                    <span>Refundable Amount:</span>
                    <strong>₹{cancelQuote.refundableAmount || booking.totalAmount}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9CA3AF' }}>
                    <span>Security Deposit Refund:</span>
                    <span>100% Refundable (₹{cancelQuote.securityDepositRefund || 3000})</span>
                  </div>
                </div>
              )}

              <div style={{ margin: '14px 0' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                  Reason for Cancellation
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                >
                  <option value="Plans changed">Change of travel plans</option>
                  <option value="Booked another vehicle">Booked an alternative vehicle</option>
                  <option value="Trip delayed">Trip delayed / rescheduled</option>
                  <option value="Personal emergency">Personal emergency</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(false)}
                  style={{ background: '#F3F4F6', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Keep Reservation
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={cancelling}
                  style={{ background: '#DC2626', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Extension Request */}
        {extensionModalOpen && (
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
              padding: '28px',
              maxWidth: '460px',
              width: '100%',
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: '0 0 12px 0' }}>
                Extend Your Rental
              </h2>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px 0' }}>
                Current return scheduled for {new Date(booking.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}.
              </p>

              <form onSubmit={handleRequestExtension}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                  New Return Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newEndAt}
                  onChange={(e) => setNewEndAt(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', marginBottom: '20px' }}
                />

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setExtensionModalOpen(false)}
                    style={{ background: '#F3F4F6', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={extending}
                    className="btn-app"
                    style={{ padding: '10px 18px', borderRadius: '8px' }}
                  >
                    {extending ? 'Calculating & Extending...' : 'Pay & Confirm Extension'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Rating & Review */}
        {reviewModalOpen && (
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
              padding: '28px',
              maxWidth: '480px',
              width: '100%',
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>
                Rate Your Trip with {vehicleName}
              </h2>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px 0' }}>
                Your review helps other verified CountryDrive renters.
              </p>

              <form onSubmit={handleSubmitReview}>
                {/* Star Picker */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                    >
                      <Star
                        size={28}
                        fill={star <= rating ? '#FF7A00' : 'none'}
                        color="#FF7A00"
                      />
                    </button>
                  ))}
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                    Review Headline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Smooth highway driving, pristine condition"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                    Feedback &amp; Comments
                  </label>
                  <textarea
                    rows={3}
                    placeholder="How was the vehicle handover, cleanliness, and driving experience?"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    style={{ background: '#F3F4F6', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Skip
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="btn-app"
                    style={{ padding: '10px 20px', borderRadius: '8px' }}
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
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
