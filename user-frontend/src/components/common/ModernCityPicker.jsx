import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronDown, Check, X, Compass } from 'lucide-react';

const CITIES = [
  { id: 'Mumbai', name: 'Mumbai', subtitle: 'Airport T2, BKC, South Mumbai', icon: '🏙️' },
  { id: 'Delhi', name: 'Delhi NCR', subtitle: 'IGI Airport T3, CP, Gurgaon', icon: '🏛️' },
  { id: 'Bangalore', name: 'Bangalore', subtitle: 'KIA Airport, Indiranagar, Koramangala', icon: '💻' },
  { id: 'Pune', name: 'Pune', subtitle: 'Airport, Viman Nagar, Koregaon Park', icon: '🎓' },
  { id: 'Goa', name: 'Goa', subtitle: 'Mopa Airport, Panaji, North Goa', icon: '🏖️' },
  { id: 'Hyderabad', name: 'Hyderabad', subtitle: 'RGIA Airport, Hitec City, Jubilee Hills', icon: '🏰' },
];

export default function ModernCityPicker({
  value,
  onChange,
  label = 'Select Location',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedCityObj = CITIES.find(
    (c) => c.id.toLowerCase() === (value || '').toLowerCase() || c.name.toLowerCase() === (value || '').toLowerCase()
  );

  const displayCity = selectedCityObj ? selectedCityObj.name : (value && value !== 'all' ? value : 'All Cities');

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (cityId) => {
    onChange?.(cityId);
    setIsOpen(false);
  };

  return (
    <div className="modern-city-picker-wrap" ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'transparent',
          border: 'none',
          padding: 0,
          textAlign: 'left',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
          {label && (
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dark, #0F172A)', letterSpacing: '0.02em' }}>
              {label}
            </span>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#0F172A', fontWeight: 700 }}>
            <span style={{ color: selectedCityObj ? '#0F172A' : '#64748B' }}>
              {displayCity}
            </span>
          </div>
        </div>
        <ChevronDown size={14} color="#64748B" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }} />
      </button>

      {/* Modern Popover Panel */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            left: 0,
            zIndex: 1000,
            width: '320px',
            maxWidth: '90vw',
            background: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0,0,0,0.04)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            animation: 'fadeIn 0.15s ease',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255, 122, 0, 0.1)', color: 'var(--orange-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={15} />
              </div>
              <strong style={{ fontSize: '14px', color: '#0F172A' }}>Select Pickup City</strong>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* All Cities Option */}
          <button
            type="button"
            onClick={() => handleSelect('all')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '12px',
              background: !selectedCityObj || value === 'all' ? '#FFF7ED' : '#F8FAFC',
              border: `1px solid ${!selectedCityObj || value === 'all' ? '#FED7AA' : '#E2E8F0'}`,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>🌐</span>
              <div>
                <strong style={{ fontSize: '13.5px', color: '#0F172A', display: 'block' }}>All Locations</strong>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Search fleet across all Indian cities</span>
              </div>
            </div>
            {(!selectedCityObj || value === 'all') && <Check size={16} color="var(--orange-primary)" />}
          </button>

          {/* City List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '260px', overflowY: 'auto' }}>
            {CITIES.map((city) => {
              const isSel = selectedCityObj?.id === city.id || value === city.id;
              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleSelect(city.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    background: isSel ? '#FFF7ED' : '#FFFFFF',
                    border: `1px solid ${isSel ? 'var(--orange-primary)' : '#F1F5F9'}`,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSel) e.currentTarget.style.background = '#F8FAFC';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSel) e.currentTarget.style.background = '#FFFFFF';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>{city.icon}</span>
                    <div>
                      <strong style={{ fontSize: '13.5px', color: '#0F172A', display: 'block' }}>{city.name}</strong>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>{city.subtitle}</span>
                    </div>
                  </div>
                  {isSel && <Check size={16} color="var(--orange-primary)" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
