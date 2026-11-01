import { apiClient } from './apiClient';

export const reviewService = {
  /**
   * POST /api/v1/rentals/:bookingId/reviews
   * Submit a rating and review for a completed rental
   */
  async submitReview(bookingId, { rating, title, comment }) {
    const res = await apiClient.post(`/rentals/${bookingId}/reviews`, {
      rating: Number(rating),
      title: title || undefined,
      comment: comment || undefined,
    });
    return res.data;
  },

  /**
   * GET /api/v1/rentals/:bookingId/reviews
   * Get review submitted for a specific booking
   */
  async getBookingReview(bookingId) {
    const res = await apiClient.get(`/rentals/${bookingId}/reviews`);
    return res.data;
  },

  /**
   * GET /api/v1/vehicles/:vehicleId/reviews
   * Public: List all verified reviews & rating breakdown for a vehicle
   */
  async getVehicleReviews(vehicleId, params = {}) {
    const res = await apiClient.get(`/vehicles/${vehicleId}/reviews`, params);
    return res.data || { reviews: [], total: 0, averageRating: 5 };
  },
};
