'use client';

import { useCallback, useEffect, useState } from 'react';
import { visitsApi } from '@/lib/api/visits.api';
import useApi from '@/hooks/useApi';
import useLocation from '@/hooks/useLocation';
import { isAccurateEnoughForCheckIn } from '@/lib/location';

export default function VisitsPage() {
  const { run } = useApi();
  const { location, fetchLocation, loading: gpsLoading } = useLocation();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeVisit, setActiveVisit] = useState(null);

  const loadVisits = useCallback(async () => {
    setLoading(true);
    try {
      const res = await run(visitsApi.myVisits());
      const allVisits = res.data || [];
      setVisits(allVisits);
      setActiveVisit(allVisits.find((v) => !v.checkOutTime) || null);
    } finally {
      setLoading(false);
    }
  }, [run]);

  const handleCheckOut = async () => {
    if (!activeVisit) throw new Error('No active visit to check out.');
    if (!location) throw new Error('Use GPS before check-out.');
    if (!isAccurateEnoughForCheckIn(location.accuracy)) {
      throw new Error('Check-out requires GPS accuracy <= 50m.');
    }
    await run(visitsApi.checkOut({
      visitId: activeVisit._id,
      userLocation: { type: 'Point', coordinates: [location.longitude, location.latitude] },
      accuracy: location.accuracy,
    }), 'Visit completed (check-out done)');
    await loadVisits();
  };

  useEffect(() => {
    loadVisits();
  }, [loadVisits]);

  return (
    <div className="space-y-2">
      <h1 className="font-semibold">My Visits</h1>
      <div className="flex gap-2 items-center flex-wrap">
        <button className="border px-2 py-1 text-xs" onClick={fetchLocation} disabled={gpsLoading}>
          {gpsLoading ? 'Fetching GPS...' : 'Use GPS'}
        </button>
        {location && <span className="text-xs">acc:{Math.round(location.accuracy)}m</span>}
        <button className="border px-2 py-1 text-xs" onClick={handleCheckOut} disabled={!activeVisit || !location}>
          Optional Check Out
        </button>
      </div>
      {activeVisit && <p className="text-xs text-gray-700">Active visit found. You can keep it active, or check out when leaving.</p>}
      <p className="text-xs text-gray-600">Verification (for trusted review flow) needs: 5+ minutes stay and checkout within ~150m.</p>
      <button className="border px-2 py-1 text-xs" onClick={loadVisits} disabled={loading}>
        {loading ? 'Loading...' : 'Refresh Visits'}
      </button>
      {visits.map((v) => (
        <div key={v._id} className="border p-2 text-xs">
          <p>place: {v.place?.name || v.place}</p>
          <p>check-in: {new Date(v.checkInTime).toLocaleString()}</p>
          <p>check-out: {v.checkOutTime ? new Date(v.checkOutTime).toLocaleString() : 'active'}</p>
          <p>verified: {String(v.isVerified)}</p>
        </div>
      ))}
      {!visits.length && <p className="text-xs">No visits yet.</p>}
    </div>
  );
}
