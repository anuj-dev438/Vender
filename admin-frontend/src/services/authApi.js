
import { apiClient, setStoredAuth, clearStoredAuth } from './client.js';

export const authApi = {
  async login({ phone, password }) {
    const res = await apiClient.post('/auth/login', {
      phone,
      password,
    });

    if (res?.data?.token) {
      setStoredAuth(res.data.token, res.data.user);
    }

    return res;
  },

  async getMe() {
    return apiClient.get('/auth/me');
  },

  async verifyAdminAccess() {
    return apiClient.get('/auth/test/admin');
  },

  async updateProfile(data) {
    return apiClient.patch('/auth/me', data);
  },

  async changePassword({ oldPassword, newPassword }) {
    return apiClient.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      clearStoredAuth();
    }
  },
};
