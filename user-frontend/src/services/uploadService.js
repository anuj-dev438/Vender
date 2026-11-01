import { apiClient } from './apiClient';

/**
 * Normalizes input folder/type to backend UploadCategoryEnum:
 * 'KYC_DOCUMENT' | 'KYC_SELFIE' | 'VEHICLE_DOCUMENT' | 'VEHICLE_PHOTO' | 'AVATAR'
 */
function normalizeCategory(categoryOrFolder = 'KYC_DOCUMENT') {
  const c = String(categoryOrFolder).toUpperCase();
  if (c.includes('SELFIE')) return 'KYC_SELFIE';
  if (c.includes('AVATAR') || c.includes('PROFILE')) return 'AVATAR';
  if (c.includes('INSPECTION') || c.includes('PHOTO')) return 'VEHICLE_PHOTO';
  if (c.includes('VEHICLE_DOC')) return 'VEHICLE_DOCUMENT';
  return 'KYC_DOCUMENT';
}

/**
 * Normalizes MIME type to AllowedMimeTypesEnum:
 * 'image/jpeg' | 'image/png' | 'image/webp' | 'application/pdf'
 */
function normalizeMimeType(mimeType) {
  const m = String(mimeType || '').toLowerCase();
  if (m === 'image/png') return 'image/png';
  if (m === 'image/webp') return 'image/webp';
  if (m === 'application/pdf') return 'application/pdf';
  return 'image/jpeg';
}

/**
 * Client-side lightweight image compression using HTML5 Canvas.
 * Keeps image quality high while reducing payload size to ~80KB-250KB,
 * preventing Fastify bodyLimit errors and ensuring fast, smooth uploads.
 */
export async function compressImage(fileOrDataUrl, maxWidth = 1200, maxHeight = 1200, quality = 0.82) {
  if (typeof window === 'undefined' || !fileOrDataUrl) return fileOrDataUrl;

  // If already a base64 data URL
  if (typeof fileOrDataUrl === 'string') {
    if (!fileOrDataUrl.startsWith('data:image/')) return fileOrDataUrl;
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(fileOrDataUrl);
      img.src = fileOrDataUrl;
    });
  }

  // If a File or Blob object
  if (fileOrDataUrl instanceof Blob && fileOrDataUrl.type?.startsWith('image/')) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(fileOrDataUrl);
      reader.readAsDataURL(fileOrDataUrl);
    });
  }

  return fileOrDataUrl;
}

export const uploadService = {
  /**
   * Request a pre-signed S3 / MinIO upload URL from backend
   * Endpoint: POST /api/v1/uploads/presigned-url
   */
  async getPresignedUrl({ fileName, contentType, fileType, category, folder = 'KYC_DOCUMENT', vehicleId }) {
    const finalCategory = normalizeCategory(category || folder);
    const finalContentType = normalizeMimeType(contentType || fileType);

    const res = await apiClient.post('/uploads/presigned-url', {
      category: finalCategory,
      contentType: finalContentType,
      fileName: fileName || `file_${Date.now()}`,
      vehicleId: vehicleId || undefined,
    });
    return res.data;
  },

  /**
   * Upload file using pre-signed URL or direct form upload
   */
  async uploadFile(file, categoryOrFolder = 'KYC_DOCUMENT', vehicleId) {
    if (!file) throw new Error('No file provided for upload');

    // If file is already a base64 data URL string (e.g. from camera capture)
    if (typeof file === 'string' && (file.startsWith('data:image/') || file.startsWith('http'))) {
      const compressed = await compressImage(file);
      return {
        fileUrl: compressed,
        storageKey: `local_${Date.now()}`,
      };
    }

    try {
      const contentType = normalizeMimeType(file.type);
      const presigned = await this.getPresignedUrl({
        fileName: file.name,
        contentType,
        category: categoryOrFolder,
        vehicleId,
      });

      if (presigned?.uploadUrl) {
        // Direct HTTP PUT to S3 / MinIO
        const s3Res = await fetch(presigned.uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': contentType,
          },
          body: file,
        });

        if (s3Res.ok) {
          return {
            fileUrl: presigned.fileUrl,
            storageKey: presigned.storageKey,
          };
        }
        console.warn(`S3 upload responded with HTTP ${s3Res.status}`);
      }
    } catch (err) {
      console.warn('Backend presigned S3 upload failed or MinIO not configured:', err.message);
    }

    // High-fidelity fallback: Compress and read as base64 data URL for environments without external S3
    const compressedDataUrl = await compressImage(file);
    if (typeof compressedDataUrl === 'string' && compressedDataUrl.startsWith('data:')) {
      return {
        fileUrl: compressedDataUrl,
        storageKey: `local_${Date.now()}`,
      };
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          fileUrl: reader.result,
          storageKey: `local_${Date.now()}`,
        });
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  },
};
