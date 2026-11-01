import { apiClient } from './client.js';

export const subscriptionsApi = {
  // --- Plans ---
  /**
   * List all subscription plans: GET /api/v1/admin/subscriptions/plans
   */
  async listPlans(params = {}) {
    return apiClient.get('/admin/subscriptions/plans', params);
  },

  /**
   * Subscription plan statistics: GET /api/v1/admin/subscriptions/plans/stats/overview
   */
  async getPlanStats() {
    return apiClient.get('/admin/subscriptions/plans/stats/overview');
  },

  /**
   * Get single plan by ID: GET /api/v1/admin/subscriptions/plans/:id
   */
  async getPlanById(id) {
    return apiClient.get(`/admin/subscriptions/plans/${id}`);
  },

  /**
   * Create new subscription plan: POST /api/v1/admin/subscriptions/plans
   */
  async createPlan(data) {
    return apiClient.post('/admin/subscriptions/plans', data);
  },

  /**
   * Update subscription plan: PATCH /api/v1/admin/subscriptions/plans/:id
   */
  async updatePlan(id, data) {
    return apiClient.patch(`/admin/subscriptions/plans/${id}`, data);
  },

  /**
   * Delete subscription plan: DELETE /api/v1/admin/subscriptions/plans/:id
   */
  async deletePlan(id) {
    return apiClient.delete(`/admin/subscriptions/plans/${id}`);
  },

  // --- Member Subscriptions ---
  /**
   * List user active/past subscriptions: GET /api/v1/admin/subscriptions
   */
  async listSubscriptions(params = {}) {
    return apiClient.get('/admin/subscriptions', params);
  },

  async getSubscriptions(params = {}) {
    return this.listSubscriptions(params);
  },

  /**
   * Subscriber overall stats: GET /api/v1/admin/subscriptions/stats/overview
   */
  async getSubscriptionStats() {
    return apiClient.get('/admin/subscriptions/stats/overview');
  },

  /**
   * Get subscription details by ID: GET /api/v1/admin/subscriptions/:id
   */
  async getSubscriptionById(id) {
    return apiClient.get(`/admin/subscriptions/${id}`);
  },

  /**
   * Cancel user subscription: POST /api/v1/admin/subscriptions/:id/cancel
   */
  async cancelSubscription(id, { reason }) {
    return apiClient.post(`/admin/subscriptions/${id}/cancel`, { reason });
  },

  /**
   * Extend user subscription days: POST /api/v1/admin/subscriptions/:id/extend
   */
  async extendSubscription(id, { daysToExtend, reason }) {
    return apiClient.post(`/admin/subscriptions/${id}/extend`, { daysToExtend, reason });
  },
};
