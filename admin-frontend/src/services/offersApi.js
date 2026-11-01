import { apiClient } from './client.js';

export const offersApi = {
  /**
   * List promo codes & discounts: GET /api/v1/admin/offers
   */
  async list(params = {}) {
    return apiClient.get('/admin/offers', params);
  },

  async getOffers(params = {}) {
    return this.list(params);
  },

  /**
   * Overall offer coupon performance statistics: GET /api/v1/admin/offers/stats/overview
   */
  async getStats() {
    return apiClient.get('/admin/offers/stats/overview');
  },

  async getOverviewStats() {
    return this.getStats();
  },

  /**
   * Get single offer coupon by ID: GET /api/v1/admin/offers/:id
   */
  async getById(id) {
    return apiClient.get(`/admin/offers/${id}`);
  },

  /**
   * Create discount offer / coupon: POST /api/v1/admin/offers
   */
  async create(data) {
    return apiClient.post('/admin/offers', data);
  },

  /**
   * Update discount offer: PATCH /api/v1/admin/offers/:id
   */
  async update(id, data) {
    return apiClient.patch(`/admin/offers/${id}`, data);
  },

  /**
   * Delete offer coupon: DELETE /api/v1/admin/offers/:id
   */
  async delete(id) {
    return apiClient.delete(`/admin/offers/${id}`);
  },

  /**
   * Toggle active/paused state: POST /api/v1/admin/offers/:id/toggle
   */
  async toggleActive(id) {
    return apiClient.post(`/admin/offers/${id}/toggle`);
  },

  /**
   * Get usage breakdown: GET /api/v1/admin/offers/:id/usage
   */
  async getUsageStats(id) {
    return apiClient.get(`/admin/offers/${id}/usage`);
  },
};
