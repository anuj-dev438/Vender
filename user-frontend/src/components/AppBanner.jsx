import React from 'react';
import { Smartphone, ShieldCheck, Zap } from 'lucide-react';

export default function AppBanner({ onOpenAppModal }) {
  return (
    <section className="cd-app-banner" id="app" aria-label="Country Drive app download banner">
      <div className="cd-app-banner-content">
        <span className="cd-app-banner-tag">COUNTRY DRIVE APP</span>
        <h2 className="cd-app-banner-title">Book, Unlock<br />&amp; Drive in Minutes.</h2>
        <p className="cd-app-banner-desc">
          Search vehicles, instant booking, secure payments<br />
          and manage your rides — all in one app.
        </p>

        <div className="app-highlights">
          <div className="app-highlight-item">
            <Zap size={18} className="highlight-icon" />
            <span>Instant Digital Key</span>
          </div>
          <div className="app-highlight-item">
            <ShieldCheck size={18} className="highlight-icon" />
            <span>100% Insured Trips</span>
          </div>
          <div className="app-highlight-item">
            <Smartphone size={18} className="highlight-icon" />
            <span>Zero Paperwork</span>
          </div>
        </div>

        <div className="app-banner-buttons">
          <button type="button" className="btn-app-download" onClick={onOpenAppModal}>
            <span>Get on Google Play</span>
          </button>
          <button type="button" className="btn-app-download" onClick={onOpenAppModal}>
            <span>Download on App Store</span>
          </button>
        </div>
      </div>
    </section>
  );
}
