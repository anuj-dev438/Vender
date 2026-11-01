import { apiClient } from './client.js';

export const dashboardApi = {
  /**
   * Top-level summary metrics: GET /api/v1/admin/dashboard/metrics
   */
  async getMetrics() {
    return apiClient.get('/admin/dashboard/metrics');
  },

  /**
   * Detailed stats by date range: GET /api/v1/admin/dashboard/stats
   */
  async getStats(params = {}) {
    return apiClient.get('/admin/dashboard/stats', params);
  },

  /**
   * Revenue analytics by period: GET /api/v1/admin/dashboard/revenue?period=daily|weekly|monthly
   */
  async getRevenue(period = 'daily') {
    return apiClient.get('/admin/dashboard/revenue', { period });
  },

  /**
   * Booking trends over days: GET /api/v1/admin/dashboard/trends?days=7|30
   */
  async getTrends(days = 7) {
    return apiClient.get('/admin/dashboard/trends', { days });
  },

  /**
   * Fleet vehicle utilization: GET /api/v1/admin/dashboard/utilization
   */
  async getUtilization() {
    return apiClient.get('/admin/dashboard/utilization');
  },

  /**
   * Top performing vehicles: GET /api/v1/admin/dashboard/top-vehicles?limit=5
   */
  async getTopVehicles(limit = 5) {
    return apiClient.get('/admin/dashboard/top-vehicles', { limit });
  },

  /**
   * Recent system activity: GET /api/v1/admin/dashboard/activity?limit=10
   */
  async getActivity(limit = 10) {
    return apiClient.get('/admin/dashboard/activity', { limit });
  },
};
