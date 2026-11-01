import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function MyBookingsPage() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchBookings() {
      try {
        setLoading(true);
        const data = await bookingService.getBookings();
        setBookings(data || []);
      } catch (err) {
        console.warn('Failed to fetch bookings from backend:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="bookings-unauth-container">
        <Car size={48} color="var(--orange-primary)" />
        <h2>Please Sign In to View Your Bookings</h2>
        <p>Log in with your verified mobile number to view upcoming trips, manage reservations, and download invoices.</p>
        <button className="btn-app" onClick={openAuthModal} style={{ marginTop: '20px' }}>
          Sign In / Register
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'all', label: 'All Bookings' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'active', label: 'Active Rentals' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const filteredBookings = bookings.filter((b) => {
    const st = b.status?.toUpperCase();
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return st === 'CONFIRMED' || st === 'UPCOMING' || st === 'PAYMENT_PENDING';
    if (activeTab === 'active') return st === 'ACTIVE' || st === 'ACTIVE_RENTAL';
    if (activeTab === 'completed') return st === 'COMPLETED' || st === 'RETURNED';
    if (activeTab === 'cancelled') return st === 'CANCELLED' || st === 'REJECTED' || st === 'EXPIRED';
    return true;
  });

  return (
    <div className="my-bookings-page">
      <div className="section-inner">
        <div className="bookings-page-header">
          <div>
            <span className="hero-eyebrow" style={{ color: 'var(--orange-primary)' }}>RESERVATIONS</span>
            <h1 className="bookings-title">My Bookings &amp; Rentals</h1>
          </div>
          <Link to="/vehicles" className="btn-app">
            <span>Book Another Ride</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Status Tabs */}
        <div className="booking-tabs-bar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`booking-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state-box">
            <div className="spinner"></div>
            <p>Fetching your reservations from CountryDrive servers...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="empty-bookings-box">
            <Car size={48} color="#94A3B8" />
            <h3>No {activeTab !== 'all' ? activeTab : ''} bookings found</h3>
            <p>You don't have any bookings in this section yet. Ready to hit the open road?</p>
            <Link to="/vehicles" className="btn-app" style={{ display: 'inline-flex', marginTop: '16px' }}>
              Explore Available Vehicles
            </Link>
          </div>
        ) : (
          <div className="bookings-list-stack">
            {filteredBookings.map((b) => {
              const vehicle = b.vehicle || {};
              const vehicleName = vehicle.variant
                ? `${vehicle.make} ${vehicle.model} ${vehicle.variant}`
                : vehicle.make ? `${vehicle.make} ${vehicle.model}` : 'Reserved Vehicle';

              const image = vehicle.media?.[0]?.url || vehicle.coverImageUrl || '/uploads/cards/White Modern SUV Studio Render.png';

              return (
                <div className="booking-card-row" key={b.id}>
                  <div className="booking-card-left">
                    <img
                      src={image}
                      alt={vehicleName}
                      className="booking-card-vehicle-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/uploads/cards/White Modern SUV Studio Render.png';
                      }}
                    />
                    <div className="booking-card-info">
                      <div className="booking-ref-badge-row">
                        <span className="booking-ref-number">#{b.bookingNumber || b.id.slice(0, 8)}</span>
                        <span className={`booking-status-pill status-${(b.status || 'pending').toLowerCase()}`}>
                          {b.status}
                        </span>
                      </div>
                      <h3 className="booking-card-title">{vehicleName}</h3>
                      <div className="booking-schedule-snippet">
                        <span><Calendar size={13} /> {new Date(b.startAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>•</span>
                        <span><Clock size={13} /> {new Date(b.startAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>→</span>
                        <span>{new Date(b.endAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="booking-location-snippet">
                        <MapPin size={13} /> {vehicle.city || 'Mumbai'} Station
                      </div>
                    </div>
                  </div>

                  <div className="booking-card-right">
                    <div className="booking-card-amount">
                      <span className="amount-lbl">Total Amount</span>
                      <strong className="amount-val">₹{Number(b.totalAmount) || 0}</strong>
                      <span className="deposit-val">+ ₹{Number(b.securityDepositAmount) || 3000} deposit</span>
                    </div>

                    <div className="booking-card-actions">
                      <Link to={`/my-bookings/${b.id}`} className="btn-secondary-custom">
                        View Details
                      </Link>
                      {(b.status === 'ACTIVE' || b.status === 'CONFIRMED') && (
                        <Link to={`/active-rental/${b.id}`} className="btn-app btn-active-link">
                          Trip Checklist
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
