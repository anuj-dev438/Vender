import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { Heart, Trash2, ArrowRight, Car, Sparkles, Star, Users, Fuel, Settings } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <div className="wishlist-page-container" style={{ minHeight: '80vh', padding: '120px 20px 60px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fee2e2', color: '#dc2626', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
            <Heart size={16} fill="#dc2626" />
            <span>Saved Collection</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
            My Shortlisted Fleet
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
            Quickly compare and book vehicles you have saved for your upcoming journeys.
          </p>
        </div>

        {wishlist.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
              {wishlist.length} {wishlist.length === 1 ? 'vehicle' : 'vehicles'} saved
            </span>
            <button
              type="button"
              onClick={clearWishlist}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#64748b',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Trash2 size={14} />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid or Empty State */}
      {wishlist.length === 0 ? (
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '24px',
          padding: '60px 24px',
          textAlign: 'center',
          maxWidth: '540px',
          margin: '40px auto',
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: '#fee2e2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Heart size={36} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
            Your Wishlist is Empty
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '24px' }}>
            Browse our diverse fleet of sanitized cars, SUVs, and bikes. Tap the heart icon on any vehicle card to save it here for later booking.
          </p>
          <Link
            to="/vehicles"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#FF7A00',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '12px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(255, 122, 0, 0.35)',
            }}
          >
            <span>Browse All Vehicles</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {wishlist.map((v) => (
            <div
              key={v.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              }}
            >
              {/* Card Image Banner */}
              <div style={{ position: 'relative', height: '180px', background: '#f8fafc' }}>
                <img
                  src={v.image || '/uploads/cards/White Modern SUV Studio Render.png'}
                  alt={v.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/uploads/cards/White Modern SUV Studio Render.png';
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeFromWishlist(v.id)}
                  title="Remove from saved"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#ffffff',
                    border: '1px solid #fee2e2',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#dc2626',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                >
                  <Trash2 size={16} />
                </button>
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(15,23,42,0.75)', color: '#ffffff', padding: '2px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {v.type || 'CAR'}
                </div>
              </div>

              {/* Card Details */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {v.name}
                  </h3>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FF7A00' }}>
                    ₹{v.price}<span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>/{v.priceUnit || 'hr'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: '#64748b', marginBottom: '16px', flexWrap: 'wrap' }}>
                  {v.seats && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={13} /> {v.seats} Seats
                    </span>
                  )}
                  {v.transmission && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Settings size={13} /> {v.transmission}
                    </span>
                  )}
                  {v.fuel && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Fuel size={13} /> {v.fuel}
                    </span>
                  )}
                  {v.rating && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#d97706', fontWeight: 600 }}>
                      <Star size={13} fill="#d97706" /> {v.rating}
                    </span>
                  )}
                </div>

                <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <Link
                    to={`/vehicles/${v.id}`}
                    style={{
                      textAlign: 'center',
                      background: '#f1f5f9',
                      color: '#0f172a',
                      padding: '10px 0',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Details
                  </Link>
                  <Link
                    to={`/booking/${v.id}`}
                    style={{
                      background: '#FF7A00',
                      color: '#ffffff',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '8px 14px',
                    }}
                  >
                    <span>Book Now</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
