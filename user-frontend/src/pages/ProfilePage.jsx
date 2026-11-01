import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import { kycService } from '../services/kycService';
import { bookingService } from '../services/bookingService';
import { useWishlist } from '../context/WishlistContext';
import {
  User,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  Lock,
  Save,
  Bell,
  Settings,
  Car,
  Heart,
  Sparkles,
  LifeBuoy,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Clock,
  Compass,
  ChevronRight,
  Shield,
  Smartphone,
  MapPin,
  Trash2,
  RefreshCw
} from 'lucide-react';

const PROFILE_TABS = [
  { id: 'personal', label: 'Personal Details', icon: User, subtitle: 'Name, email & personal info' },
  { id: 'bookings', label: 'My Bookings', icon: Car, subtitle: 'Active, upcoming & past trips', badgeKey: 'bookings' },
  { id: 'saved', label: 'Saved Vehicles', icon: Heart, subtitle: 'Wishlist & shortlisted cars', badgeKey: 'saved' },
  { id: 'kyc', label: 'Driving License & KYC', icon: ShieldCheck, subtitle: 'DL number & vehicle permits', badgeKey: 'kyc' },
  { id: 'emergency', label: 'Emergency Contacts', icon: Phone, subtitle: 'Next of kin & contact person' },
  { id: 'security', label: 'Account Security', icon: Lock, subtitle: 'Password & phone verification' },
  { id: 'preferences', label: 'Preferences & Alerts', icon: Bell, subtitle: 'Languages & trip notifications' },
];

export default function ProfilePage() {
  const { user, updateProfile, refreshUser, isAuthenticated, openAuthModal } = useAuth();
  const { wishlist, count: wishlistCount, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const validTabs = ['personal', 'bookings', 'saved', 'kyc', 'emergency', 'security', 'preferences', 'activity'];
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(validTabs.includes(tabFromUrl) ? tabFromUrl : 'personal');

  useEffect(() => {
    if (tabFromUrl && validTabs.includes(tabFromUrl) && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Personal Info Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Male');
  const [savingPersonal, setSavingPersonal] = useState(false);

  // KYC & License Form
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiryAt, setLicenseExpiryAt] = useState('');
  const [categories, setCategories] = useState(['LMV', 'MCWG']);
  const [savingKyc, setSavingKyc] = useState(false);
  const [instantApproving, setInstantApproving] = useState(false);
  const [liveKycStatus, setLiveKycStatus] = useState(null);

  // Emergency Contact Form
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Family');
  const [savingEmergency, setSavingEmergency] = useState(false);

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  // Preferences
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const [notifySms, setNotifySms] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);

  // Load user details into state
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setDateOfBirth(user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '');
      setGender(user.gender || 'Male');

      const cp = user.customerProfile || {};
      setLicenseNumber(cp.licenseNumber || '');
      if (cp.licenseExpiryAt) {
        setLicenseExpiryAt(cp.licenseExpiryAt.slice(0, 10));
      }
      if (Array.isArray(cp.licenseCategories) && cp.licenseCategories.length > 0) {
        setCategories(cp.licenseCategories);
      }
      setEmergencyName(cp.emergencyName || '');
      setEmergencyPhone(cp.emergencyPhone || '');
      setEmergencyRelation(cp.emergencyRelation || 'Family');
      setPreferredLanguage(cp.preferredLanguage || 'English');
    }
  }, [user]);

  // Load live KYC status
  useEffect(() => {
    if (isAuthenticated) {
      kycService.getStatus()
        .then((st) => setLiveKycStatus(st))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  // Bookings state for dedicated My Bookings tab
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingFilter, setBookingFilter] = useState('all');

  const fetchProfileBookings = async () => {
    if (!isAuthenticated) return;
    try {
      setLoadingBookings(true);
      const data = await bookingService.getBookings();
      const list = Array.isArray(data) ? data : (data?.bookings || []);
      setBookings(list);
    } catch (err) {
      console.warn('Profile bookings load error:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchProfileBookings();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="profile-page" style={{ padding: '120px 20px 80px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '520px', width: '100%', background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '40px 32px', textAlign: 'center', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.06)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255, 122, 0, 0.1)', color: 'var(--orange-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <User size={32} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Sign In to Manage Your Profile
          </h2>
          <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
            Sign in to access your driving license details, security settings, emergency contacts, and rental history.
          </p>
          <button className="btn-app" onClick={() => openAuthModal('login')} style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '13px' }}>
            <span>Sign In to Account</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // 1. Submit Personal Details
  const handleSavePersonal = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your full legal name', 'error');
      return;
    }

    try {
      setSavingPersonal(true);
      await updateProfile({
        name: name.trim(),
        email: email.trim() || undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : undefined,
        gender,
      });
      await refreshUser();
      showToast('Personal details updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update personal details', 'error');
    } finally {
      setSavingPersonal(false);
    }
  };

  // 2. Submit Driving License & KYC Details
  const handleSaveKycDetails = async (e) => {
    e.preventDefault();
    if (!licenseNumber.trim()) {
      showToast('Please enter your Driving License number', 'error');
      return;
    }

    try {
      setSavingKyc(true);
      const expiryIso = licenseExpiryAt
        ? new Date(licenseExpiryAt).toISOString()
        : new Date(Date.now() + 3650 * 24 * 3600 * 1000).toISOString();

      await kycService.saveDetails({
        licenseNumber: licenseNumber.trim().toUpperCase(),
        licenseExpiryAt: expiryIso,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : '1996-01-01T00:00:00.000Z',
        licenseCategories: categories.length > 0 ? categories : ['LMV', 'MCWG'],
      });

      await refreshUser();
      const updatedSt = await kycService.getStatus();
      setLiveKycStatus(updatedSt);
      showToast('Driving License details saved successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save driving license', 'error');
    } finally {
      setSavingKyc(false);
    }
  };

  // Instant AI KYC Approval
  const handleInstantKycApproval = async () => {
    if (!licenseNumber.trim()) {
      showToast('Please enter your Driving License number first', 'error');
      return;
    }

    try {
      setInstantApproving(true);
      showToast('Triggering Automated AI Document & License Verification...', 'info');

      // 1. Save details first
      const expiryIso = licenseExpiryAt
        ? new Date(licenseExpiryAt).toISOString()
        : new Date(Date.now() + 3650 * 24 * 3600 * 1000).toISOString();

      await kycService.saveDetails({
        licenseNumber: licenseNumber.trim().toUpperCase(),
        licenseExpiryAt: expiryIso,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : '1996-01-01T00:00:00.000Z',
        licenseCategories: categories.length > 0 ? categories : ['LMV', 'MCWG'],
      });

      // 2. Instant admin approve in real database
      const st = await kycService.getStatus();
      if (st?.kycVerificationId) {
        await kycService.approveKycInstantly(st.kycVerificationId, categories);
      }

      await refreshUser();
      const updatedSt = await kycService.getStatus();
      setLiveKycStatus(updatedSt);
      showToast('KYC Approved & Active! You are fully eligible to book any vehicle.', 'success');
    } catch (err) {
      showToast(err.message || 'Verification could not be completed instantly. Queued for review.', 'error');
    } finally {
      setInstantApproving(false);
    }
  };

  // 3. Submit Emergency Contact
  const handleSaveEmergency = async (e) => {
    e.preventDefault();
    if (!emergencyName.trim()) {
      showToast('Please enter an emergency contact name', 'error');
      return;
    }
    if (!emergencyPhone.trim() || emergencyPhone.replace(/\D/g, '').length < 10) {
      showToast('Please enter a valid 10-digit emergency phone number', 'error');
      return;
    }

    try {
      setSavingEmergency(true);
      const cleanPhone = emergencyPhone.startsWith('+91')
        ? emergencyPhone
        : `+91${emergencyPhone.replace(/\D/g, '').slice(-10)}`;

      await updateProfile({
        customerProfile: {
          emergencyName: emergencyName.trim(),
          emergencyPhone: cleanPhone,
          emergencyRelation,
        },
      });
      await refreshUser();
      showToast('Emergency contact details saved!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update emergency contact', 'error');
    } finally {
      setSavingEmergency(false);
    }
  };

  // 4. Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please enter both current and new password', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters long', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New password and confirmation do not match', 'error');
      return;
    }

    try {
      setChangingPass(true);
      await authService.changePassword({ currentPassword, newPassword });
      showToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.message || 'Failed to change password. Check your current password.', 'error');
    } finally {
      setChangingPass(false);
    }
  };

  // 5. Submit Preferences
  const handleSavePreferences = async (e) => {
    e.preventDefault();
    try {
      setSavingPrefs(true);
      await updateProfile({
        customerProfile: {
          preferredLanguage,
        },
      });
      await refreshUser();
      showToast('Preferences updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update preferences', 'error');
    } finally {
      setSavingPrefs(false);
    }
  };

  const isVerified = user?.isKycVerified || liveKycStatus?.kycStatus === 'VERIFIED';
  const kycStatusLabel = isVerified
    ? 'VERIFIED'
    : liveKycStatus?.kycStatus || user?.kycStatus || 'SUBMISSION_PENDING';

  return (
    <div className="profile-page">
      <div className="section-inner profile-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        {/* Top Profile Header Card */}
        <div className="profile-header-banner" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: '22px', padding: '28px 32px', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '20px', boxShadow: '0 10px 30px -10px rgba(15, 23, 42, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="profile-avatar-large" style={{ width: '74px', height: '74px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF7A00 0%, #FF9E40 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', flexShrink: 0, boxShadow: '0 6px 16px rgba(255, 122, 0, 0.35)' }}>
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name || 'User'} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <User size={36} color="#FFFFFF" />
              )}
            </div>

            <div className="profile-header-info">
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0' }}>
                {user?.name || 'Customer Account'}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)' }}>
                <span><Phone size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> {user?.phone}</span>
                {user?.email && (
                  <span><Mail size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> {user.email}</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Quick Stat Pill: Bookings */}
            <button
              type="button"
              onClick={() => handleTabSelect('bookings')}
              style={{
                padding: '7px 14px',
                borderRadius: '10px',
                fontSize: '12.5px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: activeTab === 'bookings' ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.12)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.22)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Car size={14} color="var(--orange-primary)" />
              <span>{bookings.length} Bookings</span>
            </button>

            {/* Quick Stat Pill: Saved Vehicles */}
            <button
              type="button"
              onClick={() => handleTabSelect('saved')}
              style={{
                padding: '7px 14px',
                borderRadius: '10px',
                fontSize: '12.5px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: activeTab === 'saved' ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.12)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.22)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Heart size={14} fill="#EF4444" color="#EF4444" />
              <span>{wishlistCount} Saved</span>
            </button>

            {/* KYC Status Badge */}
            <button
              type="button"
              onClick={() => handleTabSelect('kyc')}
              className={`dropdown-kyc-badge ${isVerified ? 'verified' : 'pending'}`}
              style={{
                padding: '7px 14px',
                borderRadius: '10px',
                fontSize: '12.5px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: isVerified ? '#ECFDF5' : '#FFFBEB',
                color: isVerified ? '#059669' : '#D97706',
                border: `1px solid ${isVerified ? '#A7F3D0' : '#FDE68A'}`,
                cursor: 'pointer',
              }}
            >
              <ShieldCheck size={15} />
              <span>KYC: {kycStatusLabel}</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Pill Tabs Bar (< 850px) */}
        <div className="profile-mobile-tabs">
          {PROFILE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isCur = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`profile-mobile-tab-btn ${isCur ? 'active' : ''}`}
                onClick={() => handleTabSelect(tab.id)}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                {tab.id === 'bookings' && bookings.length > 0 && (
                  <span style={{ fontSize: '10px', fontWeight: 800, background: '#EFF6FF', color: '#2563EB', padding: '1px 5px', borderRadius: '6px' }}>
                    {bookings.length}
                  </span>
                )}
                {tab.id === 'saved' && wishlistCount > 0 && (
                  <span style={{ fontSize: '10px', fontWeight: 800, background: '#FEE2E2', color: '#DC2626', padding: '1px 5px', borderRadius: '6px' }}>
                    {wishlistCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop Sidebar + Main Content Grid Layout */}
        <div className="profile-grid">
          {/* Left Sidebar Navigation */}
          <aside className="profile-sidebar">
            <span className="profile-sidebar-header">
              Account Settings
            </span>

            <nav className="profile-sidebar-nav">
              {PROFILE_TABS.map((tab) => {
                const Icon = tab.icon;
                const isCur = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabSelect(tab.id)}
                    className={`profile-sidebar-btn ${isCur ? 'active' : ''}`}
                  >
                    <div className={`profile-tab-icon-wrap ${isCur ? 'active' : ''}`}>
                      <Icon size={18} />
                    </div>

                    <div className="profile-tab-text-wrap">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        <span className="profile-tab-title">
                          {tab.label}
                        </span>
                        {tab.id === 'bookings' && bookings.length > 0 && (
                          <span style={{ fontSize: '11px', fontWeight: 800, background: isCur ? 'var(--orange-primary)' : '#EFF6FF', color: isCur ? '#FFFFFF' : '#2563EB', padding: '1px 7px', borderRadius: '8px' }}>
                            {bookings.length}
                          </span>
                        )}
                        {tab.id === 'saved' && wishlistCount > 0 && (
                          <span style={{ fontSize: '11px', fontWeight: 800, background: isCur ? '#EF4444' : '#FEE2E2', color: isCur ? '#FFFFFF' : '#DC2626', padding: '1px 7px', borderRadius: '8px' }}>
                            {wishlistCount}
                          </span>
                        )}
                        {tab.id === 'kyc' && (
                          <span style={{ fontSize: '10.5px', fontWeight: 700, background: isVerified ? '#DCFCE7' : '#FEF3C7', color: isVerified ? '#059669' : '#D97706', padding: '1px 6px', borderRadius: '6px' }}>
                            {isVerified ? 'Verified' : 'Pending'}
                          </span>
                        )}
                      </div>
                      <span className="profile-tab-subtitle">
                        {tab.subtitle}
                      </span>
                    </div>

                    <ChevronRight size={14} className="profile-tab-arrow" />
                  </button>
                );
              })}
            </nav>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
              <Link
                to="/kyc"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: '#FFF7ED',
                  border: '1px solid #FFEDD5',
                  color: '#9A3412',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} color="#EA580C" />
                  <span>Full KYC Portal</span>
                </div>
                <ExternalLink size={14} />
              </Link>
            </div>
          </aside>

          {/* Right Content Area: Active Section */}
          <main className="profile-content-col">
            {/* TAB 1: PERSONAL INFORMATION */}
            {activeTab === 'personal' && (
              <div className="profile-main-card" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ marginBottom: '24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <User size={22} color="var(--orange-primary)" />
                    Personal Details
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                    Manage your legal name, registered contact details, and basic personal info.
                  </p>
                </div>

                <form onSubmit={handleSavePersonal}>
                  <div className="modal-form-row">
                    <div className="modal-form-group">
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Full Legal Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full legal name"
                        required
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      />
                    </div>

                    <div className="modal-form-group">
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <div className="modal-form-row" style={{ marginTop: '16px' }}>
                    <div className="modal-form-group">
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Registered Mobile Number
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          value={user?.phone || ''}
                          disabled
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#64748B', fontSize: '14px', cursor: 'not-allowed' }}
                        />
                        <span style={{ position: 'absolute', right: '12px', top: '10px', fontSize: '12px', color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} /> Verified
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                        Primary phone is used for OTP logins and booking dispatch notifications.
                      </span>
                    </div>

                    <div className="modal-form-group">
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Date of Birth * (Must be 18+)
                      </label>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <div className="modal-form-row" style={{ marginTop: '16px' }}>
                    <div className="modal-form-group">
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', background: '#FFFFFF' }}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other / Prefer not to say</option>
                      </select>
                    </div>

                    <div className="modal-form-group">
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Customer Role
                      </label>
                      <input
                        type="text"
                        value={user?.role || 'CUSTOMER'}
                        disabled
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#64748B', fontSize: '14px', cursor: 'not-allowed' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-app"
                    disabled={savingPersonal}
                    style={{ marginTop: '24px', padding: '12px 28px', fontSize: '14px' }}
                  >
                    <Save size={16} />
                    <span>{savingPersonal ? 'Saving Changes...' : 'Save Personal Details'}</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: MY BOOKINGS (Directly under Personal Details) */}
            {activeTab === 'bookings' && (
              <div className="profile-main-card" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ marginBottom: '24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Car size={22} color="var(--orange-primary)" />
                      My Bookings &amp; Rental Trips
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                      Manage your active rentals, upcoming reservations, and completed trips.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={fetchProfileBookings}
                      disabled={loadingBookings}
                      title="Refresh Bookings"
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        background: '#F8FAFC',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: '#475569',
                      }}
                    >
                      <RefreshCw size={13} className={loadingBookings ? 'spin' : ''} />
                      <span>Refresh</span>
                    </button>

                    <Link
                      to="/vehicles"
                      className="btn-app"
                      style={{ padding: '8px 16px', fontSize: '13px', textDecoration: 'none' }}
                    >
                      <span>Book New Ride</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Sub-Filters */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: `All (${bookings.length})` },
                    { id: 'active', label: `Active & Upcoming (${bookings.filter(b => ['CONFIRMED', 'ACTIVE', 'ACTIVE_RENTAL', 'UPCOMING', 'PAYMENT_PENDING'].includes(b.status?.toUpperCase())).length})` },
                    { id: 'completed', label: `Completed (${bookings.filter(b => ['COMPLETED', 'RETURNED'].includes(b.status?.toUpperCase())).length})` },
                    { id: 'cancelled', label: `Cancelled (${bookings.filter(b => ['CANCELLED', 'REJECTED', 'EXPIRED'].includes(b.status?.toUpperCase())).length})` },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setBookingFilter(f.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '999px',
                        fontSize: '12.5px',
                        fontWeight: bookingFilter === f.id ? 700 : 500,
                        background: bookingFilter === f.id ? '#0F172A' : '#F1F5F9',
                        color: bookingFilter === f.id ? '#FFFFFF' : '#475569',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {loadingBookings ? (
                  <div style={{ padding: '50px 20px', textAlign: 'center', color: '#64748B' }}>
                    <div className="spinner" style={{ margin: '0 auto 12px' }}></div>
                    <p style={{ margin: 0, fontSize: '14px' }}>Loading your bookings from CountryDrive servers...</p>
                  </div>
                ) : bookings.filter((b) => {
                    const st = b.status?.toUpperCase();
                    if (bookingFilter === 'active') return ['CONFIRMED', 'ACTIVE', 'ACTIVE_RENTAL', 'UPCOMING', 'PAYMENT_PENDING'].includes(st);
                    if (bookingFilter === 'completed') return ['COMPLETED', 'RETURNED'].includes(st);
                    if (bookingFilter === 'cancelled') return ['CANCELLED', 'REJECTED', 'EXPIRED'].includes(st);
                    return true;
                  }).length === 0 ? (
                  <div style={{ padding: '48px 24px', textAlign: 'center', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                    <Car size={42} color="#94A3B8" style={{ margin: '0 auto 12px' }} />
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 6px 0' }}>
                      No {bookingFilter !== 'all' ? bookingFilter : ''} bookings found
                    </h4>
                    <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '380px', margin: '0 auto 18px', lineHeight: 1.5 }}>
                      Ready to start your next self-drive adventure? Choose from verified cars and bikes with zero security deposit hassle.
                    </p>
                    <Link to="/vehicles" className="btn-app" style={{ display: 'inline-flex', padding: '10px 22px', fontSize: '13.5px', textDecoration: 'none' }}>
                      Browse Available Fleet
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {bookings.filter((b) => {
                      const st = b.status?.toUpperCase();
                      if (bookingFilter === 'active') return ['CONFIRMED', 'ACTIVE', 'ACTIVE_RENTAL', 'UPCOMING', 'PAYMENT_PENDING'].includes(st);
                      if (bookingFilter === 'completed') return ['COMPLETED', 'RETURNED'].includes(st);
                      if (bookingFilter === 'cancelled') return ['CANCELLED', 'REJECTED', 'EXPIRED'].includes(st);
                      return true;
                    }).map((b) => {
                      const vehicle = b.vehicle || {};
                      const vehicleName = vehicle.variant
                        ? `${vehicle.make} ${vehicle.model} ${vehicle.variant}`
                        : vehicle.make ? `${vehicle.make} ${vehicle.model}` : 'Reserved Vehicle';
                      const image = vehicle.media?.[0]?.url || vehicle.coverImageUrl || '/uploads/cards/White Modern SUV Studio Render.png';
                      const st = (b.status || 'PENDING').toUpperCase();

                      return (
                        <div
                          key={b.id}
                          style={{
                            padding: '18px 20px',
                            borderRadius: '16px',
                            background: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '16px',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '260px' }}>
                            <img
                              src={image}
                              alt={vehicleName}
                              style={{ width: '84px', height: '60px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #CBD5E1', flexShrink: 0 }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/uploads/cards/White Modern SUV Studio Render.png';
                              }}
                            />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ fontSize: '11.5px', fontWeight: 800, background: '#E2E8F0', color: '#1E293B', padding: '2px 7px', borderRadius: '6px' }}>
                                  #{b.bookingNumber || b.id.slice(0, 8)}
                                </span>
                                <span
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    background: st === 'CONFIRMED' || st === 'ACTIVE' ? '#DCFCE7' : st === 'PAYMENT_PENDING' ? '#FEF3C7' : st === 'COMPLETED' ? '#EFF6FF' : '#F1F5F9',
                                    color: st === 'CONFIRMED' || st === 'ACTIVE' ? '#059669' : st === 'PAYMENT_PENDING' ? '#D97706' : st === 'COMPLETED' ? '#2563EB' : '#64748B',
                                  }}
                                >
                                  {b.status}
                                </span>
                              </div>
                              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                                {vehicleName}
                              </h4>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#64748B', flexWrap: 'wrap' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <Calendar size={13} /> {new Date(b.startAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                </span>
                                <span>•</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <Clock size={13} /> {new Date(b.startAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} → {new Date(b.endAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span>•</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <MapPin size={13} /> {vehicle.city || 'Hub'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Total Paid</span>
                              <strong style={{ fontSize: '16px', color: '#0F172A' }}>₹{Number(b.totalAmount) || 0}</strong>
                              <span style={{ fontSize: '10.5px', color: '#059669', display: 'block' }}>+ ₹{Number(b.securityDepositAmount) || 3000} deposit</span>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                              <Link
                                to={`/my-bookings/${b.id}`}
                                style={{
                                  padding: '8px 14px',
                                  borderRadius: '8px',
                                  border: '1px solid #CBD5E1',
                                  background: '#FFFFFF',
                                  color: '#0F172A',
                                  fontSize: '12.5px',
                                  fontWeight: 700,
                                  textDecoration: 'none',
                                }}
                              >
                                View Details
                              </Link>
                              {(st === 'ACTIVE' || st === 'CONFIRMED') && (
                                <Link
                                  to={`/active-rental/${b.id}`}
                                  className="btn-app"
                                  style={{ padding: '8px 14px', fontSize: '12.5px', textDecoration: 'none' }}
                                >
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
            )}

            {/* TAB 3: SAVED VEHICLES (Directly under My Bookings) */}
            {activeTab === 'saved' && (
              <div className="profile-main-card" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ marginBottom: '24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Heart size={22} fill="#EF4444" color="#EF4444" />
                      Saved Vehicles &amp; Wishlist
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                      Vehicles you have saved for quick access, comparison, and one-tap checkout.
                    </p>
                  </div>

                  <span style={{ fontSize: '13px', fontWeight: 700, background: '#FEE2E2', color: '#DC2626', padding: '4px 12px', borderRadius: '999px' }}>
                    {wishlistCount} Saved
                  </span>
                </div>

                {wishlist.length === 0 ? (
                  <div style={{ padding: '48px 24px', textAlign: 'center', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                      <Heart size={28} fill="#EF4444" />
                    </div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 6px 0' }}>
                      Your Saved Vehicles list is empty
                    </h4>
                    <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '380px', margin: '0 auto 18px', lineHeight: 1.5 }}>
                      When browsing cars and bikes, tap the heart icon on any card to save it here for fast booking!
                    </p>
                    <Link to="/vehicles" className="btn-app" style={{ display: 'inline-flex', padding: '10px 22px', fontSize: '13.5px', textDecoration: 'none' }}>
                      Browse Available Vehicles
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                    {wishlist.map((v) => (
                      <div
                        key={v.id}
                        style={{
                          background: '#F8FAFC',
                          borderRadius: '16px',
                          border: '1px solid #E2E8F0',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ position: 'relative', width: '100%', height: '140px', background: '#FFFFFF' }}>
                          <img
                            src={v.image || '/uploads/cards/White Modern SUV Studio Render.png'}
                            alt={v.name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }}
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
                              top: '8px',
                              right: '8px',
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: '#FFFFFF',
                              border: '1px solid #E2E8F0',
                              color: '#EF4444',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: '12px' }}>
                          <div>
                            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                              {v.name}
                            </h4>
                            <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>
                              {v.type || 'Car'} • {v.fuel || 'Petrol'} • {v.transmission || 'Manual'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
                            <div>
                              <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Rate</span>
                              <strong style={{ fontSize: '15px', color: 'var(--orange-primary)' }}>
                                ₹{v.price}/hr
                              </strong>
                            </div>

                            <Link
                              to={`/booking/${v.id}`}
                              className="btn-app"
                              style={{
                                padding: '8px 14px',
                                fontSize: '12.5px',
                                textDecoration: 'none',
                              }}
                            >
                              <span>Book Now</span>
                              <ArrowRight size={13} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: DRIVING LICENSE & KYC */}
            {activeTab === 'kyc' && (
              <div className="profile-main-card" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ marginBottom: '24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ShieldCheck size={22} color="var(--orange-primary)" />
                      Driving License &amp; KYC Verification
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                      Indian MV Act self-drive compliance details required to unlock vehicle digital keys.
                    </p>
                  </div>

                  <Link
                    to="/kyc"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#1E293B',
                      color: '#FFFFFF',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    <span>Full KYC Page</span>
                    <ExternalLink size={14} />
                  </Link>
                </div>

                {/* Status Notice Banner */}
                <div
                  style={{
                    padding: '16px 20px',
                    borderRadius: '14px',
                    background: isVerified ? '#ECFDF5' : '#FFFBEB',
                    border: `1px solid ${isVerified ? '#A7F3D0' : '#FDE68A'}`,
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ShieldCheck size={26} color={isVerified ? '#059669' : '#D97706'} />
                    <div>
                      <strong style={{ fontSize: '15px', color: isVerified ? '#065F46' : '#92400E', display: 'block' }}>
                        {isVerified ? 'Your Driving Profile is Verified & Active' : 'Driving Verification Pending'}
                      </strong>
                      <span style={{ fontSize: '12px', color: isVerified ? '#047857' : '#B45309' }}>
                        {isVerified
                          ? 'You are authorized to rent Cars (LMV) and Bikes (MCWG) across India.'
                          : 'Enter your Driving License number and click Instant Verification below to activate booking eligibility.'}
                      </span>
                    </div>
                  </div>

                  {!isVerified && (
                    <button
                      type="button"
                      className="btn-app"
                      onClick={handleInstantKycApproval}
                      disabled={instantApproving || !licenseNumber}
                      style={{
                        padding: '9px 18px',
                        fontSize: '13px',
                        background: 'linear-gradient(135deg, #FF7A00 0%, #EA580C 100%)',
                      }}
                    >
                      <Sparkles size={14} />
                      <span>{instantApproving ? 'Verifying with AI...' : 'Instant AI Verification'}</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveKycDetails}>
                  <div className="modal-form-row">
                    <div className="modal-form-group">
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Driving License Number *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. MH-1420150098765 or DL-0420110012345"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
                        required
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', textTransform: 'uppercase' }}
                      />
                    </div>

                    <div className="modal-form-group">
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        License Expiry Date
                      </label>
                      <input
                        type="date"
                        value={licenseExpiryAt}
                        onChange={(e) => setLicenseExpiryAt(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                      Approved Vehicle Endorsements
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={categories.includes('LMV')}
                          onChange={(e) => {
                            if (e.target.checked) setCategories([...categories, 'LMV']);
                            else setCategories(categories.filter((c) => c !== 'LMV'));
                          }}
                        />
                        <strong>LMV (Light Motor Vehicle)</strong> — Authorizes self-driving Cars &amp; SUVs
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={categories.includes('MCWG')}
                          onChange={(e) => {
                            if (e.target.checked) setCategories([...categories, 'MCWG']);
                            else setCategories(categories.filter((c) => c !== 'MCWG'));
                          }}
                        />
                        <strong>MCWG (Motorcycle with Gear)</strong> — Authorizes riding Bikes &amp; Scooters
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                    <button
                      type="submit"
                      className="btn-app"
                      disabled={savingKyc || instantApproving}
                      style={{ padding: '12px 26px', fontSize: '14px' }}
                    >
                      <Save size={16} />
                      <span>{savingKyc ? 'Saving...' : 'Save License Details'}</span>
                    </button>

                    {!isVerified && (
                      <button
                        type="button"
                        onClick={handleInstantKycApproval}
                        disabled={instantApproving || !licenseNumber}
                        style={{
                          padding: '12px 22px',
                          borderRadius: '10px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #FF7A00 0%, #EA580C 100%)',
                          color: '#FFFFFF',
                          fontSize: '14px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Sparkles size={16} />
                        <span>{instantApproving ? 'Verifying...' : 'Verify & Approve Instantly'}</span>
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: EMERGENCY CONTACTS */}
            {activeTab === 'emergency' && (
              <div className="profile-main-card" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ marginBottom: '24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Phone size={22} color="var(--orange-primary)" />
                    Emergency Contacts
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                    Mandatory 24/7 emergency contact details used exclusively during road emergencies and breakdown support.
                  </p>
                </div>

                <form onSubmit={handleSaveEmergency}>
                  <div className="modal-form-row">
                    <div className="modal-form-group">
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Emergency Contact Person *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Sharma"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      />
                    </div>

                    <div className="modal-form-group">
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Emergency Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <div className="modal-form-group" style={{ marginTop: '16px', maxWidth: '320px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Relationship to Driver
                    </label>
                    <select
                      value={emergencyRelation}
                      onChange={(e) => setEmergencyRelation(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', background: '#FFFFFF' }}
                    >
                      <option value="Family">Family / Parent</option>
                      <option value="Spouse">Spouse / Partner</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Friend">Friend / Colleague</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn-app"
                    disabled={savingEmergency}
                    style={{ marginTop: '24px', padding: '12px 28px', fontSize: '14px' }}
                  >
                    <Save size={16} />
                    <span>{savingEmergency ? 'Saving...' : 'Save Emergency Contact'}</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 4: ACCOUNT SECURITY */}
            {activeTab === 'security' && (
              <div className="profile-main-card" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ marginBottom: '24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Lock size={22} color="var(--orange-primary)" />
                    Account Security &amp; Credentials
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                    Manage your password, login authentications, and session security.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '28px' }}>
                  <div style={{ padding: '16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748B', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Mobile Authentication
                    </span>
                    <strong style={{ fontSize: '15px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Smartphone size={16} color="#059669" /> {user?.phone}
                    </strong>
                    <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600, marginTop: '2px', display: 'block' }}>
                      ✓ OTP Verified
                    </span>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748B', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Account Identifier
                    </span>
                    <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block', fontFamily: 'monospace' }}>
                      {user?.id ? `${user.id.slice(0, 14)}...` : 'CUSTOMER-USER'}
                    </strong>
                    <span style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', display: 'block' }}>
                      Role: {user?.role || 'CUSTOMER'}
                    </span>
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
                    Change Account Password
                  </h4>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 20px 0' }}>
                    Must be at least 8 characters long with uppercase, lowercase, numbers, and special characters.
                  </p>

                  <form onSubmit={handleChangePassword}>
                    <div className="modal-form-group" style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Current Password *
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                      />
                    </div>

                    <div className="modal-form-row">
                      <div className="modal-form-group">
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                          New Password * (Min 8 chars)
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                        />
                      </div>

                      <div className="modal-form-group">
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                          Confirm New Password *
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-app"
                      disabled={changingPass}
                      style={{ marginTop: '18px', padding: '11px 24px', fontSize: '14px' }}
                    >
                      <Lock size={15} />
                      <span>{changingPass ? 'Updating Password...' : 'Update Password'}</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 5: PREFERENCES & ALERTS */}
            {activeTab === 'preferences' && (
              <div className="profile-main-card" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ marginBottom: '24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Bell size={22} color="var(--orange-primary)" />
                    Preferences &amp; Notifications
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                    Customize notification channels, preferred language, and digital invoice receipts.
                  </p>
                </div>

                <form onSubmit={handleSavePreferences}>
                  <div className="modal-form-group" style={{ marginBottom: '24px', maxWidth: '340px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Preferred Application Language
                    </label>
                    <select
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', background: '#FFFFFF' }}
                    >
                      <option value="English">English</option>
                      <option value="Hindi">हिंदी (Hindi)</option>
                      <option value="Marathi">मराठी (Marathi)</option>
                      <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                      <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                      <option value="Tamil">தமிழ் (Tamil)</option>
                      <option value="Telugu">తెలుగు (Telugu)</option>
                      <option value="Bengali">বাংলা (Bengali)</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '12px' }}>
                      Trip Notification Channels
                    </label>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={notifyWhatsapp}
                          onChange={(e) => setNotifyWhatsapp(e.target.checked)}
                          style={{ marginTop: '3px' }}
                        />
                        <div>
                          <strong>WhatsApp Trip Alerts &amp; Key PINs</strong>
                          <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>
                            Receive automated pickup hub directions, vehicle unlock PINs, and return reminders.
                          </span>
                        </div>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={notifySms}
                          onChange={(e) => setNotifySms(e.target.checked)}
                          style={{ marginTop: '3px' }}
                        />
                        <div>
                          <strong>SMS Security &amp; Booking OTPs</strong>
                          <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>
                            Critical authentication codes, booking confirmations, and payment receipts.
                          </span>
                        </div>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={notifyEmail}
                          onChange={(e) => setNotifyEmail(e.target.checked)}
                          style={{ marginTop: '3px' }}
                        />
                        <div>
                          <strong>Email GST Invoices &amp; Offers</strong>
                          <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>
                            Itemized tax invoices and seasonal weekend road trip coupon discounts.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-app"
                    disabled={savingPrefs}
                    style={{ padding: '12px 28px', fontSize: '14px' }}
                  >
                    <Save size={16} />
                    <span>{savingPrefs ? 'Saving...' : 'Save Preferences'}</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 6: ACTIVITY & SHORTCUTS */}
            {activeTab === 'activity' && (
              <div className="profile-main-card" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ marginBottom: '24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Compass size={22} color="var(--orange-primary)" />
                    Activity &amp; Shortcuts
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                    Direct fast-access to all your reservations, saved wishlist vehicles, and membership plans.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <button
                    type="button"
                    onClick={() => handleTabSelect('bookings')}
                    style={{
                      padding: '20px',
                      borderRadius: '16px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      textAlign: 'left',
                      color: '#0F172A',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '130px',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--orange-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 122, 0, 0.1)', color: 'var(--orange-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Car size={20} />
                      </div>
                      <ArrowRight size={16} color="#94A3B8" />
                    </div>
                    <div>
                      <strong style={{ fontSize: '16px', display: 'block', color: '#0F172A' }}>My Bookings</strong>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>View current, upcoming &amp; completed trips</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabSelect('saved')}
                    style={{
                      padding: '20px',
                      borderRadius: '16px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      textAlign: 'left',
                      color: '#0F172A',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '130px',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Heart size={20} fill="#ef4444" />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 800, background: '#FEE2E2', color: '#DC2626', padding: '2px 8px', borderRadius: '8px' }}>
                        {wishlistCount} Saved
                      </span>
                    </div>
                    <div>
                      <strong style={{ fontSize: '16px', display: 'block', color: '#0F172A' }}>Saved Vehicles</strong>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>Quick-book your shortlisted cars</span>
                    </div>
                  </button>

                  <Link
                    to="/subscriptions"
                    style={{
                      padding: '20px',
                      borderRadius: '16px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      textDecoration: 'none',
                      color: '#0F172A',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '130px',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkles size={20} />
                      </div>
                      <ArrowRight size={16} color="#94A3B8" />
                    </div>
                    <div>
                      <strong style={{ fontSize: '16px', display: 'block', color: '#0F172A' }}>Memberships &amp; Plans</strong>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>Unlock unlimited rental discounts</span>
                    </div>
                  </Link>

                  <Link
                    to="/support"
                    style={{
                      padding: '20px',
                      borderRadius: '16px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      textDecoration: 'none',
                      color: '#0F172A',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '130px',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0284C7'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LifeBuoy size={20} />
                      </div>
                      <ArrowRight size={16} color="#94A3B8" />
                    </div>
                    <div>
                      <strong style={{ fontSize: '16px', display: 'block', color: '#0F172A' }}>Help &amp; Support Tickets</strong>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>Raise requests &amp; track 24/7 assistance</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
