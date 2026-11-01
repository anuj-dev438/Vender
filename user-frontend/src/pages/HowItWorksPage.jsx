import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Find Your Ride',
      desc: 'Browse hundreds of verified Scooties, Bikes, Cars, and EVs across 50+ cities. Filter by hourly rate, transmission, or fuel type.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Quick 1-Minute KYC',
      desc: 'Upload your original Indian Driving License and take a quick selfie. Our automated AI verification approves your profile in under 10 minutes.',
      icon: ShieldCheck,
    },
    {
      num: '03',
      title: 'Keyless Unlock & Drive',
      desc: 'Arrive at the designated CountryDrive station or partner hub. Unlock the vehicle seamlessly using the smart key in your browser or app.',
      icon: KeyRound,
    },
    {
      num: '04',
      title: 'Return & Auto-Refund',
      desc: 'Drop the vehicle back at the hub, complete the 2-minute photo checklist, and receive 100% of your refundable security deposit within 24 hours.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="how-it-works-page">
      <div className="section-inner">
        <div className="info-page-header">
          <span className="hero-eyebrow" style={{ color: 'var(--orange-primary)' }}>SIMPLE &amp; TRANSPARENT</span>
          <h1>How Country Drive Works</h1>
          <p>Renting a vehicle has never been this fast, transparent, and completely paperless.</p>
        </div>

        <div className="how-steps-grid">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div className="step-card" key={s.num}>
                <span className="step-num-badge">{s.num}</span>
                <div className="step-icon-wrap">
                  <Icon size={28} color="var(--orange-primary)" />
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="info-cta-box">
          <h2>Ready to start your journey?</h2>
          <p>Choose from our verified fleet of scooties, bikes, and cars today.</p>
          <Link to="/vehicles" className="btn-app" style={{ display: 'inline-flex', marginTop: '16px' }}>
            <span>Browse Vehicles</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
