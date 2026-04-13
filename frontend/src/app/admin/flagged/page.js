'use client';

import { useState } from 'react';
import { adminApi } from '@/lib/api/admin.api';
import useApi from '@/hooks/useApi';

export default function AdminFlaggedPage() {
  const { run } = useApi();
  const [items, setItems] = useState([]);
  const load = async () => {
    const res = await run(adminApi.flagged());
    setItems(res.data || []);
  };

  return (
    <div className="space-y-2">
      <h1 className="font-semibold">Flagged Reviews</h1>
      <button className="border px-2 py-1 text-xs" onClick={load}>Refresh Flagged</button>
      {items.map((r) => (
        <div key={r._id} className="border p-2 text-xs">
          <p>{r.place?.name} · {r.rating}/5</p>
          <p>{r.comment}</p>
          <p>by {r.user?.fullname || r.user?.email}</p>
        </div>
      ))}
    </div>
  );
}
