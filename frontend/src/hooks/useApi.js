'use client';

import { useCallback } from 'react';
import useToastStore from '@/store/toastStore';

export default function useApi() {
  const push = useToastStore((s) => s.push);

  const run = useCallback(async (promise, successMessage) => {
    try {
      const res = await promise;
      if (successMessage) push('success', successMessage);
      return res;
    } catch (err) {
      push('error', err.message || 'Request failed');
      throw err;
    }
  }, [push]);

  return { run };
}
