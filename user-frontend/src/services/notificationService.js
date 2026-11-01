import { apiClient } from './apiClient';

export const notificationService = {
  /**
   * GET /api/v1/notifications
   * List paginated notifications for current user
   */
  async list(params = { page: 1, limit: 10 }) {
    const res = await apiClient.get('/notifications', params);
    return res.data || [];
  },

  /**
   * GET /api/v1/notifications/unread-count
   * Get unread notification count for badge display
   */
  async getUnreadCount() {
    const res = await apiClient.get('/notifications/unread-count');
    return res.data?.unreadCount ?? 0;
  },

  /**
   * PATCH /api/v1/notifications/:id/read
   * Mark a specific notification as read
   */
  async markAsRead(id) {
    const res = await apiClient.patch(`/notifications/${id}/read`);
    return res.data;
  },

  /**
   * PATCH /api/v1/notifications/read-all
   * Mark all notifications as read
   */
  async markAllAsRead() {
    const res = await apiClient.patch('/notifications/read-all');
    return res.data;
  },
};
