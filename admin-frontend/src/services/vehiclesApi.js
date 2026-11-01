import { apiClient } from './client.js';

export const vehiclesApi = {
  /**
   * List all vehicles with filters & pagination: GET /api/v1/admin/vehicles
   */
  async list(params = {}) {
    return apiClient.get('/admin/vehicles', params);
  },

  /**
   * List pending vehicle verification queue: GET /api/v1/admin/vehicles/pending
   */
  async listPending(params = {}) {
    return apiClient.get('/admin/vehicles/pending', params);
  },

  /**
   * Vehicle fleet statistics: GET /api/v1/admin/vehicles/stats
   */
  async getStats() {
    return apiClient.get('/admin/vehicles/stats');
  },

  /**
   * Vehicle details by ID: GET /api/v1/admin/vehicles/:id
   */
  async getById(id) {
    return apiClient.get(`/admin/vehicles/${id}`);
  },

  /**
   * Admin verify vehicle (APPROVE / REJECT): POST /api/v1/admin/vehicles/:id/verify
   */
  async verify(id, { action, notes, rejectionReason }) {
    return apiClient.post(`/admin/vehicles/${id}/verify`, {
      action,
      notes,
      rejectionReason,
    });
  },

  /**
   * Update vehicle status (AVAILABLE, MAINTENANCE, SUSPENDED): PATCH /api/v1/admin/vehicles/:id/status
   */
  async updateStatus(id, { status, reason }) {
    return apiClient.patch(`/admin/vehicles/${id}/status`, { status, reason });
  },

  /**
   * Vehicle revenue history: GET /api/v1/admin/vehicles/:id/revenue
   */
  async getRevenue(id) {
    return apiClient.get(`/admin/vehicles/${id}/revenue`);
  },

  /**
   * Bulk approve vehicles: POST /api/v1/admin/vehicles/bulk-approve
   */
  async bulkApprove({ vehicleIds }) {
    return apiClient.post('/admin/vehicles/bulk-approve', { vehicleIds });
  },

  /**
   * Bulk suspend vehicles: POST /api/v1/admin/vehicles/bulk-suspend
   */
  async bulkSuspend({ vehicleIds, reason }) {
    return apiClient.post('/admin/vehicles/bulk-suspend', { vehicleIds, reason });
  },

  /**
   * Approve vehicle compliance document: POST /api/v1/admin/vehicles/:id/documents/:documentId/approve
   */
  async approveDocument(id, documentId, { notes } = {}) {
    return apiClient.post(`/admin/vehicles/${id}/documents/${documentId}/approve`, { notes });
  },

  /**
   * Reject vehicle compliance document: POST /api/v1/admin/vehicles/:id/documents/:documentId/reject
   */
  async rejectDocument(id, documentId, { reason }) {
    return apiClient.post(`/admin/vehicles/${id}/documents/${documentId}/reject`, { reason });
  },

  /**
   * Create new vehicle listing (Host / Fleet Onboarding): POST /api/v1/vehicles
   */
  async create(data) {
    return apiClient.post('/vehicles', data);
  },

  // Aliases for component convenience
  async getVehicles(params = {}) {
    return this.list(params);
  },

  async createVehicle(data) {
    return this.create(data);
  },

  async updateVehicleStatus(id, data) {
    return this.updateStatus(id, data);
  },

  async delete(id) {
    return apiClient.patch(`/admin/vehicles/${id}/status`, { status: 'INACTIVE', reason: 'Deleted by admin' });
  },

  async deleteVehicle(id) {
    return this.delete(id);
  },

  async uploadPhotos(id, photos) {
    return apiClient.post(`/vehicles/${id}/photos`, { photos });
  },

  async uploadDocument(id, docData) {
    return apiClient.post(`/vehicles/${id}/documents`, docData);
  },
};
