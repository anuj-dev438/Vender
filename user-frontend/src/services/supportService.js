import { apiClient } from './apiClient';

export const supportService = {
  /**
   * POST /api/v1/support/tickets
   * Create a new support ticket
   */
  async createTicket({ category, subject, description, bookingId, vehicleId, priority = 'MEDIUM' }) {
    const res = await apiClient.post('/support/tickets', {
      category,
      subject,
      description,
      bookingId: bookingId || undefined,
      vehicleId: vehicleId || undefined,
      priority,
    });
    return res.data;
  },

  /**
   * GET /api/v1/support/tickets
   * List tickets created by user
   */
  async getMyTickets(params = {}) {
    const res = await apiClient.get('/support/tickets', params);
    return res.data || [];
  },

  /**
   * GET /api/v1/support/tickets/:id
   * Get ticket details with message thread
   */
  async getTicketDetails(id) {
    const res = await apiClient.get(`/support/tickets/${id}`);
    return res.data;
  },

  /**
   * POST /api/v1/support/tickets/:id/messages
   * Reply to a support ticket
   */
  async addTicketMessage(id, { message }) {
    const res = await apiClient.post(`/support/tickets/${id}/messages`, { message });
    return res.data;
  },

  /**
   * POST /api/v1/rentals/:bookingId/disputes
   * Raise a formal dispute for a rental booking
   */
  async raiseDispute(bookingId, { disputeType, title, description }) {
    const res = await apiClient.post(`/rentals/${bookingId}/disputes`, {
      disputeType,
      title,
      description,
    });
    return res.data;
  },

  /**
   * GET /api/v1/disputes
   * List user's disputes
   */
  async getMyDisputes() {
    const res = await apiClient.get('/disputes');
    return res.data || [];
  },

  /**
   * GET /api/v1/disputes/:id
   * Get dispute details and mediation thread
   */
  async getDisputeDetails(id) {
    const res = await apiClient.get(`/disputes/${id}`);
    return res.data;
  },

  /**
   * POST /api/v1/disputes/:id/messages
   * Send message in dispute mediation thread
   */
  async addDisputeMessage(id, { message }) {
    const res = await apiClient.post(`/disputes/${id}/messages`, { message });
    return res.data;
  },
};
