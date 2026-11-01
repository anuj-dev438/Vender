import React from 'react';
import { HERO_BANNER, benefits } from '../data/mockData';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <img src={HERO_BANNER} alt="Scenic Country Drive" />
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <span className="hero-eyebrow">Hourly Vehicle Rentals</span>
        <h1 className="hero-title">
          Drive<br />
          Your Journey,<br />
          <span>Your Way.</span>
        </h1>
        <p className="hero-desc">
          Rent Scooty, Bike, Car, EV, Hybrid, Diesel or Petrol
          from trusted owners near you. Available on hourly basis.
        </p>
        <div className="hero-benefits">
          {benefits.map((b, index) => (
            <div className="benefit-item" key={index}>
              <div className="benefit-icon-wrap">
                <img src={b.icon} alt={b.title} className="benefit-icon" />
              </div>
              <div className="benefit-title">{b.title}</div>
              <div className="benefit-desc" style={{ whiteSpace: 'pre-line' }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="hero-explore">
        <span className="hero-explore-line1">Explore<br />More Roads</span>
        <span className="hero-explore-line2">More Freedom</span>
      </div>
    </section>
  );
}
