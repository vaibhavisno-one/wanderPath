'use client';

import { visitsApi } from '@/lib/api/visits.api';
import useVisitStore from '@/store/visitStore';
import useApi from '@/hooks/useApi';

export default function CheckInButton({ placeId, location, disabled }) {
  const { run } = useApi();
  const activeVisit = useVisitStore((s) => s.activeVisit);
  const setActiveVisit = useVisitStore((s) => s.setActiveVisit);

  const onCheckIn = async () => {
    if (activeVisit) throw new Error('You already have an active check-in.');
    if (!location) throw new Error('Location is required for check-in.');
    const payload = {
      placeId,
      userLocation: { type: 'Point', coordinates: [location.longitude, location.latitude] },
      accuracy: location.accuracy,
    };
    const res = await run(visitsApi.checkIn(payload), 'Checked in');
    setActiveVisit(res.data);
  };

  return <button disabled={disabled} onClick={onCheckIn} className="border px-2 py-1 text-xs">Check In</button>;
}
