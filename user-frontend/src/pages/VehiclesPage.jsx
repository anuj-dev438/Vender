import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import VehicleCard from '../components/vehicle/VehicleCard';
import { useToast } from '../context/ToastContext';
import { Search, Filter, SlidersHorizontal, RotateCcw, Car, MapPin } from 'lucide-react';

export default function VehiclesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [city, setCity] = useState(searchParams.get('city') || 'all');
  const [fuel, setFuel] = useState('all');
  const [transmission, setTransmission] = useState('all');
  const [seats, setSeats] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Geolocation / Near Me state
  const [locating, setLocating] = useState(false);
  const [isNearbyActive, setIsNearbyActive] = useState(false);

  const activeFilterCount = (category !== 'all' ? 1 : 0) +
    (fuel !== 'all' ? 1 : 0) +
    (transmission !== 'all' ? 1 : 0) +
    (seats !== 'all' ? 1 : 0) +
    (city !== 'all' ? 1 : 0) +
    (isNearbyActive ? 1 : 0);

  const { showToast } = useToast();

  const fetchFleet = async () => {
    try {
      setLoading(true);
      const res = await vehicleService.getVehicles({
        city: city !== 'all' ? city : undefined,
        category: category !== 'all' ? category.toUpperCase() : undefined,
        fuelType: fuel !== 'all' ? fuel.toUpperCase() : undefined,
      });
      setVehicles(res.vehicles);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNearbyActive) {
      fetchFleet();
    }
  }, [category, city, fuel, isNearbyActive]);

  const handleLocateNearMe = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await vehicleService.getNearbyVehicles({
            lat: latitude,
            lng: longitude,
            radiusKm: 25,
            category: category !== 'all' ? category.toUpperCase() : undefined,
            fuelType: fuel !== 'all' ? fuel.toUpperCase() : undefined,
          });
          setVehicles(res.vehicles);
          setIsNearbyActive(true);
          showToast('Found vehicles near your GPS location!', 'success');
        } catch (err) {
          showToast('Unable to fetch nearby vehicles: ' + err.message, 'error');
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        showToast('Location permission denied or unavailable.', 'warning');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setCity('all');
    setFuel('all');
    setTransmission('all');
    setSeats('all');
    setSortBy('popular');
    setIsNearbyActive(false);
    setSearchParams({});
    fetchFleet();
  };

  // Filter & sort logic
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        // Query text match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            v.name?.toLowerCase().includes(q) ||
            v.make?.toLowerCase().includes(q) ||
            v.model?.toLowerCase().includes(q) ||
            v.category?.toLowerCase().includes(q) ||
            v.fuel?.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Category filter
        if (category !== 'all') {
          const cat = category.toLowerCase();
          if (v.category?.toLowerCase() !== cat && v.type?.toLowerCase() !== cat) {
            return false;
          }
        }

        // Fuel filter
        if (fuel !== 'all') {
          if (v.fuel?.toLowerCase() !== fuel.toLowerCase()) {
            return false;
          }
        }

        // Transmission filter
        if (transmission !== 'all') {
          if (v.transmission?.toLowerCase() !== transmission.toLowerCase()) {
            return false;
          }
        }

        // Seats filter
        if (seats !== 'all') {
          if (Number(v.seats) !== Number(seats)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0; // Default popular / id order
      });
  }, [vehicles, searchQuery, category, fuel, transmission, seats, sortBy]);

  return (
    <div className="vehicles-page-container">
      {/* Page Title & Search Header */}
      <section className="vehicles-hero-header">
        <div className="section-inner">
          <span className="hero-eyebrow" style={{ color: 'var(--orange-primary)' }}>
            EXPLORE THE FLEET
          </span>
          <h1 className="vehicles-page-title">Find Your Perfect Ride</h1>
          <p className="vehicles-page-desc">
            Browse verified self-drive cars, bikes &amp; scooters. Transparent hourly pricing, instant booking &amp; zero paperwork.
          </p>

          {/* Unified search & location bar */}
          <div className="vehicles-search-panel">
            <div className="search-input-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search by car, bike, scooter, or model name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="city-select-box">
              <label>Location:</label>
              <select value={city} onChange={(e) => { setCity(e.target.value); setIsNearbyActive(false); }}>
                <option value="all">All Cities</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Pune">Pune</option>
                <option value="Goa">Goa</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            <button
              type="button"
              className={`nearby-gps-btn ${isNearbyActive ? 'active' : ''}`}
              onClick={handleLocateNearMe}
              disabled={locating}
              title="Find vehicles closest to your current GPS position"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '12px',
                border: isNearbyActive ? '1px solid #FF7A00' : '1px solid #e2e8f0',
                background: isNearbyActive ? '#fff7ed' : '#ffffff',
                color: isNearbyActive ? '#FF7A00' : '#0f172a',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: isNearbyActive ? '0 2px 8px rgba(255, 122, 0, 0.15)' : 'none',
              }}
            >
              <MapPin size={16} color={isNearbyActive ? '#FF7A00' : '#64748b'} />
              <span>{locating ? 'Locating...' : isNearbyActive ? 'Near Me (Active)' : 'Near Me (GPS)'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Filter & Catalog Section */}
      <div className="section-inner vehicles-layout-grid">
        {/* Mobile Filter Toggle */}
        <div className="mobile-filter-bar">
          <button
            type="button"
            className="mobile-filter-toggle-btn"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            aria-expanded={mobileFiltersOpen}
          >
            <SlidersHorizontal size={16} />
            <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
          </button>
          {activeFilterCount > 0 && (
            <button type="button" className="mobile-filter-reset-chip" onClick={handleResetFilters}>
              <RotateCcw size={12} /> Clear
            </button>
          )}
        </div>

        {/* Left Filter Sidebar */}
        <aside className={`filters-sidebar ${mobileFiltersOpen ? 'mobile-filters-open' : ''}`}>
          <div className="filters-sidebar-header">
            <h3><SlidersHorizontal size={18} /> Filters</h3>
            <button className="reset-btn" onClick={handleResetFilters}>
              <RotateCcw size={13} /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-label">Vehicle Type</label>
            <div className="filter-options-stack">
              {[
                { id: 'all', label: 'All Vehicles' },
                { id: 'scooty', label: 'Scooty / Scooter' },
                { id: 'bike', label: 'Motorcycles / Bikes' },
                { id: 'car', label: 'Cars & SUVs' },
                { id: 'ev', label: 'Electric Vehicles (EV)' },
              ].map((c) => (
                <label key={c.id} className="radio-option">
                  <input
                    type="radio"
                    name="category"
                    checked={category === c.id}
                    onChange={() => setCategory(c.id)}
                  />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Fuel Filter */}
          <div className="filter-group">
            <label className="filter-label">Fuel / Energy</label>
            <div className="filter-chips-grid">
              {['all', 'Petrol', 'Diesel', 'EV', 'Hybrid'].map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`filter-chip ${fuel === f.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setFuel(f.toLowerCase())}
                >
                  {f === 'all' ? 'Any Fuel' : f}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div className="filter-group">
            <label className="filter-label">Transmission</label>
            <div className="filter-chips-grid">
              {['all', 'Automatic', 'Manual'].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`filter-chip ${transmission === t.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setTransmission(t.toLowerCase())}
                >
                  {t === 'all' ? 'All' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Seating */}
          <div className="filter-group">
            <label className="filter-label">Seating Capacity</label>
            <div className="filter-chips-grid">
              {['all', '2', '5', '7'].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`filter-chip ${seats === s ? 'active' : ''}`}
                  onClick={() => setSeats(s)}
                >
                  {s === 'all' ? 'Any' : `${s} Seats`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <main className="vehicles-results-area">
          <div className="results-top-bar">
            <div className="results-count-text">
              Showing <strong>{filteredVehicles.length}</strong> available vehicles
            </div>

            <div className="sort-dropdown-wrap">
              <label>Sort By:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="popular">Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-state-box">
              <div className="spinner"></div>
              <p>Fetching vehicle catalog from live fleet...</p>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="empty-results-box">
              <Car size={48} color="#94A3B8" />
              <h3>No vehicles match your selected filters</h3>
              <p>Try broadening your criteria or reset the filters to see all available rides.</p>
              <button className="btn-app" onClick={handleResetFilters} style={{ margin: '16px auto 0' }}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="vehicles-grid">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onBookNow={(v) => navigate(`/booking/${v.id}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
