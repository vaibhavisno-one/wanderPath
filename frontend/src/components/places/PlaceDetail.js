'use client';

import { useEffect, useMemo, useState } from 'react';
import { placesApi } from '@/lib/api/places.api';
import { visitsApi } from '@/lib/api/visits.api';
import useLocation from '@/hooks/useLocation';
import useApi from '@/hooks/useApi';
import CheckInButton from '@/components/visits/CheckInButton';
import CheckOutButton from '@/components/visits/CheckOutButton';
import ReviewForm from '@/components/reviews/ReviewForm';
import { getVisitState, getReviewState, VISIT_STATES } from '@/lib/state';

export default function PlaceDetail({ placeId }) {
  const { run } = useApi();
  const { location, fetchLocation, loading } = useLocation();
  const [place, setPlace] = useState(null);
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    (async () => {
      const [placeRes, visitsRes] = await Promise.allSettled([
        run(placesApi.getById(placeId)),
        run(visitsApi.myVisits()),
      ]);
      if (placeRes.status === 'fulfilled') setPlace(placeRes.value.data);
      if (visitsRes.status === 'fulfilled') setVisits(visitsRes.value.data || []);
    })();
  }, [placeId, run]);

  const visitState = useMemo(() => getVisitState(visits, placeId), [visits, placeId]);
  const reviewState = useMemo(() => getReviewState({ review: null, visitState }), [visitState]);
  const activeVisit = visits.find((v) => !v.checkOutTime && (v.place?._id || v.place) === placeId);

  if (!place) return <p className="text-xs">Loading place...</p>;

  return (
    <div className="space-y-3">
      <div className="border p-2">
        <h1 className="font-semibold text-base">{place.name}</h1>
        <p className="text-xs">{place.description}</p>
        <p className="text-xs text-gray-600">{place.address}, {place.city}, {place.state}</p>
      </div>

      <div className="border p-2 space-y-2">
        <p className="text-xs">Visit state: <b>{visitState}</b></p>
        <p className="text-xs text-gray-600">Checkout is optional. Verification needs 5+ minutes stay and checkout within ~150m from place.</p>
        <button onClick={fetchLocation} className="border px-2 py-1 text-xs" disabled={loading}>
          {loading ? 'fetching gps...' : 'use gps'}
        </button>
        {location && <p className="text-xs">Accuracy {Math.round(location.accuracy)}m</p>}

        {visitState === VISIT_STATES.NOT_VISITED && <CheckInButton placeId={placeId} location={location} disabled={!location} />}
        {visitState === VISIT_STATES.ACTIVE_CHECKIN && <CheckOutButton location={location} disabled={!location || !activeVisit} />}
        {(visitState === VISIT_STATES.COMPLETED_UNVERIFIED || visitState === VISIT_STATES.VERIFIED) && (
          <p className="text-xs">Visit completed: {visitState}</p>
        )}
      </div>

      <div>
        <h2 className="font-semibold">Review</h2>
        <ReviewForm placeId={placeId} visitId={activeVisit?._id} reviewState={reviewState} />
      </div>
    </div>
  );
}
