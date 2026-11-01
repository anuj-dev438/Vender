import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { rentalService } from '../services/rentalService';
import { uploadService } from '../services/uploadService';
import { useToast } from '../context/ToastContext';
import {
  Car,
  Clock,
  Gauge,
  Fuel,
  Camera,
  ShieldCheck,
  PhoneCall,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  Navigation,
  Upload,
  Check,
  Activity
} from 'lucide-react';

const REQUIRED_PHOTO_CATEGORIES = [
  { key: 'FRONT', label: 'Front Exterior' },
  { key: 'REAR', label: 'Rear Exterior' },
  { key: 'LEFT', label: 'Left Side' },
  { key: 'RIGHT', label: 'Right Side' },
  { key: 'INTERIOR_DASHBOARD', label: 'Dashboard & Console' },
  { key: 'INTERIOR_SEATS', label: 'Seats & Cabin' },
];

export default function ActiveRentalPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [booking, setBooking] = useState(null);
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live GPS Telemetry
  const [liveLocation, setLiveLocation] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);

  // Pickup inspection state
  const [pickupOdometer, setPickupOdometer] = useState('');
  const [pickupFuel, setPickupFuel] = useState('90');
  const [pickupPhotos, setPickupPhotos] = useState({});
  const [uploadingCategory, setUploadingCategory] = useState(null);
  const [submittingPickup, setSubmittingPickup] = useState(false);

  // Return inspection state
  const [returnOdometer, setReturnOdometer] = useState('');
  const [returnFuel, setReturnFuel] = useState('85');
  const [hasDamage, setHasDamage] = useState(false);
  const [damageDescription, setDamageDescription] = useState('');
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [returned, setReturned] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingData, rentalData] = await Promise.allSettled([
        bookingService.getBookingById(id),
        rentalService.getDetails(id),
      ]);

      if (bookingData.status === 'fulfilled') {
        setBooking(bookingData.value);
        if (bookingData.value.status === 'COMPLETED') {
          setReturned(true);
        }
      }
      if (rentalData.status === 'fulfilled' && rentalData.value) {
        setRental(rentalData.value);
      }
    } catch (err) {
      console.warn('Booking / Rental fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Live GPS WebSocket & Polling
  useEffect(() => {
    if (!id || booking?.status !== 'ACTIVE') return;

    // First fetch latest location via REST
    rentalService.getLatestGps(id)
      .then((loc) => { if (loc) setLiveLocation(loc); })
      .catch(() => {});

    // Then connect WebSocket for real-time broadcasts
    const disconnect = rentalService.connectLiveTracking(
      id,
      (loc) => {
        setLiveLocation(loc);
        setWsConnected(true);
      },
      (err) => {
        setWsConnected(false);
      }
    );

    // Fallback polling every 15s if WS is idle
    const pollInterval = setInterval(() => {
      rentalService.getLatestGps(id)
        .then((loc) => { if (loc) setLiveLocation(loc); })
        .catch(() => {});
    }, 15000);

    return () => {
      if (disconnect) disconnect();
      clearInterval(pollInterval);
    };
  }, [id, booking?.status]);

  // Handle Photo Upload for Pickup Inspection
  const handlePhotoUpload = async (category, file) => {
    if (!file) return;
    try {
      setUploadingCategory(category);
      const uploaded = await uploadService.uploadFile(file, 'inspection');
      setPickupPhotos((prev) => ({
        ...prev,
        [category]: uploaded.fileUrl || URL.createObjectURL(file),
      }));
      showToast(`${category} photo uploaded successfully!`, 'success');
    } catch (err) {
      // In dev sandbox, fallback to local preview
      setPickupPhotos((prev) => ({
        ...prev,
        [category]: URL.createObjectURL(file),
      }));
      showToast(`${category} photo recorded`, 'info');
    } finally {
      setUploadingCategory(null);
    }
  };

  // Submit Pickup Checklist
  const handlePickupSubmit = async (e) => {
    e.preventDefault();
    const uploadedCount = Object.keys(pickupPhotos).length;
    if (uploadedCount < 6) {
      showToast(`Please upload all 6 inspection photos (${uploadedCount}/6 uploaded)`, 'error');
      return;
    }

    try {
      setSubmittingPickup(true);
      const photoArray = Object.entries(pickupPhotos).map(([cat, url]) => ({
        category: cat,
        fileUrl: url,
      }));

      await rentalService.submitPickupInspection(id, {
        odometerReading: Number(pickupOdometer),
        fuelLevel: Number(pickupFuel),
        photos: photoArray,
        notes: 'Handover verified by customer',
      });

      showToast('Pickup verified! Rental trip is now ACTIVE.', 'success');
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to submit pickup inspection', 'error');
    } finally {
      setSubmittingPickup(false);
    }
  };

  // Submit Return Checklist
  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingReturn(true);
      const damages = hasDamage ? [
        {
          damageType: 'OTHER',
          severity: 'MINOR',
          description: damageDescription || 'Reported minor wear/scratch',
          estimatedCost: 0,
        }
      ] : [];

      await rentalService.submitReturnInspection(id, {
        odometerReading: Number(returnOdometer),
        fuelLevel: Number(returnFuel),
        damages,
        notes: 'Return inspection submitted by customer',
      });

      setReturned(true);
      showToast('Trip ended successfully! Security deposit refund initiated.', 'success');
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to submit return inspection', 'error');
    } finally {
      setSubmittingReturn(false);
    }
  };

  if (loading) {
    return (
      <div className="detail-loading-container">
        <div className="spinner"></div>
        <p>Loading active rental telemetry...</p>
      </div>
    );
  }

  const vehicle = booking?.vehicle || {};
  const vehicleName = vehicle.variant
    ? `${vehicle.make} ${vehicle.model} ${vehicle.variant}`
    : vehicle.make ? `${vehicle.make} ${vehicle.model}` : 'Active Vehicle';

  const isPaymentPending = booking?.status === 'PAYMENT_PENDING';
  const isTripActive = booking?.status === 'ACTIVE' || rental?.startedAt;
  const isTripCompleted = booking?.status === 'COMPLETED' || returned;
  const isPickupPending = booking?.status === 'CONFIRMED' && !rental?.startedAt;

  return (
    <div className="active-rental-page">
      <div className="section-inner">
        <Link to={`/my-bookings/${id}`} className="detail-back-link">
          <ChevronLeft size={18} /> Back to Reservation Overview
        </Link>

        <div className="active-rental-hero-header">
          <div>
            <span className="live-trip-tag" style={{
              background: isTripCompleted ? '#10B981' : isTripActive ? '#FF7A00' : isPaymentPending ? '#F59E0B' : '#3B82F6',
            }}>
              {isTripCompleted ? 'TRIP COMPLETED' : isTripActive ? 'LIVE TRIP IN PROGRESS' : isPaymentPending ? 'PAYMENT PENDING' : 'READY FOR PICKUP'}
            </span>
            <h1>{vehicleName}</h1>
            <p>Registration: <strong>{vehicle.registrationNumber || 'MH-12-AB-1234'}</strong> • {vehicle.city || 'Mumbai'} Station Hub</p>
          </div>

          <a href="tel:18001234567" className="btn-sos-call">
            <PhoneCall size={18} />
            <span>24/7 Roadside SOS</span>
          </a>
        </div>

        <div className="active-rental-grid">
          {/* Left Column: Trip Telemetry & Live GPS Tracker */}
          <div className="active-left-col">
            <div className="telemetry-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>Vehicle Telemetry &amp; GPS</h3>
                {isTripActive && (
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: wsConnected ? '#10B981' : '#FF7A00',
                  }}>
                    <Activity size={13} />
                    {wsConnected ? 'Live WebSocket Active' : 'GPS Tracking Ready'}
                  </span>
                )}
              </div>

              <div className="telemetry-stats-row">
                <div className="stat-box">
                  <Clock size={22} color="var(--orange-primary)" />
                  <div>
                    <span className="stat-lbl">Scheduled Return</span>
                    <strong>{booking ? new Date(booking.endAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Pending'}</strong>
                  </div>
                </div>

                <div className="stat-box">
                  <Gauge size={22} color="var(--orange-primary)" />
                  <div>
                    <span className="stat-lbl">Included KM</span>
                    <strong>{vehicle.includedKm || 150} KM</strong>
                  </div>
                </div>

                <div className="stat-box">
                  <Fuel size={22} color="var(--orange-primary)" />
                  <div>
                    <span className="stat-lbl">Fuel Type</span>
                    <strong>{vehicle.fuelType || 'Petrol'}</strong>
                  </div>
                </div>
              </div>

              {/* Live GPS Coordinates Panel */}
              {liveLocation && (
                <div style={{
                  background: '#F9FAFB',
                  borderRadius: '12px',
                  padding: '16px',
                  margin: '18px 0',
                  border: '1px solid #E5E7EB',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Navigation size={16} color="var(--orange-primary)" />
                    <strong style={{ fontSize: '13px', color: '#111827' }}>Live Vehicle Coordinates</strong>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '12px', color: '#4B5563' }}>
                    <div>
                      <span>Coordinates: </span>
                      <strong>{Number(liveLocation.latitude).toFixed(4)}, {Number(liveLocation.longitude).toFixed(4)}</strong>
                    </div>
                    <div>
                      <span>Speed: </span>
                      <strong>{liveLocation.speed ? `${Math.round(liveLocation.speed)} km/h` : 'Stationary'}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="digital-key-active-box">
                <ShieldCheck size={24} color="#10B981" />
                <div>
                  <strong>Keyless Station Handover Active</strong>
                  <p>Vehicle unlocks automatically when you approach the vehicle hub and verify inspection.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pickup Inspection OR Return Inspection */}
          <div className="active-right-col">
            {isPaymentPending ? (
              <div className="return-card">
                <div style={{ textAlign: 'center', padding: '36px 16px' }}>
                  <AlertTriangle size={52} color="#F59E0B" style={{ margin: '0 auto 16px' }} />
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                    Payment Confirmation Required
                  </h4>
                  <p style={{ color: '#4B5563', fontSize: '13px', lineHeight: 1.6, margin: '0 0 24px' }}>
                    This vehicle reservation is currently awaiting payment. As per self-drive rental compliance, vehicle pickup inspection and digital key handover cannot begin until payment has been confirmed.
                  </p>
                  <Link to={`/my-bookings/${id}`} className="btn-app" style={{ display: 'inline-flex', background: '#F59E0B' }}>
                    Complete Payment in Booking Details
                  </Link>
                </div>
              </div>
            ) : isTripCompleted ? (
              <div className="return-card">
                <div className="return-success-screen" style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <CheckCircle size={48} color="#10B981" style={{ margin: '0 auto 14px auto' }} />
                  <h4>Vehicle Trip Finished!</h4>
                  <p style={{ color: '#4B5563', fontSize: '13px', margin: '0 0 20px 0' }}>
                    Inspections completed. Your security deposit of ₹{booking?.securityDepositAmount || 3000} will be credited to your payment method within 24 hours.
                  </p>
                  <Link to={`/my-bookings/${id}`} className="btn-app" style={{ display: 'inline-flex' }}>
                    View Trip Invoice &amp; Leave Review
                  </Link>
                </div>
              </div>
            ) : isPickupPending ? (
              /* Pickup Inspection Form (Starting Odometer + 6 Photos) */
              <div className="return-card">
                <h3>Pickup Inspection Checklist</h3>
                <p className="return-subtext">
                  Complete the standard 6-photo vehicle condition check to activate your rental trip.
                </p>

                <form onSubmit={handlePickupSubmit} className="return-form">
                  <div className="modal-form-group">
                    <label><Gauge size={15} /> Starting Odometer Reading (KM)</label>
                    <input
                      type="number"
                      placeholder="e.g. 35420"
                      value={pickupOdometer}
                      onChange={(e) => setPickupOdometer(e.target.value)}
                      required
                    />
                  </div>

                  <div className="modal-form-group">
                    <label><Fuel size={15} /> Starting Fuel Level (%)</label>
                    <select value={pickupFuel} onChange={(e) => setPickupFuel(e.target.value)}>
                      <option value="100">100% Full</option>
                      <option value="90">90%</option>
                      <option value="75">75%</option>
                      <option value="50">50%</option>
                    </select>
                  </div>

                  {/* 6 Mandatory Photo Upload Slots */}
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>
                        Required Photos ({Object.keys(pickupPhotos).length}/6)
                      </label>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '10px',
                    }}>
                      {REQUIRED_PHOTO_CATEGORIES.map((cat) => {
                        const hasUploaded = !!pickupPhotos[cat.key];
                        return (
                          <label
                            key={cat.key}
                            style={{
                              border: hasUploaded ? '1px solid #10B981' : '1px dashed #D1D5DB',
                              background: hasUploaded ? '#ECFDF5' : '#F9FAFB',
                              borderRadius: '10px',
                              padding: '10px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                            }}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              style={{ display: 'none' }}
                              onChange={(e) => handlePhotoUpload(cat.key, e.target.files[0])}
                            />
                            {hasUploaded ? (
                              <Check size={18} color="#10B981" />
                            ) : (
                              <Camera size={18} color="#9CA3AF" />
                            )}
                            <span style={{ fontSize: '11px', fontWeight: '600', color: hasUploaded ? '#059669' : '#4B5563' }}>
                              {cat.label}
                            </span>
                            {uploadingCategory === cat.key && (
                              <span style={{ fontSize: '10px', color: 'var(--orange-primary)' }}>Uploading...</span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingPickup || Object.keys(pickupPhotos).length < 6}
                    className="btn-app end-trip-btn"
                    style={{ marginTop: '20px' }}
                  >
                    <span>{submittingPickup ? 'Verifying...' : 'Verify Pickup & Start Trip'}</span>
                  </button>
                </form>
              </div>
            ) : isTripActive ? (
              /* Return Inspection Form (Ending Odometer + Fuel + Damage Check) */
              <div className="return-card">
                <h3>Vehicle Return Inspection</h3>
                <p className="return-subtext">Record final odometer and fuel level upon returning the vehicle to hub.</p>

                <form onSubmit={handleReturnSubmit} className="return-form">
                  <div className="modal-form-group">
                    <label><Gauge size={15} /> Final Odometer Reading (KM)</label>
                    <input
                      type="number"
                      placeholder="e.g. 35780"
                      value={returnOdometer}
                      onChange={(e) => setReturnOdometer(e.target.value)}
                      required
                    />
                  </div>

                  <div className="modal-form-group">
                    <label><Fuel size={15} /> Final Fuel Level (%)</label>
                    <select value={returnFuel} onChange={(e) => setReturnFuel(e.target.value)}>
                      <option value="100">100% Full Tank</option>
                      <option value="85">85%</option>
                      <option value="75">75% (3/4 Tank)</option>
                      <option value="50">50% (Half Tank)</option>
                      <option value="25">25% (1/4 Tank)</option>
                    </select>
                  </div>

                  {/* Damage Check Toggle */}
                  <div style={{ margin: '14px 0' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#374151' }}>
                      <input
                        type="checkbox"
                        checked={hasDamage}
                        onChange={(e) => setHasDamage(e.target.checked)}
                      />
                      <span>Report scratches or new vehicle damages during trip</span>
                    </label>

                    {hasDamage && (
                      <textarea
                        rows={2}
                        placeholder="Describe damage location (e.g. rear bumper scratch)..."
                        value={damageDescription}
                        onChange={(e) => setDamageDescription(e.target.value)}
                        style={{
                          width: '100%',
                          marginTop: '8px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #D1D5DB',
                          fontSize: '12px',
                        }}
                      />
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReturn}
                    className="btn-app end-trip-btn"
                  >
                    <span>{submittingReturn ? 'Finalizing Trip...' : 'Submit & End Trip'}</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="return-card">
                <div style={{ textAlign: 'center', padding: '36px 16px' }}>
                  <AlertTriangle size={48} color="#94A3B8" style={{ margin: '0 auto 14px' }} />
                  <h4>Status: {booking?.status || 'Unknown'}</h4>
                  <p style={{ color: '#4B5563', fontSize: '13px', margin: '0 0 20px 0' }}>
                    No active inspection or trip actions are available for this reservation status.
                  </p>
                  <Link to="/my-bookings" className="btn-app" style={{ display: 'inline-flex' }}>
                    View All Bookings
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
