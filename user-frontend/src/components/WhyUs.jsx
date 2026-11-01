import React from 'react';
import { whyFeatures } from '../data/mockData';

export default function WhyUs() {
  return (
    <section className="wc-section" id="why-us">
      <div className="wc-inner">
        <div className="wc-left">
          <h2 className="wc-title">Why Choose<br />Country Drive?</h2>
          <span className="wc-underline" aria-hidden="true"></span>
          <p className="wc-desc">
            A smarter, simpler and more affordable<br />
            way to rent vehicles.
          </p>
        </div>
        <div className="wc-right">
          <div className="wc-features">
            {whyFeatures.map((f, index) => (
              <div className="wc-feature" key={index}>
                <div className="wc-feature-icon-wrap">
                  <img
                    src={f.icon}
                    alt={f.title}
                    className="wc-feature-icon"
                    loading="lazy"
                  />
                </div>
                <h3 className="wc-feature-title">{f.title}</h3>
                <p className="wc-feature-desc" style={{ whiteSpace: 'pre-line' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
