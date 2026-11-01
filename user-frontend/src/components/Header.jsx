import React, { useState, useEffect } from 'react';
import { LOGO_PATH, SITE_NAME, navItems } from '../data/mockData';
import { Search, ArrowRight, Menu, X } from 'lucide-react';

export default function Header({ onOpenSearch, onOpenAuth, onOpenAppModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, nav) => {
    e.preventDefault();
    setActiveNav(nav.label);
    setMobileMenuOpen(false);
    const target = document.querySelector(nav.url);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-inner">
        <a href="#home" className="logo" onClick={(e) => handleNavClick(e, { label: 'Home', url: '#home' })}>
          <img src={LOGO_PATH} alt={SITE_NAME} className="logo-img" />
          <span className="logo-text">Country <span>Drive</span></span>
        </a>

        {/* Desktop Nav */}
        <nav className="nav-menu">
          {navItems.map((nav) => (
            <a
              key={nav.label}
              href={nav.url}
              className={`nav-link ${activeNav === nav.label ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, nav)}
            >
              {nav.label}
            </a>
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

          <button
            className="btn-login"
            onClick={onOpenAuth}
          >
            Login
          </button>

          <button
            className="btn-app"
            onClick={onOpenAppModal}
          >
            <span>Download App</span>
            <ArrowRight size={16} />
          </button>

          {/* Mobile hamburger toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          {navItems.map((nav) => (
            <a
              key={nav.label}
              href={nav.url}
              className={`mobile-nav-link ${activeNav === nav.label ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, nav)}
            >
              {nav.label}
            </a>
          ))}
          <div className="mobile-nav-actions">
            <button className="btn-login" onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}>Login</button>
            <button className="btn-app" onClick={() => { setMobileMenuOpen(false); onOpenAppModal(); }}>Download App</button>
          </div>
        </div>
      )}
    </header>
  );
}
