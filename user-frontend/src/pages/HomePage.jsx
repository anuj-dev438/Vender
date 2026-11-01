import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import BookingBar from '../components/BookingBar';
import VehicleCategories from '../components/VehicleCategories';
import WhyUs from '../components/WhyUs';
import TopPicks from '../components/TopPicks';
import AppBanner from '../components/AppBanner';
import Testimonials from '../components/Testimonials';
import RoadCta from '../components/RoadCta';
import VehicleCard from '../components/vehicle/VehicleCard';
import { vehicleService } from '../services/vehicleService';
import { useToast } from '../context/ToastContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage({ onOpenAppModal }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [duration, setDuration] = useState('hourly');
  const [pickupDateTime, setPickupDateTime] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadVehicles() {
      try {
        setLoading(true);
        const data = await vehicleService.getVehicles();
        setVehicles(data.vehicles);
      } catch (err) {
        console.error('Error loading vehicles on home page:', err);
      } finally {
        setLoading(false);
      }
    }
    loadVehicles();
  }, []);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    const catalogEl = document.getElementById('fleet-preview');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFindVehicles = () => {
    navigate(`/vehicles?city=${selectedLocation !== 'all' ? selectedLocation : ''}&category=${selectedCategory !== 'all' ? selectedCategory : ''}`);
  };

  const handleViewAllVehicles = () => {
    navigate('/vehicles');
  };

  const filteredVehicles = vehicles.filter((v) => {
    if (selectedCategory === 'all') return true;
    return (
      v.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      v.type?.toLowerCase() === selectedCategory.toLowerCase() ||
      v.fuel?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }).slice(0, 6);

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <Hero />

      {/* Booking Filter Bar */}
      <BookingBar
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        duration={duration}
        onSelectDuration={setDuration}
        pickupDateTime={pickupDateTime}
        onSelectDateTime={setPickupDateTime}
        onFindVehicles={handleFindVehicles}
      />

      {/* Explore Categories */}
      <VehicleCategories
        onSelectCategory={handleSelectCategory}
        onViewAll={handleViewAllVehicles}
      />

      {/* Available Fleet Preview */}
      <section className="catalog-section" id="fleet-preview">
        <div className="section-inner">
          <div className="catalog-header">
            <div>
              <span className="catalog-eyebrow">
                <Sparkles size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                Verified Rentals Near You
              </span>
              <h2 className="catalog-title">
                {selectedCategory === 'all'
                  ? 'Featured Vehicles Ready to Drive'
                  : `${selectedCategory.toUpperCase()} Rentals`}
              </h2>
              <p className="catalog-subtitle">
                All vehicles sanitized, GPS-enabled &amp; fully insured with transparent hourly pricing.
              </p>
            </div>
            <button
              type="button"
              className="explore-view-all btn-view-all-custom"
              onClick={handleViewAllVehicles}
            >
              <span>Explore All Fleet ({vehicles.length})</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="loading-state-box">
              <div className="spinner"></div>
              <p>Loading available fleet...</p>
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
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyUs />

      {/* Top Picks Carousel */}
      <TopPicks
        onBookVehicle={(v) => navigate(v.id ? `/booking/${v.id}` : '/vehicles')}
        onViewAll={handleViewAllVehicles}
      />

      {/* Mobile App Download Banner */}
      <AppBanner onOpenAppModal={onOpenAppModal} />

      {/* Customer Testimonials */}
      <Testimonials />

      {/* Road CTA */}
      <RoadCta onFindVehicles={handleFindVehicles} />
    </div>
  );
}
