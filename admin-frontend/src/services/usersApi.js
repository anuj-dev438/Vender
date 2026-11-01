import { apiClient } from './client.js';

export const usersApi = {
  /**
   * List users with filtering & pagination: GET /api/v1/admin/users
   * Params: { page, limit, role: 'CUSTOMER'|'HOST'|'ADMIN'|'SUPPORT', status, kycStatus: 'verified'|'unverified', search, sortBy, sortOrder }
   */
  async list(params = {}) {
    return apiClient.get('/admin/users', params);
  },

  async getCustomers(params = {}) {
    return this.list({ ...params, role: 'CUSTOMER' });
  },

  async getOwners(params = {}) {
    return this.list({ ...params, role: 'HOST' });
  },

  /**
   * Overall user statistics: GET /api/v1/admin/users/stats
   */
  async getStats() {
    return apiClient.get('/admin/users/stats');
  },

  /**
   * User details by ID: GET /api/v1/admin/users/:id
   */
  async getById(id) {
    return apiClient.get(`/admin/users/${id}`);
  },

  /**
   * User activity audit logs: GET /api/v1/admin/users/:id/activity
   */
  async getActivityLogs(id, params = {}) {
    return apiClient.get(`/admin/users/${id}/activity`, params);
  },

  /**
   * Update user account status (e.g., ACTIVE, BLOCKED, SUSPENDED): PATCH /api/v1/admin/users/:id/status
   */
  async updateStatus(id, { status, reason }) {
    return apiClient.patch(`/admin/users/${id}/status`, { status, reason });
  },

  /**
   * Admin password reset: POST /api/v1/admin/users/:id/reset-password
   */
  async resetPassword(id, { newPassword, confirmPassword }) {
    return apiClient.post(`/admin/users/${id}/reset-password`, {
      newPassword,
      confirmPassword: confirmPassword || newPassword,
    });
  },

  /**
   * Assign role to user: POST /api/v1/admin/users/:id/assign-role
   * Body: { role: 'ADMIN' | 'CUSTOMER' | 'HOST' | 'SUPPORT', adminRoleId?: string }
   */
  async assignAdminRole(id, { role = 'ADMIN', adminRoleId }) {
    return apiClient.post(`/admin/users/${id}/assign-role`, { role, adminRoleId });
  },
};
