'use client';

import useAuthStore from '@/store/authStore';

export default function useAuth() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAdmin = user?.role === 'admin';
  return { user, accessToken, isAdmin, isAuthenticated: Boolean(accessToken) };
}
