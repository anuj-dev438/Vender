import React, { useState } from 'react';
import { LOGO_PATH, footerQuickLinks, footerSupportLinks } from '../data/mockData';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Footer({ onNavClick }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-main">
          {/* Brand info */}
          <div className="footer-brand">
            <a href="#home" className="footer-logo" aria-label="Country Drive home">
              <img
                src={LOGO_PATH}
                alt="Country Drive"
                className="footer-logo-img"
              />
            </a>
            <p className="footer-tagline">Rent Vehicles. Drive Freedom.</p>
            <p className="footer-vehicle-types">
              Scooty | Bike | Car | EV | Hybrid | Diesel | Petrol
            </p>
            <div className="footer-social" aria-label="Social media">
              <a href="#home" className="footer-social-link" aria-label="Facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
                  <path d="M13.4 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.2v3.2H10V21h3.4z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#home" className="footer-social-link" aria-label="Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
                  <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8"/>
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8"/>
                  <circle cx="17.6" cy="6.6" r="1.1" fill="currentColor"/>
                </svg>
              </a>
              <a href="#home" className="footer-social-link" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
                  <path d="M5.2 8.6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM3.5 10h3.4v10H3.5zm5.5 0h3.3v1.4h.1a3.7 3.7 0 0 1 3.3-1.8c3.5 0 4.2 2.3 4.2 5.2V20h-3.4v-4.6c0-1.1 0-2.6-1.6-2.6s-1.9 1.2-1.9 2.5V20H9z" fill="currentColor"/>
                </svg>
              </a>
              <a href="#home" className="footer-social-link" aria-label="YouTube">
                <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
                  <path d="M22 7.2a2.8 2.8 0 0 0-2-2C18.2 4.7 12 4.7 12 4.7s-6.2 0-8 .5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1.5 12a29 29 0 0 0 .5 4.8 2.8 2.8 0 0 0 2 2c1.8.5 8 .5 8 .5s6.2 0 8-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22.5 12a29 29 0 0 0-.5-4.8zM9.8 15.2V8.8l5.6 3.2z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="footer-column">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              {footerQuickLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.url}
                    onClick={(e) => {
                      if (link.url.startsWith('#')) {
                        e.preventDefault();
                        onNavClick(link.url);
                      }
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="footer-column">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              {footerSupportLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.url}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter">
            <h4 className="footer-heading">Subscribe to Our Newsletter</h4>
            <p className="newsletter-desc">Get the latest discounts & new ride alerts directly.</p>
            {subscribed ? (
              <div className="newsletter-success">
                <CheckCircle2 size={18} color="#10B981" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                <label className="sr-only" htmlFor="footer-email">Enter your email</label>
                <input
                  id="footer-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" aria-label="Subscribe">
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Country Drive. All Rights Reserved.</p>
          <p className="footer-signoff">
            Drive More. Live Freely.
            <img
              src={LOGO_PATH}
              alt=""
              aria-hidden="true"
              style={{ display: 'inline-block', width: '24px', height: '24px', verticalAlign: 'middle', marginLeft: '8px' }}
            />
          </p>
        </div>
      </div>
    </footer>
  );
}
