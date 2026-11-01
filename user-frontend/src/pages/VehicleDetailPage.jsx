import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import { bookingService } from '../services/bookingService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import ModernDateTimePicker from '../components/common/ModernDateTimePicker';
import {
  Users,
  Fuel,
  Settings,
  ShieldCheck,
  Check,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Star,
  Info,
  ChevronLeft,
  MessageSquare,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export default function VehicleDetailPage() {
  const { id, vehicleId } = useParams();
  const targetId = vehicleId || id;
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [reviewsData, setReviewsData] = useState({ reviews: [], total: 0, averageRating: 4.9 });

  // Quote configuration
  const [hours, setHours] = useState(4);
  const [city, setCity] = useState('Mumbai');
  const [startDateTime, setStartDateTime] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    d.setMinutes(0);
    return d.toISOString().slice(0, 16);
  });

  useEffect(() => {
    async function loadVehicle() {
      if (!targetId) return;
      try {
        setLoading(true);
        setError(null);
        const [vData, rData] = await Promise.allSettled([
          vehicleService.getVehicleById(targetId),
          reviewService.getVehicleReviews(targetId),
        ]);

        if (vData.status === 'fulfilled' && vData.value?.vehicle) {
          setVehicle(vData.value.vehicle);
          setActiveImage(vData.value.vehicle.image);
        } else {
          throw new Error('Vehicle not found or unlisted');
        }

        if (rData.status === 'fulfilled' && rData.value) {
          setReviewsData(rData.value);
        }
      } catch (err) {
        setError(err.message || 'Vehicle details unavailable');
      } finally {
        setLoading(false);
      }
    }

    loadVehicle();
  }, [targetId]);

  if (loading) {
    return (
      <div className="detail-loading-container">
        <div className="spinner"></div>
        <p>Loading vehicle specifications &amp; availability...</p>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="detail-error-container">
        <h2>Vehicle Not Found</h2>
        <p>The vehicle you are looking for does not exist or has been unlisted.</p>
        <Link to="/vehicles" className="btn-app" style={{ display: 'inline-flex', marginTop: '20px' }}>
          Browse All Vehicles
        </Link>
      </div>
    );
  }

  // Calculate pricing quote matching backend formula
  const endDateTime = new Date(new Date(startDateTime).getTime() + hours * 60 * 60 * 1000).toISOString();
  const quote = bookingService.calculateFareQuote(
    vehicle.price,
    startDateTime,
    endDateTime,
    vehicle.securityDeposit || 3000
  );

  const isAvailable = !vehicle.status || vehicle.status === 'AVAILABLE';

  const handleProceedToBooking = () => {
    if (!isAvailable) return;
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    navigate(`/booking/${vehicle.id}?hours=${hours}&city=${encodeURIComponent(city)}&start=${encodeURIComponent(startDateTime)}`);
  };

  const images = vehicle.allMedia?.length > 0
    ? vehicle.allMedia.map((m) => m.url)
    : [vehicle.image];

  return (
    <div className="vehicle-detail-page">
      <div className="section-inner">
        {/* Back navigation */}
        <Link to="/vehicles" className="detail-back-link">
          <ChevronLeft size={18} /> Back to Vehicles
        </Link>

        <div className="detail-main-grid">
          {/* Left Column: Gallery & Details */}
          <div className="detail-left-col">
            <div className="detail-gallery-card">
              <div className="detail-hero-image-wrap">
                <img
                  src={activeImage || vehicle.image}
                  alt={vehicle.name}
                  className="detail-hero-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/uploads/cards/White Modern SUV Studio Render.png';
                  }}
                />
                <span className="detail-fuel-badge">{vehicle.fuel}</span>
              </div>

              {images.length > 1 && (
                <div className="detail-thumbnails-row">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`thumb-btn ${activeImage === imgUrl ? 'active' : ''}`}
                      onClick={() => setActiveImage(imgUrl)}
                    >
                      <img src={imgUrl} alt={`View ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Title & Key Highlights */}
            <div className="detail-info-card">
              <div className="detail-eyebrow-row">
                <span className="vehicle-type-label">{vehicle.type}</span>
                <div className="vehicle-rating-pill">
                  <Star size={14} fill="#FFB800" color="#FFB800" />
                  <span>{vehicle.rating}</span>
                  <span className="reviews-count">({vehicle.reviews} customer reviews)</span>
                </div>
              </div>

              <h1 className="detail-vehicle-name">{vehicle.name}</h1>
              <p className="detail-description">{vehicle.description}</p>

              {/* Technical Specifications Chips */}
              <div className="detail-specs-grid">
                <div className="spec-card">
                  <Users size={20} color="var(--orange-primary)" />
                  <div>
                    <span className="spec-label">Capacity</span>
                    <strong>{vehicle.seats} Seater</strong>
                  </div>
                </div>

                <div className="spec-card">
                  <Fuel size={20} color="var(--orange-primary)" />
                  <div>
                    <span className="spec-label">Fuel Type</span>
                    <strong>{vehicle.fuel}</strong>
                  </div>
                </div>

                <div className="spec-card">
                  <Settings size={20} color="var(--orange-primary)" />
                  <div>
                    <span className="spec-label">Transmission</span>
                    <strong>{vehicle.transmission}</strong>
                  </div>
                </div>

                <div className="spec-card">
                  <ShieldCheck size={20} color="var(--orange-primary)" />
                  <div>
                    <span className="spec-label">Insurance</span>
                    <strong>Comprehensive</strong>
                  </div>
                </div>
              </div>

              {/* Pickup & Location Information */}
              <div className="detail-features-box" style={{ marginTop: '20px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} color="var(--orange-primary)" />
                  Pickup & Location Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '12px' }}>
                  <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>CITY / REGION</div>
                    <strong style={{ fontSize: '14px', color: '#0F172A' }}>{vehicle.city || 'Mumbai'}, {vehicle.state || 'Maharashtra'}</strong>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>PICKUP HUB</div>
                    <strong style={{ fontSize: '14px', color: '#0F172A' }}>CountryDrive Certified Hub</strong>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>KILOMETER LIMIT</div>
                    <strong style={{ fontSize: '14px', color: '#0F172A' }}>{vehicle.includedKm || 100} km free per day</strong>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>EXTRA KM CHARGE</div>
                    <strong style={{ fontSize: '14px', color: '#0F172A' }}>₹{vehicle.extraKmRate || 12}/km</strong>
                  </div>
                </div>

                {vehicle.owner?.name && (
                  <div style={{ marginTop: '14px', padding: '12px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <UserCheck size={18} color="#16A34A" />
                    <span style={{ fontSize: '13px', color: '#166534' }}>
                      Hosted by <strong>{vehicle.owner.name}</strong> • Verified CountryDrive Fleet Partner
                    </span>
                  </div>
                )}
              </div>

              {/* Included Perks & Rules */}
              <div className="detail-features-box" style={{ marginTop: '20px' }}>
                <h3>Included with this Rental</h3>
                <div className="features-checklist">
                  {vehicle.features.map((feat, i) => (
                    <div key={i} className="feat-check-item">
                      <Check size={16} color="#10B981" />
                      <span>{feat}</span>
                    </div>
                  ))}
                  <div className="feat-check-item">
                    <Check size={16} color="#10B981" />
                    <span>Free cancellation up to 2 hours before trip starts</span>
                  </div>
                  <div className="feat-check-item">
                    <Check size={16} color="#10B981" />
                    <span>Digital vehicle key with instant Bluetooth unlock</span>
                  </div>
                </div>
              </div>

              {/* Verified Customer Reviews Section */}
              <div className="detail-features-box" style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={18} color="var(--orange-primary)" />
                    Verified Renter Reviews
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FFF8F0', padding: '4px 10px', borderRadius: '8px' }}>
                    <Star size={15} fill="#FF7A00" color="#FF7A00" />
                    <strong style={{ fontSize: '13px', color: '#111827' }}>
                      {reviewsData.averageRating ? Number(reviewsData.averageRating).toFixed(1) : '4.9'}
                    </strong>
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>
                      ({reviewsData.total || (reviewsData.reviews?.length || 0)} ratings)
                    </span>
                  </div>
                </div>

                {reviewsData.reviews && reviewsData.reviews.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {reviewsData.reviews.slice(0, 4).map((rev, idx) => (
                      <div key={rev.id || idx} style={{ background: '#F9FAFB', borderRadius: '10px', padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            {[...Array(5)].map((_, s) => (
                              <Star
                                key={s}
                                size={12}
                                fill={s < rev.rating ? '#FF7A00' : 'none'}
                                color="#FF7A00"
                              />
                            ))}
                          </div>
                          <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Verified Trip'}
                          </span>
                        </div>
                        {rev.title && <strong style={{ fontSize: '13px', color: '#111827', display: 'block' }}>{rev.title}</strong>}
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#4B5563', lineHeight: '1.4' }}>
                          {rev.comment || 'Smooth, clean and timely pickup. Vehicle drove like a dream.'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                    No reviews written yet for this vehicle. Be the first verified customer to rent and review!
                  </p>
                )}
              </div>
            </div>
          </div>


          {/* Right Column: Transparent Pricing & Instant Booking Panel */}
          <div className="detail-right-col">
            <div className="booking-quote-card">
              <div className="quote-header">
                <span className="quote-tag">RESERVATION QUOTE</span>
                <div className="quote-rate-large">
                  <span className="curr">₹</span>
                  <span className="num">{vehicle.price}</span>
                  <span className="per">/ hour</span>
                </div>
                <span className="quote-sub">No surge pricing • All taxes &amp; GST included</span>
              </div>

              {/* Booking configuration form */}
              <div className="quote-form">
                <div className="quote-input-group">
                  <label><MapPin size={15} /> Pickup City</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)}>
                    <option value="Mumbai">Mumbai - Airport / Bandra</option>
                    <option value="Delhi">Delhi - Connaught Place</option>
                    <option value="Bangalore">Bangalore - Indiranagar</option>
                    <option value="Pune">Pune - Koregaon Park</option>
                    <option value="Goa">Goa - Panaji</option>
                    <option value="Hyderabad">Hyderabad - Hitec City</option>
                  </select>
                </div>

                <div className="quote-input-group">
                  <label><Clock size={15} /> Duration</label>
                  <select value={hours} onChange={(e) => setHours(Number(e.target.value))}>
                    <option value={1}>1 Hour</option>
                    <option value={2}>2 Hours</option>
                    <option value={4}>4 Hours (Standard)</option>
                    <option value={8}>8 Hours (Full Day)</option>
                    <option value={12}>12 Hours</option>
                    <option value={24}>24 Hours (Overnight)</option>
                    <option value={48}>48 Hours (Weekend Getaway)</option>
                  </select>
                </div>

                <div className="quote-input-group" style={{ position: 'relative', minHeight: '64px', justifyContent: 'center' }}>
                  <ModernDateTimePicker
                    value={startDateTime}
                    onChange={(val) => setStartDateTime(val)}
                    label="Start Date & Time"
                  />
                </div>
              </div>

              {/* Server-Formula Price Breakdown */}
              <div className="quote-price-breakdown">
                <div className="quote-row">
                  <span>Base Fare ({quote.rentalHours} hrs × ₹{quote.hourlyRate})</span>
                  <span>₹{quote.baseRentalAmount}</span>
                </div>
                <div className="quote-row">
                  <span>Platform &amp; Convenience Fee</span>
                  <span>₹{quote.platformFee}</span>
                </div>
                <div className="quote-row">
                  <span>GST &amp; Government Levies (18%)</span>
                  <span>₹{quote.taxAmount}</span>
                </div>
                <div className="quote-row quote-refundable">
                  <span>
                    Refundable Security Deposit
                    <Info size={12} title="100% refunded within 24 hours of vehicle return" />
                  </span>
                  <span>₹{quote.securityDeposit}</span>
                </div>

                <div className="quote-total-row">
                  <div>
                    <strong>Total Customer Payable</strong>
                    <span className="deposit-note">(Includes ₹{quote.securityDeposit} refundable deposit)</span>
                  </div>
                  <strong className="grand-total-val">₹{quote.grandTotal}</strong>
                </div>
              </div>

              {/* Action Button */}
              {!isAvailable ? (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={18} color="#B91C1C" />
                    <span>Currently {vehicle.status || 'UNAVAILABLE'} for reservation</span>
                  </div>
                  <button
                    type="button"
                    className="btn-proceed-booking"
                    disabled
                    style={{ opacity: 0.6, cursor: 'not-allowed', background: '#94A3B8' }}
                  >
                    <span>Vehicle Currently Unavailable</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-proceed-booking"
                  onClick={handleProceedToBooking}
                >
                  <span>Proceed to Reserve</span>
                  <ArrowRight size={18} />
                </button>
              )}

              <div className="quote-guarantee">
                <ShieldCheck size={16} color="#0D9488" />
                <span>Zoomcar / Drivezy KYC compliance &amp; 100% RC verification guaranteed.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Reservation Bar */}
      <div className="mobile-detail-sticky-bar">
        <div>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>RESERVATION FARE</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <strong style={{ fontSize: '20px', color: '#0F172A' }}>₹{vehicle.price}</strong>
            <span style={{ fontSize: '12px', color: '#64748B' }}>/ hour</span>
          </div>
        </div>
        {!isAvailable ? (
          <button
            type="button"
            className="btn-app"
            disabled
            style={{ opacity: 0.6, cursor: 'not-allowed', background: '#94A3B8', padding: '10px 16px', fontSize: '13px' }}
          >
            Unavailable
          </button>
        ) : (
          <button
            type="button"
            className="btn-app"
            onClick={handleProceedToBooking}
            style={{ padding: '12px 22px', fontSize: '14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>Proceed to Reserve</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
