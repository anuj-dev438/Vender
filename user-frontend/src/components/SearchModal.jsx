import React, { useState } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { vehiclesCatalog } from '../data/mockData';

export default function SearchModal({ onClose, onSelectVehicle }) {
  const [query, setQuery] = useState('');

  const matches = query.trim()
    ? vehiclesCatalog.filter(
        (v) =>
          v.name.toLowerCase().includes(query.toLowerCase()) ||
          v.type.toLowerCase().includes(query.toLowerCase()) ||
          v.fuel.toLowerCase().includes(query.toLowerCase())
      )
    : vehiclesCatalog.slice(0, 4);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container search-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close search">
          <X size={20} />
        </button>

        <div className="search-modal-header">
          <div className="search-input-wrapper">
            <Search size={22} className="search-input-icon" />
            <input
              type="text"
              autoFocus
              placeholder="Search by vehicle name, Scooty, Bike, Car, EV..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-modal-input"
            />
          </div>
        </div>

        <div className="search-results-list">
          <div className="search-results-title">
            {query.trim() ? `Search Results (${matches.length})` : 'Popular Recommendations'}
          </div>

          {matches.map((vehicle) => (
            <div
              key={vehicle.id}
              className="search-result-row"
              onClick={() => {
                onClose();
                onSelectVehicle(vehicle);
              }}
            >
              <img src={vehicle.image} alt={vehicle.name} className="search-result-thumb" />
              <div className="search-result-info">
                <h4>{vehicle.name}</h4>
                <span>{vehicle.type} • {vehicle.fuel} • {vehicle.transmission}</span>
              </div>
              <div className="search-result-action">
                <span className="search-price">₹{vehicle.price}/hr</span>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}

          {matches.length === 0 && (
            <div className="search-empty">
              No vehicles match "{query}". Try searching "Scooter", "SUV", or "EV".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
