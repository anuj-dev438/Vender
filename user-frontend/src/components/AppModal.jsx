import React from 'react';
import { X, QrCode, Smartphone, Sparkles, CheckCircle } from 'lucide-react';
import { LOGO_PATH } from '../data/mockData';

export default function AppModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container app-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
          <X size={20} />
        </button>

        <div className="app-modal-header">
          <img src={LOGO_PATH} alt="Country Drive" className="app-modal-logo" />
          <h2 className="app-modal-title">Get Country Drive on Mobile</h2>
          <p className="app-modal-sub">Fastest booking, keyless entry &amp; 24/7 on-road support</p>
        </div>

        <div className="app-modal-body">
          <div className="qr-box">
            <div className="qr-frame">
              <QrCode size={130} color="#0F172A" />
            </div>
            <span className="qr-hint">Scan with camera to install</span>
          </div>

          <div className="app-modal-perks">
            <div className="perk-item">
              <CheckCircle size={16} color="#FF7A00" />
              <span>Unlock vehicles with Bluetooth Smart Key</span>
            </div>
            <div className="perk-item">
              <CheckCircle size={16} color="#FF7A00" />
              <span>Real-time GPS ride tracking</span>
            </div>
            <div className="perk-item">
              <CheckCircle size={16} color="#FF7A00" />
              <span>Flat 20% discount on first 3 app bookings</span>
            </div>
          </div>
        </div>

        <div className="app-modal-footer">
          <a
            href="https://play.google.com"
            target="_blank"
            rel="noreferrer"
            className="store-badge-link"
          >
            Google Play
          </a>
          <a
            href="https://apple.com"
            target="_blank"
            rel="noreferrer"
            className="store-badge-link"
          >
            App Store
          </a>
        </div>
      </div>
    </div>
  );
}
