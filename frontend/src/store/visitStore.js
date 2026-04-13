'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useVisitStore = create(
  persist(
    (set) => ({
      activeVisit: null,
      setActiveVisit: (visit) => set({ activeVisit: visit }),
      clearActiveVisit: () => set({ activeVisit: null }),
    }),
    { name: 'wanderpath-active-visit' }
  )
);

export default useVisitStore;
