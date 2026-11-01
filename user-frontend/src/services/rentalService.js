import { apiClient, BASE_URL, getStoredToken } from './apiClient';

export const rentalService = {
  /**
   * GET /api/v1/rentals/:bookingId
   * Retrieve full rental session, inspections, and settlement details
   */
  async getDetails(bookingId) {
    const res = await apiClient.get(`/rentals/${bookingId}`);
    return res.data;
  },

  /**
   * POST /api/v1/rentals/:bookingId/pickup
   * Submit Pickup Inspection: odometer, fuel %, at least 6 photos
   */
  async submitPickupInspection(bookingId, { odometerReading, fuelLevel, batteryLevel, photos, notes }) {
    const res = await apiClient.post(`/rentals/${bookingId}/pickup`, {
      odometerReading: Number(odometerReading),
      fuelLevel: Number(fuelLevel),
      batteryLevel: batteryLevel ? Number(batteryLevel) : undefined,
      photos: Array.isArray(photos) ? photos : [],
      notes: notes || undefined,
    });
    return res.data;
  },

  /**
   * POST /api/v1/rentals/:bookingId/return
   * Submit Return Inspection: odometer, fuel %, photos, damages
   */
  async submitReturnInspection(bookingId, { odometerReading, fuelLevel, batteryLevel, photos, damages, notes }) {
    const res = await apiClient.post(`/rentals/${bookingId}/return`, {
      odometerReading: Number(odometerReading),
      fuelLevel: Number(fuelLevel),
      batteryLevel: batteryLevel ? Number(batteryLevel) : undefined,
      photos: Array.isArray(photos) ? photos : undefined,
      damages: Array.isArray(damages) ? damages : undefined,
      notes: notes || undefined,
    });
    return res.data;
  },

  /**
   * GET /api/v1/rentals/:bookingId/gps/latest
   * Get latest recorded GPS coordinate for the rental vehicle
   */
  async getLatestGps(bookingId) {
    const res = await apiClient.get(`/rentals/${bookingId}/gps/latest`);
    return res.data;
  },

  /**
   * GET /api/v1/rentals/:bookingId/gps/history
   * Get GPS path history
   */
  async getGpsHistory(bookingId, params = {}) {
    const res = await apiClient.get(`/rentals/${bookingId}/gps/history`, params);
    return res.data || [];
  },

  /**
   * Connect to WebSocket for real-time live GPS tracking
   * Endpoint: ws://localhost:4000/api/v1/rentals/:bookingId/track
   */
  connectLiveTracking(bookingId, onLocationUpdate, onError) {
    const token = getStoredToken();
    if (!token) {
      if (onError) onError(new Error('User is not authenticated for live tracking'));
      return null;
    }

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    let wsHost = 'localhost:4000';
    try {
      if (BASE_URL.startsWith('http')) {
        const u = new URL(BASE_URL);
        wsHost = u.host;
      } else {
        wsHost = window.location.host;
      }
    } catch {
      wsHost = 'localhost:4000';
    }

    const wsUrl = `${wsProtocol}//${wsHost}/api/v1/rentals/${bookingId}/track`;
    let socket = null;
    let isClosed = false;

    try {
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        // Handshake protocol: Send AUTH with token
        socket.send(JSON.stringify({ type: 'AUTH', token }));
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'LOCATION_UPDATE' && message.data) {
            onLocationUpdate(message.data);
          } else if (message.type === 'ERROR') {
            console.warn('[LiveTracking WS] Server Error:', message.message);
            if (onError) onError(new Error(message.message));
          }
        } catch (e) {
          console.error('[LiveTracking WS] Message parse error:', e);
        }
      };

      socket.onerror = (err) => {
        console.warn('[LiveTracking WS] Socket connection error:', err);
        if (onError) onError(err);
      };

      socket.onclose = () => {
        if (!isClosed) {
          // Socket closed
        }
      };
    } catch (err) {
      console.warn('Failed to initialize WebSocket tracking:', err);
      if (onError) onError(err);
    }

    return () => {
      isClosed = true;
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  },
};
