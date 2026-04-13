'use client';

import { useState } from 'react';
import { adminApi } from '@/lib/api/admin.api';
import useApi from '@/hooks/useApi';
import StatsCards from '@/components/admin/StatsCards';

export default function AdminStatsPage() {
  const { run } = useApi();
  const [stats, setStats] = useState(null);
  const load = async () => {
    const res = await run(adminApi.stats());
    setStats(res.data);
  };

  return (
    <div className="space-y-2">
      <h1 className="font-semibold">Admin Stats</h1>
      <button className="border px-2 py-1 text-xs" onClick={load}>Refresh Stats</button>
      <StatsCards stats={stats} />
    </div>
  );
}
