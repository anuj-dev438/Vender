import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LOGO_PATH, SITE_NAME } from '../../data/mockData';
import { Search, ArrowRight, Menu, X, User, ShieldCheck, Car, LogOut, ChevronDown, Bell, Sparkles, LifeBuoy, CheckCheck, Heart } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { useWishlist } from '../../context/WishlistContext';

export default function Navbar({ onOpenSearch, onOpenAppModal }) {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const lastScrollY = useRef(0);
  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load unread count when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      setNotifications([]);
      return;
    }

    let isMounted = true;
    const fetchUnread = async () => {
      try {
        const count = await notificationService.getUnreadCount();
        if (isMounted) setUnreadCount(count);
      } catch (err) {
        // Silently handle if unauthenticated
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // Check every 30s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  // Load notifications when flyout opens
  const handleOpenNotifications = async () => {
    const nextState = !notificationsOpen;
    setNotificationsOpen(nextState);
    if (nextState) {
      setUserDropdownOpen(false);
      setLoadingNotifications(true);
      try {
        const list = await notificationService.list({ limit: 8 });
        setNotifications(Array.isArray(list) ? list : (list.notifications || []));
      } catch (err) {
        console.warn('Failed to load notifications:', err);
      } finally {
        setLoadingNotifications(false);
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.warn('Mark all read failed:', err);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await notificationService.markAsRead(notif.id);
        setUnreadCount((c) => Math.max(0, c - 1));
        setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, isRead: true } : n));
      } catch (err) {
        console.warn('Mark read failed:', err);
      }
    }
    setNotificationsOpen(false);
    if (notif.data?.bookingId) {
      navigate(`/my-bookings/${notif.data.bookingId}`);
    } else if (notif.link) {
      navigate(notif.link);
    }
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScrollY <= 40) {
            setNavVisible(true);
            setScrolled(false);
          } else {
            setScrolled(true);

            // Hide on scroll down, show on scroll up (keep visible if mobile drawer open)
            if (!mobileMenuOpen) {
              const diff = currentScrollY - lastScrollY.current;
              if (diff > 8 && currentScrollY > 70) {
                setNavVisible(false);
                setUserDropdownOpen(false);
              } else if (diff < -8) {
                setNavVisible(true);
              }
            }
          }

          lastScrollY.current = Math.max(0, currentScrollY);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  // Close dropdown on location change
  useEffect(() => {
    setUserDropdownOpen(false);
    setNotificationsOpen(false);
    setMobileMenuOpen(false);
    setNavVisible(true);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Find Vehicles', path: '/vehicles' },
    { label: 'Memberships', path: '/subscriptions' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Help & Support', path: '/support' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isCurrent = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className={`header ${scrolled || location.pathname !== '/' ? 'header-scrolled' : ''} ${!navVisible ? 'header-hidden' : ''}`}>
      <div className="header-inner">
        <Link to="/" className="logo" aria-label="Country Drive Homepage">
          <img src={LOGO_PATH} alt={SITE_NAME} className="logo-img" />
          <span className="logo-text">Country <span>Drive</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="nav-menu">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`nav-link ${isCurrent(link.path) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="header-actions">
          <button
            className="search-btn"
            aria-label="Search"
            onClick={onOpenSearch}
            title="Search Vehicles"
          >
            <Search size={18} />
          </button>

          {/* Wishlist / Shortlist */}
          <Link
            to="/wishlist"
            className="search-btn wishlist-nav-link"
            aria-label="Saved Vehicles"
            title="Saved Vehicles"
            style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Heart size={18} fill={wishlistCount > 0 ? '#ef4444' : 'none'} color={wishlistCount > 0 ? '#ef4444' : 'currentColor'} />
            {wishlistCount > 0 && (
              <span className="notif-badge" style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: '#fff',
                borderRadius: '10px',
                fontSize: '10px',
                fontWeight: '700',
                padding: '2px 5px',
                lineHeight: '1',
                minWidth: '16px',
                textAlign: 'center',
              }}>
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Notification Bell (Authenticated Users) */}
          {isAuthenticated && (
            <div className="user-profile-menu-wrap" ref={notifMenuRef}>
              <button
                className="search-btn notification-bell-btn"
                aria-label="Notifications"
                onClick={handleOpenNotifications}
                title="Notifications"
                style={{ position: 'relative' }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="notif-badge" style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#FF7A00',
                    color: '#fff',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: '700',
                    padding: '2px 5px',
                    lineHeight: '1',
                    minWidth: '16px',
                    textAlign: 'center',
                  }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="user-dropdown-card" style={{ width: '320px', right: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                    <strong style={{ fontSize: '14px', color: '#111827' }}>Notifications</strong>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        style={{ background: 'none', border: 'none', color: '#FF7A00', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <CheckCheck size={14} /> Mark all read
                      </button>
                    )}
                  </div>

                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {loadingNotifications ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #f3f4f6',
                            background: n.isRead ? 'transparent' : '#FFF8F0',
                            cursor: 'pointer',
                            transition: 'background 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <strong style={{ fontSize: '13px', color: '#111827' }}>{n.title}</strong>
                            {!n.isRead && (
                              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#FF7A00' }}></span>
                            )}
                          </div>
                          <p style={{ margin: 0, fontSize: '12px', color: '#4B5563', lineHeight: '1.4' }}>{n.message}</p>
                          <span style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '4px', display: 'block' }}>
                            {n.createdAt ? new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {isAuthenticated ? (
            <div className="user-profile-menu-wrap" ref={userMenuRef}>
              <div className="user-avatar-btn-group">
                <Link
                  to="/profile"
                  className="user-avatar-btn"
                  title="Open My Profile"
                  onClick={() => { setUserDropdownOpen(false); setNotificationsOpen(false); }}
                >
                  <div className="user-avatar-circle">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name || 'User'} className="avatar-img" />
                    ) : (
                      <User size={18} color="#FFFFFF" />
                    )}
                  </div>
                  <span className="user-name-snippet">{user?.name || user?.phone || 'Customer'}</span>
                </Link>
                <button
                  type="button"
                  className={`user-chevron-trigger-btn ${userDropdownOpen ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserDropdownOpen(!userDropdownOpen);
                    setNotificationsOpen(false);
                  }}
                  aria-label="Toggle user menu"
                  aria-expanded={userDropdownOpen}
                >
                  <ChevronDown size={14} className={`user-chevron ${userDropdownOpen ? 'open' : ''}`} />
                </button>
              </div>

              {userDropdownOpen && (
                <div className="user-dropdown-card">
                  <Link
                    to="/profile"
                    className="dropdown-user-info-link"
                    onClick={() => setUserDropdownOpen(false)}
                    title="Click to view & edit your profile"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <strong className="dropdown-user-name">{user?.name || 'Verified Customer'}</strong>
                      <span className="dropdown-profile-tag">
                        Profile <ArrowRight size={11} />
                      </span>
                    </div>
                    <span className="dropdown-user-phone">{user?.phone}</span>
                    <span className={`dropdown-kyc-badge ${user?.kycStatus === 'VERIFIED' ? 'verified' : 'pending'}`}>
                      <ShieldCheck size={12} />
                      KYC: {user?.kycStatus || 'SUBMISSION_PENDING'}
                    </span>
                  </Link>

                  <div className="dropdown-divider"></div>

                  <Link to="/my-bookings" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                    <Car size={16} />
                    <span>My Bookings</span>
                  </Link>
                  <Link to="/wishlist" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                    <Heart size={16} color="#ef4444" fill={wishlistCount > 0 ? '#ef4444' : 'none'} />
                    <span>Saved Vehicles ({wishlistCount})</span>
                  </Link>
                  <Link to="/subscriptions" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                    <Sparkles size={16} />
                    <span>Memberships &amp; Plans</span>
                  </Link>
                  <Link to="/support" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                    <LifeBuoy size={16} />
                    <span>Help &amp; Support Tickets</span>
                  </Link>
                  <Link to="/profile" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                    <User size={16} />
                    <span>My Profile</span>
                  </Link>
                  <Link to="/kyc" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                    <ShieldCheck size={16} />
                    <span>KYC &amp; DL Verification</span>
                  </Link>

                  <div className="dropdown-divider"></div>

                  <button className="dropdown-item dropdown-logout-btn" onClick={() => { setUserDropdownOpen(false); handleLogout(); }}>
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn-login" onClick={openAuthModal}>
              Login / Sign Up
            </button>
          )}


          <button className="btn-app" onClick={onOpenAppModal}>
            <span>Download App</span>
            <ArrowRight size={16} />
          </button>

          {/* Mobile hamburger toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`mobile-nav-link ${isCurrent(link.path) ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="dropdown-divider"></div>

          {isAuthenticated ? (
            <div className="mobile-user-links">
              <Link
                to="/profile"
                className="mobile-drawer-user-card"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  marginBottom: '10px',
                  textDecoration: 'none',
                }}
              >
                <div className="user-avatar-circle" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name || 'User'} className="avatar-img" />
                  ) : (
                    <User size={20} color="#FFFFFF" />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ fontSize: '15px', color: '#0F172A', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {user?.name || 'Customer Account'}
                  </strong>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>{user?.phone}</span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--orange-primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  Profile <ArrowRight size={13} />
                </span>
              </Link>
              <Link to="/my-bookings" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                <Car size={16} /> My Bookings
              </Link>
              <Link to="/wishlist" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                <Heart size={16} color="#ef4444" fill={wishlistCount > 0 ? '#ef4444' : 'none'} /> Saved Vehicles ({wishlistCount})
              </Link>
              <Link to="/subscriptions" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                <Sparkles size={16} /> Memberships &amp; Plans
              </Link>
              <Link to="/support" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                <LifeBuoy size={16} /> Help &amp; Support Tickets
              </Link>
              <Link to="/profile" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                <User size={16} /> Profile
              </Link>
              <Link to="/kyc" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                <ShieldCheck size={16} /> KYC Verification
              </Link>
              <button className="mobile-logout-btn" onClick={() => { setMobileMenuOpen(false); handleLogout(); }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="mobile-nav-actions">
              <button
                className="btn-login mobile-drawer-btn"
                onClick={() => { setMobileMenuOpen(false); openAuthModal(); }}
              >
                Login / Register
              </button>
            </div>
          )}

          <button
            className="btn-app mobile-drawer-app-btn"
            onClick={() => { setMobileMenuOpen(false); onOpenAppModal(); }}
          >
            <span>Download Mobile App</span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}
    </header>
  );
}
