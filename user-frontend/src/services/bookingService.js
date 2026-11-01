
import { apiClient } from './apiClient';

export const bookingService = {
  calculateFareQuote(hourlyRate, startAt, endAt, deposit = 3000) {
    const start = new Date(startAt);
    const end = new Date(endAt);

    const diffMs = end.getTime() - start.getTime();

    const rentalHours = Math.max(
      1,
      Math.ceil(diffMs / (1000 * 60 * 60))
    );

    const rate = Number(hourlyRate) || 99;
    const baseRentalAmount = rentalHours * rate;
    const platformFee = 99;
    const taxAmount = Math.round(
      (baseRentalAmount + platformFee) * 0.18 * 100
    ) / 100;

    const totalPayable =
      baseRentalAmount + platformFee + taxAmount;

    const securityDeposit = Number(deposit) || 3000;

    return {
      rentalHours,
      hourlyRate: rate,
      baseRentalAmount,
      platformFee,
      taxAmount,
      totalPayable,
      securityDeposit,
      grandTotal: totalPayable + securityDeposit,
    };
  },

  async createBooking(bookingData) {
    if (!bookingData) {
      throw new Error('Booking data is required.');
    }

    // Preserve the original database vehicle ID.
    const rawVehicleId = bookingData.vehicleId;

    if (
      rawVehicleId === undefined ||
      rawVehicleId === null ||
      String(rawVehicleId).trim() === ''
    ) {
      throw new Error('Vehicle ID is missing.');
    }

    const startDate = new Date(bookingData.startAt);
    const endDate = new Date(bookingData.endAt);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      throw new Error('Invalid booking dates.');
    }

    if (endDate <= startDate) {
      throw new Error('End time must be after start time.');
    }

    const payload = {
      vehicleId: String(rawVehicleId),
      startAt: startDate.toISOString(),
      endAt: endDate.toISOString(),
      planType: bookingData.planType || 'PAY_AS_YOU_GO',
    };

    if (bookingData.couponCode) {
      payload.couponCode = bookingData.couponCode;
    }

    if (bookingData.pickupLocationId) {
      payload.pickupLocationId = bookingData.pickupLocationId;
    }

    if (bookingData.returnLocationId) {
      payload.returnLocationId = bookingData.returnLocationId;
    }

    console.log('Final booking payload:', payload);
    console.log('Vehicle ID:', payload.vehicleId);
    console.log('Vehicle ID type:', typeof payload.vehicleId);

    const res = await apiClient.post('/bookings', payload);

    return res.data;
  },

  async getBookings() {
    const res = await apiClient.get('/bookings');
    return res.data || [];
  },

  async getBookingById(id) {
    const res = await apiClient.get(`/bookings/${id}`);
    return res.data;
  },

  async getCancellationQuote(id) {
    const res = await apiClient.get(
      `/bookings/${id}/cancellation-quote`
    );
    return res.data;
  },

  async cancelBooking(
    id,
    {
      reason = 'Plans changed',
      reasonCode = 'CUSTOMER_REQUEST',
    } = {}
  ) {
    const res = await apiClient.post(
      `/bookings/${id}/cancel`,
      { reason, reasonCode }
    );

    return res.data;
  },

  async requestExtension(id, { newEndAt }) {
    const res = await apiClient.post(
      `/bookings/${id}/request-extension`,
      {
        newEndAt: new Date(newEndAt).toISOString(),
      }
    );

    return res.data;
  },

  async verifyExtensionPayment({
    extensionId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  }) {
    const res = await apiClient.post(
      '/bookings/extensions/verify-payment',
      {
        extensionId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      }
    );

    return res.data;
  },

  async getExtension(extensionId) {
    const res = await apiClient.get(
      `/bookings/extensions/${extensionId}`
    );

    return res.data;
  },
};
