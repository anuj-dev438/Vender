import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, ChevronDown, Check, X } from 'lucide-react';

const QUICK_TIMES = [
  '08:00', '09:00', '10:00', '11:00',
  '12:00', '14:00', '16:00', '18:00',
  '20:00', '22:00'
];

function formatTimeDisplay(timeStr) {
  if (!timeStr) return '10:00 AM';
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${m} ${ampm}`;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return 'Today';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const target = new Date(d);
  target.setHours(0, 0, 0, 0);

  if (target.getTime() === today.getTime()) {
    return `Today, ${d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`;
  }
  if (target.getTime() === tomorrow.getTime()) {
    return `Tomorrow, ${d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`;
  }
  return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function ModernDateTimePicker({
  value,
  onChange,
  label = 'Pick Date & Time',
  minDate,
  compact = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse initial value (expected: "YYYY-MM-DDTHH:mm" or similar)
  const getInitialState = () => {
    let datePart = '';
    let timePart = '10:00';

    if (value) {
      if (value.includes('T')) {
        const parts = value.split('T');
        datePart = parts[0];
        timePart = parts[1]?.slice(0, 5) || '10:00';
      } else if (value.includes(' ')) {
        const parts = value.split(' ');
        datePart = parts[0];
        timePart = parts[1]?.slice(0, 5) || '10:00';
      } else {
        datePart = value;
      }
    }

    if (!datePart) {
      const now = new Date();
      datePart = now.toISOString().slice(0, 10);
    }

    return { datePart, timePart };
  };

  const [selectedDate, setSelectedDate] = useState(() => getInitialState().datePart);
  const [selectedTime, setSelectedTime] = useState(() => getInitialState().timePart);

  // Sync when prop value changes
  useEffect(() => {
    if (value) {
      const { datePart, timePart } = getInitialState();
      setSelectedDate(datePart);
      setSelectedTime(timePart);
    }
  }, [value]);

  // Close on outside click
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

  const handleApply = (newDate, newTime) => {
    const d = newDate || selectedDate;
    const t = newTime || selectedTime;
    setSelectedDate(d);
    setSelectedTime(t);
    const combined = `${d}T${t}`;
    onChange?.(combined);
    setIsOpen(false);
  };

  // Quick Date Presets
  const getQuickDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    // Upcoming Saturday
    const sat = new Date(today);
    sat.setDate(sat.getDate() + ((6 - sat.getDay() + 7) % 7 || 7));

    return [
      { label: 'Today', date: today.toISOString().slice(0, 10) },
      { label: 'Tomorrow', date: tomorrow.toISOString().slice(0, 10) },
      { label: 'Day After', date: dayAfter.toISOString().slice(0, 10) },
      { label: 'Weekend', date: sat.toISOString().slice(0, 10) },
    ];
  };

  const quickDates = getQuickDates();

  const minDateVal = minDate || new Date().toISOString().slice(0, 10);

  return (
    <div className="modern-date-picker-wrap" ref={containerRef} style={{ position: 'relative', width: '100%' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', color: '#0F172A', fontWeight: 600 }}>
            <span>{formatDateDisplay(selectedDate)}</span>
            <span style={{ color: '#CBD5E1' }}>•</span>
            <span style={{ color: 'var(--orange-primary, #FF7A00)' }}>{formatTimeDisplay(selectedTime)}</span>
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
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            animation: 'fadeIn 0.15s ease',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255, 122, 0, 0.1)', color: 'var(--orange-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={15} />
              </div>
              <strong style={{ fontSize: '14px', color: '#0F172A' }}>Select Pickup Date &amp; Time</strong>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick Date Chips */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
              Quick Presets
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {quickDates.map((item) => {
                const isSel = selectedDate === item.date;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setSelectedDate(item.date);
                      handleApply(item.date, selectedTime);
                    }}
                    style={{
                      padding: '7px 4px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: isSel ? 700 : 500,
                      background: isSel ? 'var(--orange-primary, #FF7A00)' : '#F8FAFC',
                      color: isSel ? '#FFFFFF' : '#334155',
                      border: `1px solid ${isSel ? 'var(--orange-primary)' : '#E2E8F0'}`,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clean Date Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>
              Or Choose Date
            </label>
            <input
              type="date"
              min={minDateVal}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '13.5px',
                color: '#0F172A',
                fontWeight: 600,
                outline: 'none',
                fontFamily: 'inherit',
                background: '#FFFFFF',
              }}
            />
          </div>

          {/* Time Picker */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Pickup Time
              </label>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--orange-primary)' }}>
                {formatTimeDisplay(selectedTime)}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
              {QUICK_TIMES.map((timeStr) => {
                const isSel = selectedTime === timeStr;
                return (
                  <button
                    key={timeStr}
                    type="button"
                    onClick={() => {
                      setSelectedTime(timeStr);
                      handleApply(selectedDate, timeStr);
                    }}
                    style={{
                      padding: '6px 2px',
                      borderRadius: '8px',
                      fontSize: '11.5px',
                      fontWeight: isSel ? 700 : 500,
                      background: isSel ? '#0F172A' : '#F1F5F9',
                      color: isSel ? '#FFFFFF' : '#334155',
                      border: `1px solid ${isSel ? '#0F172A' : '#E2E8F0'}`,
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    {formatTimeDisplay(timeStr).replace(':00', '')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Apply Action Button */}
          <button
            type="button"
            onClick={() => handleApply(selectedDate, selectedTime)}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF7A00 0%, #EA580C 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(255, 122, 0, 0.25)',
            }}
          >
            <Check size={16} />
            <span>Confirm {formatDateDisplay(selectedDate)} at {formatTimeDisplay(selectedTime)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
