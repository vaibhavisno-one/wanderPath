'use client';

import { useState } from 'react';
import { adminApi } from '@/lib/api/admin.api';
import useApi from '@/hooks/useApi';

export default function ApproveRejectButtons({ adminId, onDone }) {
  const { run } = useApi();
  const [reason, setReason] = useState('');

  return (
    <div className="flex gap-1 items-center flex-wrap">
      <button onClick={async () => { await run(adminApi.approve(adminId), 'Approved'); onDone?.(); }} className="border px-1">approve</button>
      <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="reason" className="border px-1" />
      <button
        onClick={async () => {
          if (!reason.trim()) throw new Error('Reason is required');
          await run(adminApi.reject(adminId, reason), 'Rejected');
          onDone?.();
        }}
        className="border px-1"
      >
        reject
      </button>
    </div>
  );
}
