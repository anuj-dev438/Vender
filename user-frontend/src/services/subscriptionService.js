import { apiClient } from './apiClient';

export const subscriptionService = {
  /**
   * GET /api/v1/subscriptions/plans
   * View all active membership subscription plans
   */
  async getActivePlans(params = {}) {
    const res = await apiClient.get('/subscriptions/plans', params);
    return res.data || [];
  },

  /**
   * GET /api/v1/subscriptions/plans/:id
   * Get specific plan details
   */
  async getPlanById(id) {
    const res = await apiClient.get(`/subscriptions/plans/${id}`);
    return res.data;
  },

  /**
   * GET /api/v1/subscriptions/my-subscription
   * Get current authenticated user's active subscription
   */
  async getMySubscription() {
    const res = await apiClient.get('/subscriptions/my-subscription');
    return res.data;
  },

  /**
   * POST /api/v1/subscriptions/create-order
   * Create Razorpay payment order for subscription
   */
  async createOrder({ planId, autoRenew = false }) {
    const res = await apiClient.post('/subscriptions/create-order', {
      planId,
      autoRenew,
    });
    return res.data;
  },

  /**
   * POST /api/v1/subscriptions/verify-payment
   * Verify Razorpay payment and activate subscription
   */
  async verifyPayment({ orderId, paymentId, signature }) {
    const res = await apiClient.post('/subscriptions/verify-payment', {
      orderId,
      paymentId,
      signature,
    });
    return res.data;
  },

  /**
   * POST /api/v1/subscriptions/:id/cancel
   * Cancel subscription
   */
  async cancelSubscription(id, { reason = 'Cancelled by customer' } = {}) {
    const res = await apiClient.post(`/subscriptions/${id}/cancel`, { reason });
    return res.data;
  },
};
