import { apiClient } from './client.js';

export const bannersApi = {
  /**
   * List promotional banners: GET /api/v1/admin/banners
   */
  async list(params = {}) {
    return apiClient.get('/admin/banners', params);
  },

  async getBanners(params = {}) {
    return this.list(params);
  },

  /**
   * Banner engagement & display statistics: GET /api/v1/admin/banners/stats
   */
  async getStats() {
    return apiClient.get('/admin/banners/stats');
  },

  /**
   * Get banner by ID: GET /api/v1/admin/banners/:id
   */
  async getById(id) {
    return apiClient.get(`/admin/banners/${id}`);
  },

  /**
   * Create promotional banner: POST /api/v1/admin/banners
   * Body: { title, subtitle, imageUrl, targetUrl, position: 'HOME_HERO'|'HOME_CAROUSEL'|'SEARCH_PAGE'|'OFFERS_PAGE'|'POPUP', sortOrder, isActive, startDate, endDate }
   */
  async create(data) {
    return apiClient.post('/admin/banners', data);
  },

  /**
   * Update banner: PATCH /api/v1/admin/banners/:id
   */
  async update(id, data) {
    return apiClient.patch(`/admin/banners/${id}`, data);
  },

  /**
   * Delete banner: DELETE /api/v1/admin/banners/:id
   */
  async delete(id) {
    return apiClient.delete(`/admin/banners/${id}`);
  },
};
