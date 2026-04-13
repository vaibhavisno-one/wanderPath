'use client';

import { visitsApi } from '@/lib/api/visits.api';
import useVisitStore from '@/store/visitStore';
import useApi from '@/hooks/useApi';

export default function CheckOutButton({ location, disabled }) {
  const { run } = useApi();
  const activeVisit = useVisitStore((s) => s.activeVisit);
  const clearActiveVisit = useVisitStore((s) => s.clearActiveVisit);

  const onCheckOut = async () => {
    if (!activeVisit?._id) throw new Error('No active visit to checkout.');
    if (!location) throw new Error('Location is required for check-out.');
    const payload = {
      visitId: activeVisit._id,
      userLocation: { type: 'Point', coordinates: [location.longitude, location.latitude] },
      accuracy: location.accuracy,
    };
    await run(visitsApi.checkOut(payload), 'Checked out');
    clearActiveVisit();
  };

  return <button disabled={disabled} onClick={onCheckOut} className="border px-2 py-1 text-xs">Check Out</button>;
}
