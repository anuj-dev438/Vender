import { apiClient, setStoredAuth, clearStoredAuth, getStoredUser } from './apiClient';

export const authService = {
  /**
   * Register a new customer
   */
  async register({ phone, password, name, email, role = 'CUSTOMER' }) {
    const res = await apiClient.post('/auth/register', {
      phone,
      password,
      name: name || undefined,
      email: email || undefined,
      role,
    });
    if (res.data?.token && res.data?.user) {
      setStoredAuth(res.data.token, res.data.user);
    }
    return res.data;
  },

  /**
   * Login with phone and password
   */
  async login({ phone, password }) {
    const res = await apiClient.post('/auth/login', { phone, password });
    if (res.data?.token && res.data?.user) {
      setStoredAuth(res.data.token, res.data.user);
    }
    return res.data;
  },

  /**
   * Google OAuth authentication
   */
  async googleAuth({ idToken, email, googleId, name, avatarUrl, role = 'CUSTOMER' }) {
    const res = await apiClient.post('/auth/google', {
      idToken,
      email,
      googleId,
      name,
      avatarUrl,
      role,
    });
    if (res.data?.token && res.data?.user) {
      setStoredAuth(res.data.token, res.data.user);
    }
    return res.data;
  },

  /**
   * Get current authenticated user profile
   */
  async getMe() {
    const res = await apiClient.get('/auth/me');
    if (res.data) {
      // Update local storage user profile with latest data
      const token = localStorage.getItem('cd_user_token');
      setStoredAuth(token, res.data);
    }
    return res.data;
  },

  /**
   * Progressive profile update
   */
  async updateProfile(profileData) {
    const res = await apiClient.patch('/auth/me', profileData);
    if (res.data) {
      const token = localStorage.getItem('cd_user_token');
      setStoredAuth(token, res.data);
    }
    return res.data;
  },

  /**
   * Change user password
   */
  async changePassword({ currentPassword, newPassword }) {
    const res = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return res.data;
  },

  /**
   * Send OTP to phone
   */
  async sendOtp(phone) {
    const res = await apiClient.post('/auth/send-otp', { phone });
    return res.data;
  },

  /**
   * Verify OTP
   */
  async verifyOtp(phone, otp) {
    const res = await apiClient.post('/auth/verify-otp', { phone, otp });
    return res.data;
  },

  /**
   * Forgot password request
   */
  async forgotPassword(phone) {
    const res = await apiClient.post('/auth/forgot-password', { phone });
    return res.data;
  },

  /**
   * Reset password with OTP
   */
  async resetPassword({ phone, otp, newPassword }) {
    const res = await apiClient.post('/auth/reset-password', {
      phone,
      otp,
      newPassword,
    });
    return res.data;
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API notification failed (session locally cleared anyway):', err);
    } finally {
      clearStoredAuth();
    }
  },

  getCurrentUser() {
    return getStoredUser();
  },

  isAuthenticated() {
    return !!localStorage.getItem('cd_user_token');
  },
};
