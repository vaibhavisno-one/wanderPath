import { apiRequest } from '@/lib/apiClient';

export const placesApi = {
  nearby: ({ lat, lng, radius = 5000, page = 1, limit = 10 }) =>
    apiRequest(`/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}&page=${page}&limit=${limit}`),
  getById: (id) => apiRequest(`/places/${id}`),
  create: (payload) => apiRequest('/places', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => apiRequest(`/places/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
};
