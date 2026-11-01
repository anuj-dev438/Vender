import React from 'react';
import { categories, ICONS } from '../data/mockData';
import { ChevronDown, ArrowRight } from 'lucide-react';
import ModernCityPicker from './common/ModernCityPicker';
import ModernDateTimePicker from './common/ModernDateTimePicker';

export default function BookingBar({
  selectedCategory,
  onSelectCategory,
  selectedLocation,
  onSelectLocation,
  duration,
  onSelectDuration,
  pickupDateTime,
  onSelectDateTime,
  onFindVehicles
}) {
  return (
    <section className="booking-section">
      <div className="booking-inner">
        {/* Categories Bar */}
        <div className="categories-bar">
          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase() ||
              (cat.name === 'All Vehicles' && selectedCategory.toLowerCase() === 'all');
            return (
              <button
                key={cat.id}
                type="button"
                className={`category-btn ${isActive ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.name.toLowerCase() === 'all vehicles' ? 'all' : cat.name.toLowerCase())}
              >
                <img src={cat.icon} alt={cat.name} className="category-icon" />
                <span className="category-label">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Floating Booking Panel */}
        <div className="booking-panel">
          {/* Location field */}
          <div className="booking-field">
            <img src={ICONS.location} alt="Location" className="booking-icon" />
            <div className="booking-input-wrap">
              <ModernCityPicker
                value={selectedLocation}
                onChange={onSelectLocation}
                label="Pickup Location"
              />
            </div>
          </div>

          {/* Date & Time field */}
          <div className="booking-field">
            <img src={ICONS.calendar} alt="Date & Time" className="booking-icon" />
            <div className="booking-input-wrap">
              <ModernDateTimePicker
                value={pickupDateTime}
                onChange={onSelectDateTime}
                label="Pick Date & Time"
              />
            </div>
          </div>

          {/* Duration field */}
          <div className="booking-field">
            <img src={ICONS.clockOrange} alt="Duration" className="booking-icon" />
            <div className="booking-input-wrap">
              <label className="booking-label">Duration</label>
              <select
                className="booking-value"
                value={duration}
                onChange={(e) => onSelectDuration(e.target.value)}
              >
                <option value="hourly">Hourly (Standard)</option>
                <option value="1 hour">1 Hour</option>
                <option value="2 hours">2 Hours</option>
                <option value="4 hours">4 Hours</option>
                <option value="8 hours">8 Hours</option>
                <option value="1 day">1 Day (24h)</option>
                <option value="weekend">Weekend Trip (3 Days)</option>
              </select>
            </div>
            <ChevronDown className="booking-chevron" size={16} />
          </div>

          {/* Find Vehicles Button */}
          <button className="btn-find" type="button" onClick={onFindVehicles}>
            <span>Find Vehicles</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
