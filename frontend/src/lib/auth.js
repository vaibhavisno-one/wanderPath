import useAuthStore from '@/store/authStore';
import { authApi } from '@/lib/api/auth.api';

export async function login(payload) {
  const res = await authApi.login(payload);
  const { setAuth } = useAuthStore.getState();
  setAuth({
    user: res.data.user,
    accessToken: res.data.accessToken,
    refreshToken: res.data.refreshToken,
  });
  return res;
}

export async function register(payload) {
  return authApi.register(payload);
}

export async function logout() {
  try {
    await authApi.logout();
  } catch {
    // Clear local auth even if backend rate-limits logout.
  } finally {
    useAuthStore.getState().logout();
  }
}
