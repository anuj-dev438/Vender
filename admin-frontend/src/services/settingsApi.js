import { apiClient } from './client.js';

export const settingsApi = {
  /**
   * List global platform settings: GET /api/v1/admin/settings
   */
  async list(params = {}) {
    return apiClient.get('/admin/settings', params);
  },

  /**
   * Get specific setting by key: GET /api/v1/admin/settings/:key
   */
  async getByKey(key) {
    return apiClient.get(`/admin/settings/${key}`);
  },

  /**
   * Update setting by key: PUT /api/v1/admin/settings/:key
   */
  async update(key, data) {
    return apiClient.put(`/admin/settings/${key}`, data);
  },

  /**
   * Bulk update settings: POST /api/v1/admin/settings/bulk-update
   * Body: { settings: [{ key, value, valueType, description }] }
   */
  async bulkUpdate(settingsArray) {
    return apiClient.post('/admin/settings/bulk-update', { settings: settingsArray });
  },

  // --- Commission Rules (80/20 commercial split) ---
  /**
   * List platform commission rules: GET /api/v1/admin/settings/commission-rules
   */
  async listCommissionRules(params = {}) {
    return apiClient.get('/admin/settings/commission-rules', params);
  },

  /**
   * Create commission rule: POST /api/v1/admin/settings/commission-rules
   */
  async createCommissionRule(data) {
    return apiClient.post('/admin/settings/commission-rules', data);
  },

  /**
   * Update commission rule: PUT /api/v1/admin/settings/commission-rules/:key
   */
  async updateCommissionRule(key, data) {
    return apiClient.put(`/admin/settings/commission-rules/${key}`, data);
  },

  // --- Feature Flags ---
  /**
   * List feature flags: GET /api/v1/admin/settings/feature-flags
   */
  async listFeatureFlags(params = {}) {
    return apiClient.get('/admin/settings/feature-flags', params);
  },

  /**
   * Toggle feature flag: PATCH /api/v1/admin/settings/feature-flags/:key/toggle
   */
  async toggleFeatureFlag(key, { enabled, environment = 'production' }) {
    return apiClient.patch(`/admin/settings/feature-flags/${key}/toggle`, { enabled, environment });
  },
};
