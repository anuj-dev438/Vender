import React, { useState, useEffect } from 'react';
import { X, Smartphone, ArrowRight, Lock, User, CheckCircle2, RotateCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import { LOGO_PATH } from '../data/mockData';

export default function AuthModal({ onClose }) {
  const { login, register, refreshUser, authModalMode, isPendingVerification, user } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState(() => {
    if (authModalMode === 'verify-otp' || isPendingVerification) return 'verify-otp';
    return authModalMode || 'login';
  });

  const [phone, setPhone] = useState(() => {
    if (user?.phone) return user.phone.replace('+91', '');
    return '';
  });
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [debugOtp, setDebugOtp] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);

  // Sync mode if authModalMode or isPendingVerification changes
  useEffect(() => {
    if (authModalMode === 'verify-otp' || isPendingVerification) {
      setMode('verify-otp');
      if (user?.phone) {
        setPhone(user.phone.replace('+91', ''));
      }
    } else if (authModalMode) {
      setMode(authModalMode);
    }
  }, [authModalMode, isPendingVerification, user]);

  // Resend countdown timer effect
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const getCleanedPhone = () => {
    const raw = phone.replace(/\D/g, '');
    if (raw.length < 10) return null;
    return raw.startsWith('91') && raw.length > 10
      ? `+${raw}`
      : `+91${raw.slice(-10)}`;
  };

  const handleSendOtp = async (phoneToVerify) => {
    try {
      setSubmitting(true);
      const res = await authService.sendOtp(phoneToVerify);
      if (res?.debugOtp) {
        setDebugOtp(res.debugOtp);
      }
      setResendTimer(60);
      showToast(`Verification OTP sent to ${phoneToVerify}`, 'info');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to dispatch verification OTP');
      showToast(err.message || 'Failed to send OTP', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    const fullPhone = getCleanedPhone();
    if (!fullPhone) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    await handleSendOtp(fullPhone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const fullPhone = getCleanedPhone();
    if (!fullPhone) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setSubmitting(true);

      if (mode === 'login') {
        const loginRes = await login({ phone: fullPhone, password });
        const loggedInUser = loginRes.user || loginRes;

        // Strict verification enforcement: Check if user requires OTP verification
        if (!loggedInUser.isPhoneVerified) {
          showToast('Account phone number is not yet verified. Please enter the OTP to activate your account.', 'warning');
          setMode('verify-otp');
          await handleSendOtp(fullPhone);
          return;
        }

        showToast('Welcome back to Country Drive!', 'success');
        onClose();
      } else if (mode === 'register') {
        // Register customer account in backend
        await register({ phone: fullPhone, password, name, role: 'CUSTOMER' });
        
        // Immediately trigger OTP generation and enforce verification before session activation
        setMode('verify-otp');
        await handleSendOtp(fullPhone);
        showToast('Account created! Please enter the 6-digit OTP sent to your phone to activate.', 'info');
      } else if (mode === 'verify-otp') {
        // Verify phone number using 6-digit OTP
        if (!otp || otp.length !== 6) {
          setErrorMessage('Please enter the complete 6-digit verification code');
          return;
        }

        const verifyRes = await authService.verifyOtp(fullPhone, otp);
        await refreshUser();
        showToast(verifyRes.message || 'Mobile number verified successfully! Welcome aboard.', 'success');
        onClose();
      } else if (mode === 'forgot') {
        if (!resendTimer) {
          const res = await authService.forgotPassword(fullPhone);
          if (res?.debugOtp) setDebugOtp(res.debugOtp);
          setResendTimer(60);
          showToast(`6-digit Password Reset OTP sent to ${fullPhone}`, 'info');
        } else {
          if (!otp || otp.length !== 6) {
            setErrorMessage('Please enter the complete 6-digit OTP code');
            return;
          }
          await authService.resetPassword({
            phone: fullPhone,
            otp,
            newPassword: password,
          });
          showToast('Password reset successfully! You can now log in.', 'success');
          setMode('login');
          setResendTimer(0);
          setPassword('');
          setOtp('');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container auth-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
          <X size={20} />
        </button>

        <div className="auth-brand-head">
          <img src={LOGO_PATH} alt="Country Drive" className="auth-logo-img" />
          <h2 className="auth-title">
            {mode === 'login'
              ? 'Sign in to Country Drive'
              : mode === 'register'
              ? 'Create Your Account'
              : mode === 'verify-otp'
              ? 'Verify Your Mobile Number'
              : 'Reset Your Password'}
          </h2>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Access your active rentals, reservations & digital vehicle keys'
              : mode === 'register'
              ? 'Join thousands of riders enjoying self-drive freedom'
              : mode === 'verify-otp'
              ? 'Enter the 6-digit OTP sent to your phone for account verification'
              : 'Enter your phone number to receive a one-time reset code'}
          </p>
        </div>

        {errorMessage && (
          <div className="auth-error-banner">
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {debugOtp && (
          <div style={{
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            color: '#1D4ED8',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '12px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span><strong>Development Mode OTP:</strong> {debugOtp}</span>
            <button
              type="button"
              onClick={() => setOtp(debugOtp)}
              style={{
                background: '#DBEAFE',
                border: 'none',
                color: '#1E40AF',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              Auto-Fill
            </button>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="auth-input-group">
              <label>
                <User size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Full Legal Name
              </label>
              <div className="phone-input-wrap">
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {mode !== 'verify-otp' && (
            <div className="auth-input-group">
              <label>
                <Smartphone size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Mobile Number
              </label>
              <div className="phone-input-wrap">
                <span className="country-code">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
            </div>
          )}

          {mode === 'verify-otp' && (
            <>
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748B', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Verifying Phone
                  </span>
                  <strong style={{ fontSize: '15px', color: '#0F172A' }}>
                    {getCleanedPhone() || phone || 'Your Mobile Number'}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMessage(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FF7A00',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Change
                </button>
              </div>

              <div className="auth-input-group">
                <label>
                  <CheckCircle2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  6-Digit OTP Verification Code
                </label>
                <div className="phone-input-wrap">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    style={{ letterSpacing: '0.25em', fontSize: '18px', fontWeight: '700' }}
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  Didn't receive the SMS code?
                </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || submitting}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: resendTimer > 0 ? '#94A3B8' : '#FF7A00',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: resendTimer > 0 ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <RotateCw size={12} className={resendTimer > 0 ? '' : 'spin-on-hover'} />
                  <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}</span>
                </button>
              </div>
            </>
          )}

          {mode === 'forgot' && resendTimer > 0 && (
            <div className="auth-input-group">
              <label>
                <CheckCircle2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                6-Digit Verification OTP
              </label>
              <div className="phone-input-wrap">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
            </div>
          )}

          {((mode === 'login' || mode === 'register') || (mode === 'forgot' && resendTimer > 0)) && (
            <div className="auth-input-group">
              <label>
                <Lock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                {mode === 'forgot' ? 'New Password (min 8 characters)' : 'Password (min 8 characters)'}
              </label>
              <div className="phone-input-wrap">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="auth-btn" disabled={submitting}>
            <span>
              {submitting
                ? 'Processing...'
                : mode === 'login'
                ? 'Sign In'
                : mode === 'register'
                ? 'Create Account & Send OTP'
                : mode === 'verify-otp'
                ? 'Verify & Complete Activation'
                : mode === 'forgot' && !resendTimer
                ? 'Send Reset OTP'
                : 'Reset Password & Continue'}
            </span>
            <ArrowRight size={18} />
          </button>

          {mode === 'login' && (
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <button
                type="button"
                className="auth-switch-link"
                style={{ fontSize: '12px', color: '#6B7280' }}
                onClick={() => { setMode('forgot'); setErrorMessage(''); }}
              >
                Forgot your password?
              </button>

              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px dashed #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                  Quick Test Login (Pre-Verified KYC Customers)
                </span>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setPhone('9870123456');
                      setPassword('UserPassword123');
                      setErrorMessage('');
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      background: '#F8FAFC',
                      fontSize: '12px',
                      color: '#0F172A',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Rohit (+919870123456)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPhone('9870654321');
                      setPassword('UserPassword123');
                      setErrorMessage('');
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      background: '#F8FAFC',
                      fontSize: '12px',
                      color: '#0F172A',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Neha (+919870654321)
                  </button>
                </div>
              </div>
            </div>
          )}


          <div className="auth-switch-mode">
            {mode === 'login' ? (
              <span>
                Don't have an account yet?{' '}
                <button type="button" className="auth-switch-link" onClick={() => { setMode('register'); setErrorMessage(''); }}>
                  Register here
                </button>
              </span>
            ) : mode === 'register' ? (
              <span>
                Already have an account?{' '}
                <button type="button" className="auth-switch-link" onClick={() => { setMode('login'); setErrorMessage(''); }}>
                  Sign in
                </button>
              </span>
            ) : mode === 'verify-otp' ? (
              <span>
                Want to sign in with password?{' '}
                <button type="button" className="auth-switch-link" onClick={() => { setMode('login'); setErrorMessage(''); }}>
                  Back to Sign In
                </button>
              </span>
            ) : (
              <span>
                Remembered your password?{' '}
                <button type="button" className="auth-switch-link" onClick={() => { setMode('login'); setErrorMessage(''); }}>
                  Back to Sign In
                </button>
              </span>
            )}
          </div>

          <p className="auth-terms">
            By signing in or registering, you agree to Country Drive's Terms of Service, Privacy Policy &amp; Motor Vehicles Act Self-Drive Regulations.
          </p>
        </form>
      </div>
    </div>
  );
}
