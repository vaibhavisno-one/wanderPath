import { apiRequest } from '@/lib/apiClient';

export const visitsApi = {
  checkIn: (payload) => apiRequest('/visits/check-in', { method: 'POST', body: JSON.stringify(payload) }),
  checkOut: (payload) => apiRequest('/visits/check-out', { method: 'POST', body: JSON.stringify(payload) }),
  myVisits: () => apiRequest('/visits/my-visits'),
};
