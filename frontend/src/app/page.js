'use client';

import { useState } from 'react';
import useLocation from '@/hooks/useLocation';
import useApi from '@/hooks/useApi';
import { placesApi } from '@/lib/api/places.api';
import { visitsApi } from '@/lib/api/visits.api';
import { bookmarksApi } from '@/lib/api/bookmarks.api';
import PlaceList from '@/components/places/PlaceList';
import useAuth from '@/hooks/useAuth';
import useVisitStore from '@/store/visitStore';
import { getVisitState, VISIT_STATES } from '@/lib/state';
import { isAccurateEnoughForCheckIn } from '@/lib/location';

export default function HomePage() {
  const { run } = useApi();
  const { location, fetchLocation, setManualLocation, loading } = useLocation();
  const { isAuthenticated } = useAuth();
  const activeVisit = useVisitStore((s) => s.activeVisit);
  const setActiveVisit = useVisitStore((s) => s.setActiveVisit);
  const [radius, setRadius] = useState(5000);
  const [places, setPlaces] = useState([]);
  const [myVisits, setMyVisits] = useState([]);
  const [checkingInId, setCheckingInId] = useState('');
  const [bookmarkingId, setBookmarkingId] = useState('');
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  const loadNearby = async () => {
    if (!location) throw new Error('Location required');
    if (isAuthenticated) {
      const visitsRes = await run(visitsApi.myVisits());
      setMyVisits(visitsRes.data || []);
    }
    const res = await run(placesApi.nearby({ lat: location.latitude, lng: location.longitude, radius }), 'Nearby places loaded');
    setPlaces(res.data?.data || []);
  };

  const getVisitLabel = (place) => {
    const state = getVisitState(myVisits, place._id);
    if (state === VISIT_STATES.ACTIVE_CHECKIN) return 'active_checkin';
    if (state === VISIT_STATES.VERIFIED) return 'verified';
    if (state === VISIT_STATES.COMPLETED_UNVERIFIED) return 'completed_unverified';
    return 'not_visited';
  };

  const checkInFromNearby = async (place) => {
    if (!location) throw new Error('Use GPS or manual location first.');
    if (!isAccurateEnoughForCheckIn(location.accuracy)) {
      throw new Error('Check-in requires GPS accuracy <= 50m.');
    }
    if (activeVisit) {
      throw new Error('You already have an active check-in. Check out first.');
    }
    setCheckingInId(place._id);
    try {
      const res = await run(
        visitsApi.checkIn({
          placeId: place._id,
          userLocation: { type: 'Point', coordinates: [location.longitude, location.latitude] },
          accuracy: location.accuracy,
        }),
        'Visit started (check-in done)'
      );
      setActiveVisit(res.data);
      const visitsRes = await run(visitsApi.myVisits());
      setMyVisits(visitsRes.data || []);
    } finally {
      setCheckingInId('');
    }
  };

  const addBookmarkFromNearby = async (place) => {
    setBookmarkingId(place._id);
    try {
      await run(bookmarksApi.add(place._id), 'Bookmarked');
    } finally {
      setBookmarkingId('');
    }
  };

  return (
    <div className="space-y-3">
      <h1 className="text-base font-semibold">Nearby Places</h1>
      {!isAuthenticated && (
        <p className="text-xs text-gray-600">Login as user/admin to fetch nearby places.</p>
      )}
      <div className="border p-2 flex gap-2 items-center flex-wrap">
        <button className="border px-2 py-1 text-xs" onClick={fetchLocation} disabled={loading}>{loading ? 'loading...' : 'Use GPS'}</button>
        <input className="border px-2 py-1 text-xs w-28" placeholder="manual lat" value={manualLat} onChange={(e) => setManualLat(e.target.value)} />
        <input className="border px-2 py-1 text-xs w-28" placeholder="manual lng" value={manualLng} onChange={(e) => setManualLng(e.target.value)} />
        <button
          className="border px-2 py-1 text-xs"
          onClick={() => setManualLocation({ latitude: manualLat, longitude: manualLng, accuracy: 30 })}
          disabled={!manualLat || !manualLng}
        >
          Use Manual
        </button>
        <input className="border px-2 py-1 text-xs w-24" value={radius} onChange={(e) => setRadius(Number(e.target.value || 5000))} />
        <button className="border px-2 py-1 text-xs" onClick={loadNearby} disabled={!location || !isAuthenticated}>Fetch</button>
        {location && <span className="text-xs">acc:{Math.round(location.accuracy)}m</span>}
      </div>
      {location && (
        <p className="text-xs text-gray-600">
          Using radius {radius}m around your selected location. Nearby verified places in this radius will be shown.
        </p>
      )}
      <p className="text-xs text-gray-600">
        Visit can stay active. For verified visit status, stay around 5+ minutes and check-out within ~150m.
      </p>
      <PlaceList
        places={places}
        getVisitLabel={getVisitLabel}
        onCheckIn={isAuthenticated ? checkInFromNearby : undefined}
        checkingInId={checkingInId}
        canCheckIn={Boolean(isAuthenticated && location && isAccurateEnoughForCheckIn(location.accuracy) && !activeVisit)}
        onBookmark={isAuthenticated ? addBookmarkFromNearby : undefined}
        bookmarkingId={bookmarkingId}
        canBookmark={isAuthenticated}
      />
    </div>
  );
}
