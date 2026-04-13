import { apiRequest } from '@/lib/apiClient';

export const bookmarksApi = {
  list: (page = 1, limit = 10) => apiRequest(`/bookmarks?page=${page}&limit=${limit}`),
  add: (placeId) => apiRequest('/bookmarks', { method: 'POST', body: JSON.stringify({ placeId }) }),
  remove: (placeId) => apiRequest(`/bookmarks/${placeId}`, { method: 'DELETE' }),
};
