import React, { useState, useMemo } from 'react';
import { vehiclesCatalog } from '../data/mockData';
import { Star, Users, Fuel, Settings, Check, ArrowRight } from 'lucide-react';

export default function VehicleCatalog({ activeCategory, searchQuery, onBookVehicle }) {
  const [fuelFilter, setFuelFilter] = useState('all');

  const filteredVehicles = useMemo(() => {
    return vehiclesCatalog.filter((v) => {
      // Category filter
      const matchesCategory =
        activeCategory === 'all' ||
        v.category.toLowerCase() === activeCategory.toLowerCase() ||
        v.type.toLowerCase() === activeCategory.toLowerCase() ||
        v.fuel.toLowerCase() === activeCategory.toLowerCase();

      // Fuel filter
      const matchesFuel =
        fuelFilter === 'all' || v.fuel.toLowerCase() === fuelFilter.toLowerCase();

      // Search query filter
      const matchesSearch =
        !searchQuery ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.fuel.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesFuel && matchesSearch;
    });
  }, [activeCategory, fuelFilter, searchQuery]);

  return (
    <section className="catalog-section" id="catalog">
      <div className="section-inner">
        <div className="catalog-header">
          <div>
            <span className="catalog-eyebrow">Available Fleet</span>
            <h2 className="catalog-title">
              {activeCategory === 'all'
                ? 'All Available Vehicles'
                : `${activeCategory.toUpperCase()} Rentals`}
            </h2>
            <p className="catalog-subtitle">
              Showing {filteredVehicles.length} verified vehicles ready for instant booking.
            </p>
          </div>

          {/* Quick Fuel Sub-filters */}
          <div className="catalog-fuel-filters">
            {['all', 'Petrol', 'Diesel', 'EV', 'Hybrid'].map((fuel) => (
              <button
                key={fuel}
                type="button"
                className={`fuel-filter-btn ${fuelFilter === fuel.toLowerCase() ? 'active' : ''}`}
                onClick={() => setFuelFilter(fuel.toLowerCase())}
              >
                {fuel === 'all' ? 'All Fuel Types' : fuel}
              </button>
            ))}
          </div>
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="empty-catalog-state">
            <p className="empty-text">No vehicles found matching your criteria.</p>
            <button
              type="button"
              className="btn-app"
              onClick={() => {
                setFuelFilter('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="vehicles-grid">
            {filteredVehicles.map((vehicle) => (
              <article key={vehicle.id} className="vehicle-card-v2">
                <div className="vehicle-card-badge-row">
                  <span className="vehicle-fuel-badge">{vehicle.fuel}</span>
                  <div className="vehicle-rating-pill">
                    <Star size={13} fill="#FFB800" color="#FFB800" />
                    <span>{vehicle.rating}</span>
                    <span className="reviews-count">({vehicle.reviews})</span>
                  </div>
                </div>

                <div className="vehicle-card-image-box">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="vehicle-card-img"
                    loading="lazy"
                  />
                </div>

                <div className="vehicle-card-content">
                  <div className="vehicle-card-type-row">
                    <span className="vehicle-type-label">{vehicle.type}</span>
                    <div className="vehicle-price-tag">
                      <span className="price-symbol">₹</span>
                      <span className="price-amount">{vehicle.price}</span>
                      <span className="price-unit">/{vehicle.priceUnit}</span>
                    </div>
                  </div>

                  <h3 className="vehicle-card-title">{vehicle.name}</h3>

                  <div className="vehicle-specs-row">
                    <div className="vehicle-spec-chip" title="Seating Capacity">
                      <Users size={14} />
                      <span>{vehicle.seats} Seats</span>
                    </div>
                    <div className="vehicle-spec-chip" title="Transmission">
                      <Settings size={14} />
                      <span>{vehicle.transmission}</span>
                    </div>
                    <div className="vehicle-spec-chip" title="Fuel Type">
                      <Fuel size={14} />
                      <span>{vehicle.fuel}</span>
                    </div>
                  </div>

                  <div className="vehicle-features-list">
                    {vehicle.features.map((feat, i) => (
                      <span key={i} className="vehicle-feature-item">
                        <Check size={12} className="feat-check" />
                        {feat}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="vehicle-book-btn"
                    onClick={() => onBookVehicle(vehicle)}
                  >
                    <span>Instant Book</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
