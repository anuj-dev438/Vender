import { apiClient } from './client.js';

export const auditApi = {
  /**
   * List audit logs: GET /api/v1/admin/audit
   */
  async getAuditLogs(params = {}) {
    return apiClient.get('/admin/audit', params);
  },

  /**
   * Get audit log details by ID: GET /api/v1/admin/audit/:id
   */
  async getById(id) {
    return apiClient.get(`/admin/audit/${id}`);
  },

  /**
   * Export audit logs: GET /api/v1/admin/audit/export
   */
  async exportLogs(params = {}) {
    return apiClient.get('/admin/audit/export', params);
  },
};
