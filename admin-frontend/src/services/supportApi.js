import { apiClient } from './client.js';

export const supportApi = {
  // --- Support Tickets ---
  /**
   * List support tickets: GET /api/v1/admin/support
   */
  async listTickets(params = {}) {
    return apiClient.get('/admin/support', params);
  },

  async getTickets(params = {}) {
    return this.listTickets(params);
  },

  async getSupportTickets(params = {}) {
    return this.listTickets(params);
  },

  /**
   * Get ticket details: GET /api/v1/admin/support/:ticketId
   */
  async getTicketById(ticketId) {
    return apiClient.get(`/admin/support/${ticketId}`);
  },

  /**
   * Assign support ticket to admin: POST /api/v1/admin/support/:ticketId/assign
   */
  async assignTicket(ticketId, { assignedTo }) {
    return apiClient.post(`/admin/support/${ticketId}/assign`, { assignedTo });
  },

  /**
   * Post response/message to ticket: POST /api/v1/admin/support/:ticketId/respond
   */
  async respondToTicket(ticketId, { message, isInternal = false }) {
    return apiClient.post(`/admin/support/${ticketId}/respond`, { message, isInternal });
  },

  /**
   * Update ticket status (OPEN, IN_PROGRESS, RESOLVED, CLOSED): PATCH /api/v1/admin/support/:ticketId/status
   */
  async updateTicketStatus(ticketId, { status, notes }) {
    return apiClient.patch(`/admin/support/${ticketId}/status`, { status, notes });
  },

  // --- Disputes & Claims ---
  /**
   * List customer/owner rental disputes: GET /api/v1/admin/support/disputes
   */
  async listDisputes(params = {}) {
    return apiClient.get('/admin/support/disputes', params);
  },

  /**
   * Get dispute details: GET /api/v1/admin/support/disputes/:disputeId
   */
  async getDisputeById(disputeId) {
    return apiClient.get(`/admin/support/disputes/${disputeId}`);
  },

  /**
   * Mediate dispute: POST /api/v1/admin/support/disputes/:disputeId/mediate
   */
  async mediateDispute(disputeId, { resolution, notes }) {
    return apiClient.post(`/admin/support/disputes/${disputeId}/mediate`, { resolution, notes });
  },

  /**
   * Resolve dispute: POST /api/v1/admin/support/disputes/:disputeId/resolve
   */
  async resolveDispute(disputeId, { resolution, outcome }) {
    return apiClient.post(`/admin/support/disputes/${disputeId}/resolve`, { resolution, outcome });
  },
};
