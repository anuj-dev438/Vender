import { apiClient } from './client.js';

export const healthApi = {
  /**
   * Health ping: GET /api/v1/health
   */
  async getHealth() {
    return apiClient.get('/health');
  },
};
