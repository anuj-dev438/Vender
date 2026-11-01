import { apiClient } from './apiClient';

export const bannerService = {
  /**
   * GET /api/v1/banners
   * Public: List all active promotional banners
   */
  async getActiveBanners(params = {}) {
    const res = await apiClient.get('/banners', params);
    return res.data || [];
  },

  /**
   * GET /api/v1/banners/position/:position
   * Public: Get banners for screen position (HOME_HERO, HOME_CAROUSEL, SEARCH_PAGE, etc.)
   */
  async getBannersByPosition(position) {
    const res = await apiClient.get(`/banners/position/${position}`);
    return res.data || [];
  },
};
