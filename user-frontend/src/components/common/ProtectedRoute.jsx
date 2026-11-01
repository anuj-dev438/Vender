import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, ShieldAlert, ArrowRight, Smartphone } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole = 'CUSTOMER' }) {
  const { isAuthenticated, isPendingVerification, user, loading, openAuthModal } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '80px 20px',
      }}>
        <div className="spinner"></div>
        <p style={{ color: '#64748B', fontSize: '15px', fontWeight: 500 }}>
          Verifying account credentials &amp; security session...
        </p>
      </div>
    );
  }

  // Case 1: Completely unauthenticated (no user or token)
  if (!user) {
    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 20px 60px',
      }}>
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '24px',
          padding: '48px 32px',
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.07)',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(255, 122, 0, 0.12)',
            color: '#FF7A00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Lock size={32} />
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Authentication Required
          </h2>
          <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6, marginBottom: '28px' }}>
            You need to be signed in to access this page, manage reservations, verify driving documents, and start trips.
          </p>

          <button
            type="button"
            className="btn-app"
            onClick={() => openAuthModal('login')}
            style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '14px' }}
          >
            <span>Sign In or Register</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Case 2: Logged in but phone is not verified (OTP bypass prevention)
  if (isPendingVerification || !user.isPhoneVerified) {
    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 20px 60px',
      }}>
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #FED7AA',
          borderRadius: '24px',
          padding: '48px 32px',
          maxWidth: '540px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 40px -15px rgba(255, 122, 0, 0.1)',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#FFEDD5',
            color: '#EA580C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <ShieldAlert size={32} />
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Mobile Verification Required
          </h2>
          <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>
            Your account ({user.phone || 'registered phone'}) has not completed OTP verification.
            As per Government Motor Vehicles Act regulations and rental insurance policies, unverified accounts cannot book or access vehicle controls.
          </p>

          <div style={{
            background: '#FFF7ED',
            border: '1px solid #FFEDD5',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left',
          }}>
            <Smartphone size={24} color="#EA580C" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: '#9A3412', fontWeight: 500 }}>
              A 6-digit OTP code will be sent to <strong>{user.phone}</strong> to activate your verified customer status.
            </span>
          </div>

          <button
            type="button"
            className="btn-app"
            onClick={() => openAuthModal('verify-otp')}
            style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '14px' }}
          >
            <span>Verify Mobile with OTP</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Case 3: Fully authenticated and phone-verified
  return children;
}
