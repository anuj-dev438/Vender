import { apiClient } from './apiClient';

export const paymentService = {
  /**
   * POST /api/v1/payments/create-order
   * Generate Razorpay Order for a PAYMENT_PENDING booking
   */
  async createOrder(bookingId) {
    const res = await apiClient.post('/payments/create-order', { bookingId });
    return res.data;
  },

  /**
   * POST /api/v1/payments/verify
   * Verify Razorpay payment signature & confirm booking
   */
  async verifyPayment({ bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    const res = await apiClient.post('/payments/verify', {
      bookingId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });
    return res.data;
  },

  /**
   * GET /api/v1/payments/booking/:bookingId
   * Retrieve financial status and transactions for a booking
   */
  async getByBookingId(bookingId) {
    const res = await apiClient.get(`/payments/booking/${bookingId}`);
    return res.data;
  },

  /**
   * GET /api/v1/payments/:id
   * Retrieve specific payment details
   */
  async getById(paymentId) {
    const res = await apiClient.get(`/payments/${paymentId}`);
    return res.data;
  },
};
