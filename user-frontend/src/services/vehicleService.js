import { apiClient } from './apiClient';
import { vehiclesCatalog } from '../data/mockData';

export const vehicleService = {
  /**
   * Fetch list of available vehicles from backend /api/v1/vehicles
   * with fallback to catalog data if backend server is unreachable.
   */
  async getVehicles(filters = {}) {
    try {
      const res = await apiClient.get('/vehicles', filters);
      if (Array.isArray(res.data) && res.data.length > 0) {
        return {
          vehicles: res.data.map(adaptBackendVehicle),
          isLiveBackend: true,
        };
      }
      // If backend returns empty array (e.g. freshly started DB without seeds),
      // provide existing high-quality catalog data for display
      return {
        vehicles: filterMockVehicles(vehiclesCatalog, filters),
        isLiveBackend: true,
        isEmptyBackend: true,
      };
    } catch (err) {
      console.warn('Backend /vehicles request failed or server offline. Using local catalog fallback:', err.message);
      return {
        vehicles: filterMockVehicles(vehiclesCatalog, filters),
        isLiveBackend: false,
        error: err.message,
      };
    }
  },

  /**
   * Fetch single vehicle details by ID
   */
  async getVehicleById(id) {
    try {
      const res = await apiClient.get(`/vehicles/${id}`);
      if (res.data) {
        return {
          vehicle: adaptBackendVehicle(res.data),
          isLiveBackend: true,
        };
      }
    } catch (err) {
      console.warn(`Backend /vehicles/${id} failed, checking local catalog fallback:`, err.message);
    }

    // Look up in fallback catalog
    const fallback = vehiclesCatalog.find((v) => String(v.id) === String(id));
    if (fallback) {
      return {
        vehicle: fallback,
        isLiveBackend: false,
      };
    }

    throw new Error('Vehicle not found');
  },

  /**
   * PostGIS Nearby Geolocation Vehicle Search
   * GET /api/v1/vehicles/nearby
   */
  async getNearbyVehicles(params = {}) {
    const lat = Number(params.lat);
    const lng = Number(params.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return this.getVehicles(params);
    }

    try {
      const res = await apiClient.get('/vehicles/nearby', {
        lat,
        lng,
        radiusKm: params.radiusKm || 10,
        category: params.category && params.category !== 'all' ? params.category : undefined,
        fuelType: params.fuelType && params.fuelType !== 'all' ? params.fuelType : undefined,
        sortBy: params.sortBy || 'distance',
      });
      if (Array.isArray(res.data)) {
        return {
          vehicles: res.data.map(adaptBackendVehicle),
          isLiveBackend: true,
        };
      }
      return this.getVehicles(params);
    } catch (err) {
      console.warn('Nearby search failed, falling back to standard list:', err.message);
      return this.getVehicles(params);
    }
  },
};

/**
 * Normalizes backend Prisma vehicle schema to frontend component format
 */
function adaptBackendVehicle(bv) {
  const mediaImg = bv.media?.find((m) => m.type === 'IMAGE')?.url ||
    bv.media?.[0]?.url ||
    bv.coverImageUrl;

  const categoryName = (bv.category || 'CAR').toLowerCase();

  return {
    id: bv.id,
    name: bv.variant ? `${bv.make} ${bv.model} ${bv.variant}` : `${bv.make} ${bv.model}`,
    make: bv.make,
    model: bv.model,
    variant: bv.variant || '',
    category: categoryName,
    type: bv.category || 'CAR',
    fuel: bv.fuelType || 'Petrol',
    transmission: bv.transmission || 'Automatic',
    seats: bv.seatingCapacity || 5,
    price: Number(bv.hourlyRate) || 99,
    priceUnit: 'hour',
    dailyRate: Number(bv.dailyRate) || 999,
    includedKm: bv.includedKm || 100,
    extraKmRate: Number(bv.extraKmRate) || 12,
    extraHourRate: Number(bv.extraHourRate) || 150,
    securityDeposit: Number(bv.securityDeposit) || 3000,
    city: bv.city || 'Mumbai',
    state: bv.state || 'Maharashtra',
    description: bv.description || 'Clean, well-maintained self-drive rental vehicle.',
    image: mediaImg || '/uploads/cards/White Modern SUV Studio Render.png',
    allMedia: bv.media || [],
    rating: bv.rating ? Number(bv.rating) : 4.8,
    reviews: bv.reviewsCount || 124,
    status: bv.status,
    distanceKm: bv.distanceKm ? Number(bv.distanceKm).toFixed(1) : bv.distance ? (Number(bv.distance) / 1000).toFixed(1) : null,
    features: bv.featureMappings?.map((fm) => fm.feature?.name).filter(Boolean) || [
      'Helmet / Child Seat Available',
      'Free Fuel Package Available',
      '24/7 Roadside Assistance',
      'Comprehensive Insurance Included',
    ],
  };
}

function filterMockVehicles(list, filters) {
  let result = [...list];
  if (filters.category && filters.category !== 'all') {
    result = result.filter(
      (v) =>
        v.category.toLowerCase() === filters.category.toLowerCase() ||
        v.type.toLowerCase() === filters.category.toLowerCase()
    );
  }
  if (filters.fuelType && filters.fuelType !== 'all') {
    result = result.filter(
      (v) => v.fuel.toLowerCase() === filters.fuelType.toLowerCase()
    );
  }
  if (filters.city && filters.city !== 'all') {
    result = result.filter((v) => !v.city || v.city.toLowerCase() === filters.city.toLowerCase());
  }
  return result;
}
