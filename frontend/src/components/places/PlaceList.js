import PlaceCard from '@/components/places/PlaceCard';

export default function PlaceList({
  places,
  getVisitLabel,
  onCheckIn,
  checkingInId,
  canCheckIn,
  onBookmark,
  bookmarkingId,
  canBookmark,
}) {
  if (!places?.length) return <p className="text-xs text-gray-600">No places found.</p>;
  return (
    <div className="grid gap-2">
      {places.map((place) => (
        <PlaceCard
          key={place._id}
          place={place}
          visitLabel={getVisitLabel ? getVisitLabel(place) : undefined}
          onCheckIn={onCheckIn}
          checkingIn={checkingInId === place._id}
          canCheckIn={canCheckIn}
          onBookmark={onBookmark}
          bookmarking={bookmarkingId === place._id}
          canBookmark={canBookmark}
        />
      ))}
    </div>
  );
}
