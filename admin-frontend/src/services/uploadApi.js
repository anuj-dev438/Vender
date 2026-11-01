import { apiClient } from './client.js';

export const uploadApi = {
  /**
   * Request pre-signed S3 / MinIO upload URL: POST /api/v1/uploads/presigned-url
   * @param {{ category: 'VEHICLE_PHOTO'|'VEHICLE_DOCUMENT'|'KYC_DOCUMENT'|'KYC_SELFIE'|'AVATAR', contentType: string, fileName?: string, vehicleId?: string }} params
   */
  async getPresignedUrl({ category = 'VEHICLE_PHOTO', contentType, fileName, vehicleId }) {
    return apiClient.post('/uploads/presigned-url', {
      category,
      contentType,
      fileName,
      vehicleId,
    });
  },

  /**
   * Request pre-signed view/download URL: POST /api/v1/uploads/view-url
   */
  async getViewUrl(storageKey) {
    return apiClient.post('/uploads/view-url', { storageKey });
  },

  /**
   * Upload binary file directly to S3 / MinIO using pre-signed PUT URL
   */
  async uploadBinary(uploadUrl, file, contentType) {
    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType || file.type || 'image/jpeg',
      },
      body: file,
    });

    if (!res.ok) {
      throw new Error(`Direct storage upload failed with HTTP status ${res.status}`);
    }

    return true;
  },

  /**
   * Complete high-level upload workflow:
   * 1. Request presigned URL
   * 2. Upload file directly to S3 / MinIO
   * 3. Return public fileUrl and storageKey
   */
  async uploadFile(file, { category = 'VEHICLE_PHOTO', vehicleId } = {}) {
    // Validate file type
    let contentType = file.type || 'image/jpeg';
    if (!contentType || contentType === 'application/octet-stream') {
      if (file.name.endsWith('.png')) contentType = 'image/png';
      else if (file.name.endsWith('.webp')) contentType = 'image/webp';
      else if (file.name.endsWith('.pdf')) contentType = 'application/pdf';
      else contentType = 'image/jpeg';
    }

    // Step 1: Get presigned URL
    const presignedRes = await this.getPresignedUrl({
      category,
      contentType,
      fileName: file.name,
      vehicleId,
    });

    const { uploadUrl, fileUrl, storageKey } = presignedRes.data || presignedRes;

    // Step 2: Upload to S3/MinIO
    await this.uploadBinary(uploadUrl, file, contentType);

    return {
      fileUrl,
      storageKey,
      fileName: file.name,
      fileSize: file.size,
      contentType,
    };
  },

  /**
   * Attach uploaded photos to vehicle listing: POST /api/v1/vehicles/:id/photos
   */
  async attachVehiclePhotos(vehicleId, photos) {
    return apiClient.post(`/vehicles/${vehicleId}/photos`, { photos });
  },

  /**
   * Attach compliance document to vehicle: POST /api/v1/vehicles/:id/documents
   */
  async attachVehicleDocument(vehicleId, docData) {
    return apiClient.post(`/vehicles/${vehicleId}/documents`, docData);
  },
};
