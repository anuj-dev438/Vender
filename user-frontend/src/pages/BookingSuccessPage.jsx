import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, KeyRound, FileCheck, ArrowRight, Car, Clock, CreditCard } from 'lucide-react';

export default function BookingSuccessPage() {
  const { id } = useParams();
  const location = useLocation();
  const { booking, vehicle, quote, city, paymentVerified } = location.state || {};

  const isConfirmed = paymentVerified === true || booking?.status === 'CONFIRMED';
  const bookingRef = booking?.bookingNumber || id || `BK-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="booking-success-page">
      <div className="section-inner success-card-container">
        <div className="success-badge-icon" style={{
          background: isConfirmed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
          color: isConfirmed ? '#10B981' : '#F59E0B',
          width: '88px',
          height: '88px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          {isConfirmed ? (
            <CheckCircle size={56} color="#10B981" />
          ) : (
            <Clock size={56} color="#F59E0B" />
          )}
        </div>

        <h1 className="success-title">
          {isConfirmed ? 'Your Ride is Confirmed!' : 'Booking Created — Payment Pending'}
        </h1>
        <p className="success-subtitle">
          Reservation reference: <strong>#{bookingRef}</strong> &bull; Status: <span style={{
            color: isConfirmed ? '#10B981' : '#F59E0B',
            fontWeight: 700,
          }}>{isConfirmed ? 'CONFIRMED' : 'PAYMENT_PENDING'}</span>
        </p>

        {!isConfirmed && (
          <div style={{
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            color: '#B45309',
            borderRadius: '12px',
            padding: '14px 18px',
            maxWidth: '600px',
            margin: '0 auto 24px',
            fontSize: '13px',
            lineHeight: 1.6,
            textAlign: 'left',
          }}>
            <strong>Important:</strong> Your vehicle slot has been provisionally reserved. Please complete payment before pickup to activate digital keys and confirm your trip. Abandoned reservations expire automatically after 30 minutes.
          </div>
        )}

        <div className="success-details-card">
          {vehicle && (
            <div className="success-vehicle-row">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="success-vehicle-thumb"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/uploads/cards/White Modern SUV Studio Render.png';
                }}
              />
              <div className="success-vehicle-meta">
                <h3>{vehicle.name}</h3>
                <span>{vehicle.category?.toUpperCase() || 'CAR'} &bull; {vehicle.fuel || 'Petrol'} &bull; {vehicle.transmission || 'Automatic'}</span>
                <span className="success-city"><MapPin size={13} /> {city || 'Mumbai'} CountryDrive Hub</span>
              </div>
            </div>
          )}

          <div className="success-instructions-grid">
            <div className="instruction-box">
              <div className="instr-icon-wrap">
                <KeyRound size={20} color="var(--orange-primary)" />
              </div>
              <h4>Keyless Bluetooth Entry</h4>
              <p>
                {isConfirmed
                  ? 'Your digital vehicle key will automatically activate 15 minutes before your scheduled pickup.'
                  : 'Digital keys are activated once payment is verified.'}
              </p>
            </div>

            <div className="instruction-box">
              <div className="instr-icon-wrap">
                <FileCheck size={20} color="var(--orange-primary)" />
              </div>
              <h4>Mandatory Pickup Checklist</h4>
              <p>Upload 6 vehicle inspection photos (4 exterior, 2 interior) upon reaching the pickup hub.</p>
            </div>
          </div>
        </div>

        <div className="success-actions-row">
          {!isConfirmed ? (
            <Link to={`/my-bookings/${id || booking?.id}`} className="btn-app btn-success-action" style={{ background: '#F59E0B' }}>
              <CreditCard size={16} />
              <span>Complete Payment Now</span>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <Link to="/my-bookings" className="btn-app btn-success-action">
              <span>View in My Bookings</span>
              <ArrowRight size={16} />
            </Link>
          )}

          <Link to="/vehicles" className="btn-secondary-custom">
            <span>Explore More Vehicles</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
