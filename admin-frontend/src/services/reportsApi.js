import { apiClient } from './client.js';

export const reportsApi = {
  /**
   * Bookings report: GET /api/v1/admin/reports/bookings
   */
  async getBookingsReport(params = {}) {
    return apiClient.get('/admin/reports/bookings', params);
  },

  /**
   * Revenue report: GET /api/v1/admin/reports/revenue
   */
  async getRevenueReport(params = {}) {
    return apiClient.get('/admin/reports/revenue', params);
  },

  /**
   * Vehicles report: GET /api/v1/admin/reports/vehicles
   */
  async getVehiclesReport(params = {}) {
    return apiClient.get('/admin/reports/vehicles', params);
  },

  /**
   * Users report: GET /api/v1/admin/reports/users
   */
  async getUsersReport(params = {}) {
    return apiClient.get('/admin/reports/users', params);
  },

  /**
   * KYC report: GET /api/v1/admin/reports/kyc
   */
  async getKycReport(params = {}) {
    return apiClient.get('/admin/reports/kyc', params);
  },

  /**
   * Payouts report: GET /api/v1/admin/reports/payouts
   */
  async getPayoutsReport(params = {}) {
    return apiClient.get('/admin/reports/payouts', params);
  },

  /**
   * Export report CSV: GET /api/v1/admin/reports/export
   */
  async exportReport(params = {}) {
    return apiClient.get('/admin/reports/export', params);
  },

  // Backwards compatibility alias
  async getReports(params = {}) {
    return this.getRevenueReport(params);
  },
};
