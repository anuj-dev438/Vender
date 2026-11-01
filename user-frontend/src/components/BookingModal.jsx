
import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  CreditCard
} from 'lucide-react';

export default function BookingModal({
  vehicle,
  location,
  duration,
  onClose,
  onBookingSuccess
}) {
  const [step, setStep] = useState(1);
  const [hours, setHours] = useState(4);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupCity, setPickupCity] = useState(
    location !== 'all' ? location : 'Mumbai'
  );
  const [startTime, setStartTime] = useState(
    new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!vehicle) return null;

  // Vehicle ID ko string mein convert karna
  const vehicleId = String(vehicle.id ?? vehicle._id ?? '');

  const hourlyRate = Number(vehicle.price || vehicle.hourlyRate) || 99;
  const subtotal = hourlyRate * hours;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!vehicleId) {
      setError('Vehicle ID missing. Please select another vehicle.');
      return;
    }

    if (!name.trim() || !phone.trim()) {
      setError('Please enter your name and mobile number.');
      return;
    }

    if (!/^[0-9]{10}$/.test(phone.replace(/\D/g, '').slice(-10))) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const bookingData = {
      vehicleId: vehicleId,
      total: Number(total),
      pickupCity,
      hours: Number(hours),
      name: name.trim(),
      phone: phone.trim(),
      startTime
    };

    console.log('Booking Data:', bookingData);

    try {
      setLoading(true);

      if (typeof onBookingSuccess !== 'function') {
        throw new Error('Booking handler is not connected.');
      }

      await onBookingSuccess(bookingData);

      setStep(2);
    } catch (err) {
      console.error('Booking Error:', err);
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {step === 1 ? (
          <div>
            <div className="modal-header">
              <span className="modal-tag">CONFIRM BOOKING</span>
              <h2 className="modal-title">{vehicle.name}</h2>
              <p className="modal-subtitle">
                Booking request • Confirmation subject to availability
              </p>
            </div>

            <div className="modal-grid">
              <div className="modal-vehicle-preview">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="modal-vehicle-img"
                />

                <div className="modal-vehicle-meta">
                  <span>
                    <strong>Fuel:</strong> {vehicle.fuel || vehicle.fuelType || 'Petrol'}
                  </span>
                  <span>
                    <strong>Rate:</strong> ₹{hourlyRate}/hour
                  </span>
                </div>
              </div>

              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="modal-form-group">
                  <label>
                    <MapPin size={15} /> Pickup Location
                  </label>

                  <select
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    required
                  >
                    <option value="Mumbai">Mumbai - Bandra / Airport</option>
                    <option value="Delhi">Delhi - Connaught Place</option>
                    <option value="Bangalore">Bangalore - Indiranagar</option>
                    <option value="Pune">Pune - Koregaon Park</option>
                    <option value="Goa">Goa - Panaji / Airport</option>
                    <option value="Hyderabad">Hyderabad - Hitec City</option>
                  </select>
                </div>

                <div className="modal-form-row">
                  <div className="modal-form-group">
                    <label>
                      <Clock size={15} /> Duration
                    </label>

                    <select
                      value={hours}
                      onChange={(e) => setHours(Number(e.target.value))}
                    >
                      <option value={1}>1 Hour</option>
                      <option value={2}>2 Hours</option>
                      <option value={4}>4 Hours (Half Day)</option>
                      <option value={8}>8 Hours</option>
                      <option value={24}>24 Hours (Full Day)</option>
                    </select>
                  </div>

                  <div className="modal-form-group">
                    <label>
                      <Calendar size={15} /> Start Time
                    </label>

                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                        .toISOString()
                        .slice(0, 16)}
                      required
                    />
                  </div>
                </div>

                <div className="modal-form-row">
                  <div className="modal-form-group">
                    <label>Your Name</label>

                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="modal-form-group">
                    <label>Mobile Number</label>

                    <input
                      type="tel"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="modal-pricing-box">
                  <div className="modal-pricing-row">
                    <span>
                      Base Fare ({hours} hrs @ ₹{hourlyRate})
                    </span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="modal-pricing-row">
                    <span>Taxes &amp; Insurance (12%)</span>
                    <span>₹{taxes}</span>
                  </div>

                  <div className="modal-pricing-total">
                    <span>Total Amount</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <div className="modal-protection-note">
                  <ShieldCheck size={18} color="#0D9488" />
                  <span>
                    Booking and insurance terms are subject to confirmation.
                  </span>
                </div>

                {error && (
                  <p style={{ color: 'red', marginBottom: '12px' }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="modal-submit-btn"
                  disabled={loading}
                >
                  <CreditCard size={18} />
                  <span>
                    {loading
                      ? 'Processing...'
                      : `Confirm & Reserve Now (₹${total})`}
                  </span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="modal-success-screen">
            <CheckCircle
              size={60}
              color="#10B981"
              className="modal-success-icon"
            />

            <h2>Booking Request Submitted!</h2>

            <p className="modal-success-text">
              Your ride <strong>{vehicle.name}</strong> has been submitted
              for booking at <strong>{pickupCity}</strong> for{' '}
              <strong>{hours} hours</strong>.
            </p>

            <p className="modal-instructions">
              You will receive booking confirmation after the booking
              is successfully processed.
            </p>

            <button
              type="button"
              className="btn-app"
              onClick={onClose}
              style={{ marginTop: '20px' }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
