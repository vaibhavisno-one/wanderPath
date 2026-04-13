import { apiRequest } from '@/lib/apiClient';

export const reviewsApi = {
  create: (payload) => apiRequest('/reviews', { method: 'POST', body: JSON.stringify(payload) }),
  update: (reviewId, payload) => apiRequest(`/reviews/${reviewId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (reviewId) => apiRequest(`/reviews/${reviewId}`, { method: 'DELETE' }),
  flag: (reviewId) => apiRequest(`/admin/flag-review/${reviewId}`, { method: 'POST' }),
};
