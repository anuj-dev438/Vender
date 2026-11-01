import React, { useRef } from 'react';
import { topPicks } from '../data/mockData';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function TopPicks({ onBookVehicle, onViewAll }) {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="top-picks-section" id="top-picks">
      <div className="top-picks-inner">
        <div className="top-picks-header">
          <div className="top-picks-heading-wrap">
            <span className="top-picks-eyebrow">POPULAR VEHICLES NEAR YOU</span>
            <h2 className="top-picks-title">Top Picks<br />For Your Next Ride</h2>
          </div>

          <div className="top-picks-controls">
            <button
              type="button"
              className="top-picks-link btn-view-all-custom"
              onClick={onViewAll}
            >
              View All Vehicles <span aria-hidden="true">→</span>
            </button>
            <div className="top-picks-nav" aria-label="Vehicle navigation">
              <button
                type="button"
                className="top-picks-btn top-picks-prev"
                aria-label="Previous vehicles"
                onClick={() => scroll('prev')}
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                className="top-picks-btn top-picks-next"
                aria-label="Next vehicles"
                onClick={() => scroll('next')}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="top-picks-carousel" ref={carouselRef} aria-label="Top picks vehicle carousel">
          <div className="top-picks-track">
            {topPicks.map((vehicle) => (
              <article className="top-picks-card" key={vehicle.id}>
                <div className="top-picks-card-media">
                  {vehicle.badge && (
                    <span className={`top-picks-badge ${vehicle.badgeClass}`}>
                      {vehicle.badge}
                    </span>
                  )}
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    loading="lazy"
                    className="top-picks-vehicle-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/uploads/cards/Pastel Blue Modern Scooter Product Shot.png';
                    }}
                  />
                </div>
                <div className="top-picks-card-body">
                  <h3 className="top-picks-card-name">{vehicle.name}</h3>
                  <div className="top-picks-price">{vehicle.price}</div>
                  <ul className="top-picks-specs">
                    {vehicle.specs.map((spec, i) => (
                      <li className="top-picks-spec" key={i}>
                        <span className="top-picks-spec-dot" aria-hidden="true"></span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="top-picks-book-btn"
                    onClick={() =>
                      onBookVehicle({
                        name: vehicle.name,
                        price: vehicle.price.replace(/[^\d]/g, ''),
                        priceUnit: 'hour',
                        image: vehicle.image,
                        type: vehicle.name
                      })
                    }
                  >
                    Book Now <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
