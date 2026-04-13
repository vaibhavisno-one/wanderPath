import { apiRequest } from '@/lib/apiClient';

export const adminApi = {
  queue: () => apiRequest('/admin/queue'),
  approve: (adminId) => apiRequest(`/admin/approve/${adminId}`, { method: 'POST' }),
  reject: (adminId, reason) => apiRequest(`/admin/reject/${adminId}`, { method: 'POST', body: JSON.stringify({ reason }) }),
  flagged: () => apiRequest('/admin/flagged-reviews'),
  ban: (userId, reason) => apiRequest(`/admin/ban/${userId}`, { method: 'POST', body: JSON.stringify({ reason }) }),
  unban: (userId) => apiRequest(`/admin/unban/${userId}`, { method: 'POST' }),
  stats: () => apiRequest('/admin/stats'),
};
