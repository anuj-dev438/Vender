import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Fuel, Settings, ArrowRight, Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export default function VehicleCard({ vehicle, onBookNow }) {
  const imageUrl = vehicle.image || '/uploads/cards/White Modern SUV Studio Render.png';
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorite = isInWishlist(vehicle.id);

  return (
    <article className="vehicle-card-v2">
      <div className="vehicle-card-badge-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span className="vehicle-fuel-badge">{vehicle.fuel}</span>
          {vehicle.distanceKm && (
            <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
              📍 {vehicle.distanceKm} km
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="vehicle-rating-pill">
            <Star size={13} fill="#FFB800" color="#FFB800" />
            <span>{vehicle.rating || 4.8}</span>
            <span className="reviews-count">({vehicle.reviews || 120})</span>
          </div>
          <button
            type="button"
            className="wishlist-toggle-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(vehicle);
            }}
            title={isFavorite ? 'Remove from Saved' : 'Save to Wishlist'}
            aria-label="Wishlist"
            style={{
              background: isFavorite ? '#fee2e2' : '#ffffff',
              border: isFavorite ? '1px solid #fca5a5' : '1px solid #e2e8f0',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              transition: 'all 0.2s ease',
            }}
          >
            <Heart size={16} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : '#64748b'} />
          </button>
        </div>
      </div>

      <Link to={`/vehicles/${vehicle.id}`} className="vehicle-card-image-box">
        <img
          src={imageUrl}
          alt={vehicle.name}
          className="vehicle-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/uploads/cards/White Modern SUV Studio Render.png';
          }}
        />
      </Link>

      <div className="vehicle-card-content">
        <div className="vehicle-card-type-row">
          <span className="vehicle-type-label">{vehicle.type || vehicle.category}</span>
          <div className="vehicle-price-tag">
            <span className="price-symbol">₹</span>
            <span className="price-amount">{vehicle.price}</span>
            <span className="price-unit">/{vehicle.priceUnit || 'hour'}</span>
          </div>
        </div>

        <h3 className="vehicle-card-title">
          <Link to={`/vehicles/${vehicle.id}`} className="hover-orange">
            {vehicle.name}
          </Link>
        </h3>

        <div className="vehicle-specs-row">
          <div className="vehicle-spec-chip" title="Seating Capacity">
            <Users size={14} />
            <span>{vehicle.seats} Seats</span>
          </div>
          <div className="vehicle-spec-chip" title="Transmission">
            <Settings size={14} />
            <span>{vehicle.transmission}</span>
          </div>
          <div className="vehicle-spec-chip" title="Fuel Type">
            <Fuel size={14} />
            <span>{vehicle.fuel}</span>
          </div>
        </div>

        <div className="vehicle-card-actions-row">
          <Link to={`/vehicles/${vehicle.id}`} className="vehicle-view-details-btn">
            View Details
          </Link>
          <Link
            to={`/booking/${vehicle.id}`}
            className="vehicle-book-btn"
            onClick={(e) => {
              if (onBookNow) {
                e.preventDefault();
                onBookNow(vehicle);
              }
            }}
          >
            <span>Book Now</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
