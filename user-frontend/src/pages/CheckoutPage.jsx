import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { vehicleService } from '../services/vehicleService';
import { bookingService } from '../services/bookingService';
import { kycService } from '../services/kycService';
import { paymentService } from '../services/paymentService';
import { offerService } from '../services/offerService';
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  AlertCircle,
  CreditCard,
  Lock,
  ChevronLeft,
  FileText,
  Tag,
  Check
} from 'lucide-react';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuthModal, refreshUser } = useAuth();
  const { showToast } = useToast();

  const vehicleId = searchParams.get('vehicleId');
  const hours = Number(searchParams.get('hours') || 4);
  const city = searchParams.get('city') || 'Mumbai';
  const startAt = searchParams.get('start') || new Date().toISOString();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [eligibility, setEligibility] = useState({ eligible: true, issues: [] });
  const [kycInlineFormOpen, setKycInlineFormOpen] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Inline KYC details for instant submission if missing
  const [licenseNumber, setLicenseNumber] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  const endAt = new Date(new Date(startAt).getTime() + hours * 60 * 60 * 1000).toISOString();

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal();
    }
  }, [isAuthenticated, openAuthModal]);

  useEffect(() => {
    async function loadVehicleAndKyc() {
      if (!vehicleId) return;
      try {
        setLoading(true);
        const vData = await vehicleService.getVehicleById(vehicleId);
        setVehicle(vData.vehicle);

        // Check backend KYC eligibility if logged in
        if (isAuthenticated) {
          try {
            const elig = await kycService.checkEligibility({
              vehicleId,
              startAt,
              endAt,
            });
            setEligibility(elig);
            if (!elig.eligible) {
              setKycInlineFormOpen(true);
            }
          } catch (err) {
            console.warn('Backend eligibility check returned:', err.message);
            setEligibility({ eligible: false, issues: [err.message] });
            setKycInlineFormOpen(true);
          }
        }
      } catch (err) {
        showToast(err.message || 'Error loading vehicle details', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadVehicleAndKyc();
  }, [vehicleId, isAuthenticated, startAt, endAt, showToast]);

  if (loading) {
    return (
      <div className="checkout-loading">
        <div className="spinner"></div>
        <p>Preparing reservation checkout...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="checkout-error">
        <h2>No Vehicle Selected</h2>
        <p>Please choose a vehicle from the catalog to proceed to checkout.</p>
        <Link to="/vehicles" className="btn-app" style={{ display: 'inline-flex', marginTop: '16px' }}>
          Browse Vehicles
        </Link>
      </div>
    );
  }

  const rawQuote = bookingService.calculateFareQuote(
    vehicle.price,
    startAt,
    endAt,
    vehicle.securityDeposit || 3000
  );

  const discountAmount = appliedCoupon?.discountAmount || 0;
  const quote = {
    ...rawQuote,
    discountAmount,
    totalPayable: Math.max(0, rawQuote.totalPayable - discountAmount),
    grandTotal: Math.max(0, rawQuote.grandTotal - discountAmount),
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    if (!isAuthenticated) {
      openAuthModal();
      showToast('Please sign in to apply coupon codes and discounts', 'info');
      return;
    }

    try {
      setValidatingCoupon(true);
      const res = await offerService.validateCoupon({
        code: couponCode,
        vehicleId: vehicle.id,
        planType: 'PAY_AS_YOU_GO',
        subtotal: rawQuote.totalPayable,
      });

      const couponRes = res.data || res;
      setAppliedCoupon(couponRes);
      showToast(`Coupon ${couponRes.code || couponCode.toUpperCase()} applied! Saved ₹${couponRes.discountAmount || 0}`, 'success');
    } catch (err) {
      showToast(err.message || 'Invalid or expired coupon code', 'error');
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handleInlineKycSubmit = async (e) => {
    e.preventDefault();
    try {
      const isTwoWheeler = vehicle?.type?.toLowerCase() === 'bike' || vehicle?.type?.toLowerCase() === 'scooty';
      await kycService.saveDetails({
        licenseNumber: licenseNumber.trim().toUpperCase(),
        licenseExpiryAt: new Date(Date.now() + 3650 * 24 * 3600 * 1000).toISOString().split('T')[0],
        dateOfBirth: '1995-01-01',
        licenseCategories: isTwoWheeler ? ['MCWG'] : ['LMV'],
        emergencyPhone: emergencyPhone?.trim() || undefined,
      });
      await refreshUser();
      setEligibility({ eligible: true, issues: [] });
      setKycInlineFormOpen(false);
      showToast('Driving License details saved successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update KYC details', 'error');
    }
  };

  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    try {
      setSubmitting(true);
      // 1. Create booking on backend
      const res = await bookingService.createBooking({
        vehicleId: vehicle.id,
        startAt,
        endAt,
        planType: 'PAY_AS_YOU_GO',
        couponCode: appliedCoupon?.code,
      });

      const booking = res.data || res;
      const bookingId = booking.id;

      // 2. Trigger Razorpay order creation
      try {
        const orderData = await paymentService.createOrder(bookingId);
        const order = orderData.data || orderData;

        if (order && window.Razorpay && order.razorpayOrderId) {
          const options = {
            key: order.keyId || 'rzp_test_key',
            amount: order.amount,
            currency: 'INR',
            name: 'CountryDrive Car Rental',
            description: `Trip Booking: ${vehicle.name}`,
            order_id: order.razorpayOrderId,
            prefill: {
              name: user?.name || '',
              contact: user?.phone || '',
              email: user?.email || '',
            },
            handler: async (paymentResponse) => {
              try {
                await paymentService.verifyPayment({
                  bookingId,
                  razorpayOrderId: paymentResponse.razorpay_order_id,
                  razorpayPaymentId: paymentResponse.razorpay_payment_id,
                  razorpaySignature: paymentResponse.razorpay_signature,
                });
                showToast('Payment verified & booking confirmed!', 'success');
                navigate(`/booking-success/${bookingId}`, {
                  state: { booking, vehicle, quote, city, paymentVerified: true },
                });
              } catch (vErr) {
                showToast(vErr.message || 'Payment verification failed', 'error');
                navigate(`/my-bookings/${bookingId}`);
              }
            },
            theme: { color: '#FF7A00' },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
          return;
        }
      } catch (orderErr) {
        console.warn('Razorpay order initialization skipped/failed:', orderErr.message);
      }

      // If Razorpay is not configured or awaiting manual payment completion:
      showToast(`Booking reserved (#${booking.bookingNumber || bookingId}). Please complete payment to confirm.`, 'info');
      navigate(`/booking-success/${bookingId}`, {
        state: { booking, vehicle, quote, city, paymentVerified: false },
      });
    } catch (err) {
      showToast(err.message || 'Failed to complete booking. Please verify details.', 'error');
      if (err.message?.includes('KYC') || err.message?.includes('Licence') || err.code === 'KYC_OR_POLICY_REQUIREMENT_FAILED') {
        setKycInlineFormOpen(true);
      }
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="checkout-page">
      <div className="section-inner">
        <Link to={`/vehicles/${vehicle.id}`} className="detail-back-link">
          <ChevronLeft size={18} /> Back to Vehicle
        </Link>

        <h1 className="checkout-page-title">Review &amp; Confirm Booking</h1>

        <div className="checkout-grid">
          {/* Left Column: Booking & Verification Checklist */}
          <div className="checkout-main-col">
            {/* Vehicle Summary Card */}
            <div className="checkout-card">
              <h3 className="checkout-card-heading">Vehicle Details</h3>
              <div className="checkout-vehicle-preview">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="checkout-vehicle-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/uploads/cards/White Modern SUV Studio Render.png';
                  }}
                />
                <div className="checkout-vehicle-info">
                  <h4>{vehicle.name}</h4>
                  <div className="checkout-vehicle-chips">
                    <span>{vehicle.category?.toUpperCase() || 'CAR'}</span>
                    <span>{vehicle.fuel}</span>
                    <span>{vehicle.transmission}</span>
                    <span>{vehicle.seats} Seats</span>
                  </div>
                  <span className="checkout-rate-text">₹{vehicle.price} / hour</span>
                </div>
              </div>
            </div>

            {/* Rental Schedule & Location */}
            <div className="checkout-card">
              <h3 className="checkout-card-heading">Rental Schedule</h3>
              <div className="checkout-schedule-grid">
                <div className="schedule-item">
                  <div className="schedule-icon-wrap">
                    <Calendar size={18} color="var(--orange-primary)" />
                  </div>
                  <div>
                    <span className="schedule-label">Pickup Time</span>
                    <strong>{new Date(startAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</strong>
                  </div>
                </div>

                <div className="schedule-item">
                  <div className="schedule-icon-wrap">
                    <Clock size={18} color="var(--orange-primary)" />
                  </div>
                  <div>
                    <span className="schedule-label">Return Time ({hours} Hours)</span>
                    <strong>{new Date(endAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</strong>
                  </div>
                </div>

                <div className="schedule-item">
                  <div className="schedule-icon-wrap">
                    <MapPin size={18} color="var(--orange-primary)" />
                  </div>
                  <div>
                    <span className="schedule-label">Pickup &amp; Drop Hub</span>
                    <strong>{city} CountryDrive Verified Station</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* KYC & Identity Check Notice */}
            <div className="checkout-card">
              <div className="kyc-notice-header">
                <div className="kyc-notice-title">
                  <ShieldCheck size={20} color={eligibility.eligible ? '#10B981' : '#F59E0B'} />
                  <h3>Renter Identity &amp; Driving License Verification</h3>
                </div>
                <span className={`kyc-status-chip ${eligibility.eligible ? 'status-ok' : 'status-warn'}`}>
                  {eligibility.eligible ? 'Ready to Book' : 'Details Required'}
                </span>
              </div>

              {!eligibility.eligible && (
                <div className="kyc-issues-alert">
                  <AlertCircle size={18} />
                  <div>
                    <strong>Action Required for Instant Reservation:</strong>
                    <ul>
                      {eligibility.issues.map((iss, i) => (
                        <li key={i}>{iss}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Inline KYC submission if not yet complete */}
              {kycInlineFormOpen && (
                <form className="inline-kyc-form" onSubmit={handleInlineKycSubmit}>
                  <h4>Submit Driving License Details</h4>
                  <div className="modal-form-row">
                    <div className="modal-form-group">
                      <label>Valid Indian Driving License No.</label>
                      <input
                        type="text"
                        placeholder="e.g. MH1220190012345"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="modal-form-group">
                      <label>Emergency Contact Phone</label>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button type="submit" className="btn-app">
                      Save &amp; Continue
                    </button>
                    <Link
                      to="/kyc"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        border: '1px solid #d1d5db',
                        background: '#f9fafb',
                        color: '#374151',
                        textDecoration: 'none',
                      }}
                    >
                      <ShieldCheck size={16} color="#FF7A00" />
                      <span>Upload DL &amp; Selfie in KYC Portal →</span>
                    </Link>
                  </div>
                </form>
              )}

              <p className="kyc-disclaimer-text">
                Under Zoomcar / MoRTH compliance, a valid Driving License matching the vehicle category is required before vehicle keys are handed over.
              </p>
            </div>
          </div>

          {/* Right Column: Fare Breakdown & Confirmation */}
          <div className="checkout-side-col">
            <div className="checkout-summary-card">
              <h3 className="summary-title">Fare Summary</h3>

              {/* Coupon / Promo Code Input */}
              <div style={{ marginBottom: '18px', paddingBottom: '16px', borderBottom: '1px solid #F3F4F6' }}>
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. DRIVE20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={!!appliedCoupon || validatingCoupon}
                    style={{
                      flexGrow: 1,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #D1D5DB',
                      fontSize: '13px',
                      fontWeight: '600',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      style={{
                        background: '#FEE2E2',
                        border: 'none',
                        color: '#DC2626',
                        padding: '0 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={validatingCoupon || !couponCode.trim()}
                      className="btn-app"
                      style={{ padding: '0 16px', borderRadius: '8px', fontSize: '13px' }}
                    >
                      {validatingCoupon ? 'Checking...' : 'Apply'}
                    </button>
                  )}
                </form>
                {appliedCoupon && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', color: '#10B981', fontSize: '12px', fontWeight: '600' }}>
                    <Check size={14} />
                    <span>Coupon {appliedCoupon.code} applied (-₹{quote.discountAmount})</span>
                  </div>
                )}
              </div>

              <div className="fare-rows">
                <div className="fare-row">
                  <span>Base Rental ({hours} hrs @ ₹{quote.hourlyRate})</span>
                  <span>₹{quote.baseRentalAmount}</span>
                </div>
                {quote.discountAmount > 0 && (
                  <div className="fare-row" style={{ color: '#10B981', fontWeight: '600' }}>
                    <span>Promo Discount ({appliedCoupon?.code})</span>
                    <span>-₹{quote.discountAmount}</span>
                  </div>
                )}
                <div className="fare-row">
                  <span>Platform Facilitation Fee</span>
                  <span>₹{quote.platformFee}</span>
                </div>
                <div className="fare-row">
                  <span>Goods &amp; Services Tax (GST 18%)</span>
                  <span>₹{quote.taxAmount}</span>
                </div>
                <div className="fare-row fare-deposit">
                  <span>Refundable Security Deposit</span>
                  <span>₹{quote.securityDeposit}</span>
                </div>
              </div>

              <div className="fare-divider"></div>

              <div className="fare-total-box">
                <div>
                  <span className="total-label">Grand Total Amount</span>
                  <span className="total-sub">(Inclusive of all taxes &amp; deposit)</span>
                </div>
                <span className="total-price">₹{quote.grandTotal}</span>
              </div>

              <button
                type="button"
                className="btn-confirm-checkout"
                disabled={submitting}
                onClick={handleConfirmBooking}
              >
                {submitting ? (
                  <span>Processing Reservation...</span>
                ) : (
                  <>
                    <CreditCard size={18} />
                    <span>Confirm &amp; Reserve Ride</span>
                  </>
                )}
              </button>

              <div className="checkout-trust-badges">
                <div className="trust-item">
                  <Lock size={14} color="#10B981" />
                  <span>256-bit Encrypted Checkout</span>
                </div>
                <div className="trust-item">
                  <FileText size={14} color="#10B981" />
                  <span>Official GST Tax Invoice Provided</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
