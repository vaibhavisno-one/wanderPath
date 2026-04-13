'use client';

import { useState } from 'react';
import { adminApi } from '@/lib/api/admin.api';
import useApi from '@/hooks/useApi';
import QueueTable from '@/components/admin/QueueTable';

export default function AdminQueuePage() {
  const { run } = useApi();
  const [items, setItems] = useState([]);

  const load = async () => {
    const res = await run(adminApi.queue());
    setItems(res.data || []);
  };

  return (
    <div className="space-y-2">
      <h1 className="font-semibold">Admin Queue</h1>
      <p className="text-xs text-gray-600">
        Queue shows only pending moderation items. Verified visits/reviews may bypass pending queue, so empty queue can be valid.
      </p>
      <button className="border px-2 py-1 text-xs" onClick={load}>Refresh Queue</button>
      <QueueTable items={items} onDone={load} />
    </div>
  );
}
