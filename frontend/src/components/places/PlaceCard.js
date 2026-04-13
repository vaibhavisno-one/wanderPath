 'use client';

 import Link from 'next/link';
import PlaceStatusBadge from '@/components/places/PlaceStatusBadge';
import { getPlaceState } from '@/lib/state';

export default function PlaceCard({
  place,
  moderationStatus,
  visitLabel,
  onCheckIn,
  checkingIn,
  canCheckIn,
  onBookmark,
  canBookmark,
  bookmarking,
}) {
  const state = getPlaceState(place, moderationStatus);
  const showVisitButton = onCheckIn && (visitLabel === 'not_visited' || visitLabel === 'completed_unverified');
  return (
    <div className="border border-gray-300 p-2">
      <div className="flex justify-between items-center">
        <Link href={`/place/${place._id}`} className="font-semibold hover:underline">{place.name}</Link>
        <PlaceStatusBadge state={state} />
      </div>
      <p className="text-xs text-gray-700 truncate">{place.description}</p>
      <p className="text-[11px] text-gray-600">{place.city}, {place.state} · rating {place.avgRating || 0} ({place.reviewCount || 0})</p>
      {typeof place.distance !== 'undefined' && <p className="text-[11px]">{Math.round(place.distance)}m away</p>}
      {visitLabel && <p className="text-[11px] text-gray-700 mt-1">visit: {visitLabel}</p>}
      {showVisitButton && (
        <button
          className="border px-2 py-1 text-xs mt-1"
          onClick={() => onCheckIn(place)}
          disabled={!canCheckIn || checkingIn}
        >
          {checkingIn ? 'Checking In...' : visitLabel === 'completed_unverified' ? 'Retry Visit Here' : 'Mark Visit Here'}
        </button>
      )}
      {onBookmark && (
        <button
          className="border px-2 py-1 text-xs mt-1 ml-1"
          onClick={() => onBookmark(place)}
          disabled={!canBookmark || bookmarking}
        >
          {bookmarking ? 'Saving...' : 'Add Bookmark'}
        </button>
      )}
    </div>
  );
}
