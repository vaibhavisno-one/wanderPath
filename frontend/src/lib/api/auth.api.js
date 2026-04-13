import { apiRequest } from '@/lib/apiClient';

export const authApi = {
  register: (payload) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  refresh: (refreshToken) => apiRequest('/auth/refresh-token', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
};
