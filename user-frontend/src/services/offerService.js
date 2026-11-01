import { apiClient } from './apiClient';

export const offerService = {
  /**
   * GET /api/v1/offers
   * Get active promotional offers and discounts
   */
  async getActiveOffers(params = {}) {
    const res = await apiClient.get('/offers', params);
    return res.data || [];
  },

  /**
   * POST /api/v1/coupons/validate
   * Validate coupon code against vehicle and cart total
   */
  async validateCoupon({ code, vehicleId, planType = 'PAY_AS_YOU_GO', subtotal }) {
    const res = await apiClient.post('/coupons/validate', {
      code: String(code).trim().toUpperCase(),
      vehicleId,
      planType,
      subtotal: Number(subtotal),
    });
    return res.data;
  },
};
