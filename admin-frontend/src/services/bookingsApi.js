import { apiClient } from './client.js';

export const bookingsApi = {
  /**
   * List all bookings with pagination & status filters: GET /api/v1/admin/bookings
   */
  async list(params = {}) {
    return apiClient.get('/admin/bookings', params);
  },

  async getBookings(params = {}) {
    return this.list(params);
  },

  /**
   * Booking statistics overview: GET /api/v1/admin/bookings/stats/overview
   */
  async getStats(params = {}) {
    return apiClient.get('/admin/bookings/stats/overview', params);
  },

  /**
   * Get booking details by ID: GET /api/v1/admin/bookings/:id
   */
  async getById(id) {
    return apiClient.get(`/admin/bookings/${id}`);
  },

  /**
   * Cancel booking by admin: POST /api/v1/admin/bookings/:id/cancel
   */
  async cancel(id, { reason, refundAmount }) {
    return apiClient.post(`/admin/bookings/${id}/cancel`, { reason, refundAmount });
  },

  /**
   * Process refund for booking: POST /api/v1/admin/bookings/:id/refund
   */
  async processRefund(id, { amount, refundType = 'FULL_REFUND', notes }) {
    return apiClient.post(`/admin/bookings/${id}/refund`, { amount, refundType, notes });
  },

  /**
   * Financial report aggregate: POST /api/v1/admin/bookings/financial-report
   */
  async getFinancialReport({ startDate, endDate, groupBy = 'month' }) {
    return apiClient.post('/admin/bookings/financial-report', { startDate, endDate, groupBy });
  },

  /**
   * List vehicle owner payouts: GET /api/v1/admin/bookings/payouts
   */
  async listPayouts(params = {}) {
    return apiClient.get('/admin/bookings/payouts', params);
  },

  /**
   * Get specific payout details: GET /api/v1/admin/bookings/payouts/:payoutId
   */
  async getPayoutDetails(payoutId) {
    return apiClient.get(`/admin/bookings/payouts/${payoutId}`);
  },

  /**
   * Process payout to owner: POST /api/v1/admin/bookings/payouts/:payoutId/process
   */
  async processPayout(payoutId, { method = 'BANK_TRANSFER', transactionReference }) {
    return apiClient.post(`/admin/bookings/payouts/${payoutId}/process`, {
      method,
      transactionReference,
    });
  },

  /**
   * Ledger audit trail: GET /api/v1/admin/bookings/ledger/audit
   */
  async getLedgerAudit(params = {}) {
    return apiClient.get('/admin/bookings/ledger/audit', params);
  },

  /**
   * Reconcile payment status: POST /api/v1/admin/bookings/payments/:id/reconcile
   */
  async reconcilePayment(id, { action, notes }) {
    return apiClient.post(`/admin/bookings/payments/${id}/reconcile`, { action, notes });
  },
};
