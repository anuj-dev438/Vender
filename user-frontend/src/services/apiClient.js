/**
 * Centralized HTTP Client for CountryDrive User Frontend
 * Handles authentication header injection, query string serialization, 
 * standardized error parsing, and API communication with the Fastify backend.
 */

const TOKEN_KEY = 'cd_user_token';
const USER_KEY = 'cd_user_profile';

export const getStoredToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
};

export const setStoredAuth = (token, user) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Error saving user auth to localStorage', err);
  }
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearStoredAuth = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (err) {
    console.error('Error clearing user auth from localStorage', err);
  }
};

// Base URL resolution
export const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1'
).replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Builds a query string safely from an object
 */
function buildQueryString(params = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  }
  const str = query.toString();
  return str ? `?${str}` : '';
}

/**
 * Core HTTP Request Function
 */
export async function apiRequest(endpoint, {
  method = 'GET',
  params,
  body,
  headers = {},
  signal,
  isFormData = false,
} = {}) {
  const token = getStoredToken();
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}${buildQueryString(params)}`;

  const requestHeaders = {
    'Accept': 'application/json',
    ...(isFormData ? {} : (body ? { 'Content-Type': 'application/json' } : {})),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...headers,
  };

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
      signal,
    });

    let json;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      json = await response.json();
    } else {
      const text = await response.text();
      try {
        json = JSON.parse(text);
      } catch {
        json = { message: text };
      }
    }

    if (!response.ok) {
      let errorMessage = json?.message || json?.error?.message || `HTTP error ${response.status}: ${response.statusText}`;
      const errorCode = json?.error?.code || `HTTP_${response.status}`;
      const errorDetails = json?.error?.details || json?.details || json;

      // Extract Zod / field-level validation messages if available
      if (Array.isArray(errorDetails) && errorDetails.length > 0) {
        const issues = errorDetails
          .map((iss) => {
            const field = Array.isArray(iss.path) ? iss.path.join('.') : iss.field || '';
            const msg = iss.message || (typeof iss === 'string' ? iss : '');
            return field && msg ? `${field}: ${msg}` : msg || field;
          })
          .filter(Boolean);
        if (issues.length > 0) {
          errorMessage = `${errorMessage}: ${issues.join(', ')}`;
        }
      }

      if (response.status === 401) {
        // Optional session expiration handling
        console.warn('Unauthorized access detected (401). Invalid or expired token.');
      }

      throw new ApiError(errorMessage, response.status, errorCode, errorDetails);
    }

    return json;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      err?.message || 'Network request failed. Please check if the backend server is running.',
      0,
      'NETWORK_FAILURE',
      err
    );
  }
}

export const apiClient = {
  get: (endpoint, params, options) => apiRequest(endpoint, { method: 'GET', params, ...options }),
  post: (endpoint, body, options) => apiRequest(endpoint, { method: 'POST', body, ...options }),
  put: (endpoint, body, options) => apiRequest(endpoint, { method: 'PUT', body, ...options }),
  patch: (endpoint, body, options) => apiRequest(endpoint, { method: 'PATCH', body, ...options }),
  delete: (endpoint, options) => apiRequest(endpoint, { method: 'DELETE', ...options }),
  upload: (endpoint, formData, options) => apiRequest(endpoint, { method: 'POST', body: formData, isFormData: true, ...options }),
};
