import React from 'react';
import { exploreCategories } from '../data/mockData';
import { ArrowRight } from 'lucide-react';

export default function VehicleCategories({ onSelectCategory, onViewAll }) {
  return (
    <section className="explore-section" id="vehicles">
      <div className="explore-inner">
        <div className="explore-header">
          <div className="explore-header-left">
            <span className="explore-eyebrow">Explore by Category</span>
            <h2 className="explore-title">
              Find the <span className="explore-title-accent">Perfect Vehicle<br />For Every Journey</span>
              <svg className="explore-swoosh" viewBox="0 0 220 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  d="M3 11.5 C 40 3.5, 80 3, 110 6 C 145 9.5, 180 10, 215 4"
                  stroke="#FF7A00"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </h2>
          </div>
          <div className="explore-header-right">
            <p className="explore-desc">
              City commute, weekend trips, business travel<br />
              or just a drive to explore — we have the right<br />
              vehicle for every occasion.
            </p>
            <button
              type="button"
              className="explore-view-all btn-view-all-custom"
              onClick={onViewAll}
            >
              View All Vehicles
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="explore-cards-grid">
          {exploreCategories.map((cat) => (
            <div
              key={cat.name}
              className="explore-card cursor-pointer"
              onClick={() => onSelectCategory(cat.categoryKey)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSelectCategory(cat.categoryKey);
              }}
            >
              <div className="explore-card-img-wrap">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="explore-card-img"
                  loading="lazy"
                />
              </div>
              <div className="explore-card-body">
                <h3 className="explore-card-name">{cat.name}</h3>
                <div className="explore-card-price">
                  From ₹{cat.price}/hour
                  <ArrowRight size={15} className="explore-card-arrow" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
