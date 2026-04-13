import PlaceDetail from '@/components/places/PlaceDetail';

export default async function PlacePage({ params }) {
  const p = await params;
  return <PlaceDetail placeId={p.id} />;
}
