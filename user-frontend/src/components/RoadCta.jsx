import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function RoadCta({ onFindVehicles }) {
  return (
    <section className="road-cta" aria-label="Find your next vehicle">
      <div className="road-cta-content">
        <span className="road-cta-eyebrow">Ready to hit the road?</span>
        <h2 className="road-cta-heading">Same Roads.<br />New Stories.</h2>
        <button
          type="button"
          className="road-cta-button btn-find"
          onClick={onFindVehicles}
        >
          <span>Find Vehicles</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
