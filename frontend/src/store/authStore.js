'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: ({ user, accessToken, refreshToken }) =>
        set({ user: user || null, accessToken, refreshToken }),
      setAccessToken: (accessToken) => set({ accessToken }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null }),
      isAdmin: () => {
        const state = useAuthStore.getState();
        return state.user?.role === 'admin';
      },
    }),
    { name: 'wanderpath-auth' }
  )
);

export default useAuthStore;
