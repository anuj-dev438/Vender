import { apiClient } from './client.js';

export const kycApi = {
  /**
   * List pending KYC applications: GET /api/v1/admin/kyc/pending
   */
  async listPending(params = {}) {
    return apiClient.get('/admin/kyc/pending', params);
  },

  /**
   * Get specific KYC details by submission ID: GET /api/v1/admin/kyc/:id
   */
  async getById(id) {
    return apiClient.get(`/admin/kyc/${id}`);
  },

  /**
   * Verify/approve/reject overall KYC submission: PATCH /api/v1/admin/kyc/:id/verify
   * Body: { status: 'VERIFIED' | 'REJECTED', rejectionReason?: string, approvedCategories?: string[] }
   */
  async verifyKyc(id, { status, rejectionReason, approvedCategories }) {
    return apiClient.patch(`/admin/kyc/${id}/verify`, { status, rejectionReason, approvedCategories });
  },

  async approveKyc(id, { approvedCategories = ['LMV', 'MCWG'] } = {}) {
    return this.verifyKyc(id, { status: 'VERIFIED', approvedCategories });
  },

  async rejectKyc(id, { reason } = {}) {
    return this.verifyKyc(id, { status: 'REJECTED', rejectionReason: reason });
  },

  /**
   * Verify customer live selfie: PATCH /api/v1/admin/kyc/:id/selfie/verify
   * Body: { status: 'VERIFIED' | 'REJECTED', rejectionReason?: string, notes?: string }
   */
  async verifySelfie(id, { status, rejectionReason, notes }) {
    return apiClient.patch(`/admin/kyc/${id}/selfie/verify`, { status, rejectionReason, notes });
  },

  /**
   * Verify individual KYC document: PATCH /api/v1/admin/kyc/:id/documents/:docId/verify
   * Body: { status: 'VERIFIED' | 'REJECTED', rejectionReason?: string }
   */
  async verifyDocument(id, docId, { status, rejectionReason }) {
    return apiClient.patch(`/admin/kyc/${id}/documents/${docId}/verify`, { status, rejectionReason });
  },
};
