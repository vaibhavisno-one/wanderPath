"use client";

import Link from "next/link";

export default function PlaceCard({ place }) {
  const coords = place?.location?.coordinates || [];
  const lng = coords[0];
  const lat = coords[1];

  return (
    <div className="card">
      <h3>{place.name}</h3>
      <p>{place.description}</p>
      <p>{place.address}, {place.city}, {place.state}, {place.country}</p>
      <p>Coordinates: [{lng}, {lat}]</p>
      {typeof place.distance === "number" && <p>Distance: {Math.round(place.distance)} m</p>}
      <p>Rating: {place.avgRating || 0} ({place.reviewCount || 0} reviews)</p>
      <p className={place.isVerified ? "status-ok" : "status-warn"}>
        {place.isVerified ? "Approved" : "Pending Approval"}
      </p>
      <Link href={`/place/${place._id}`}>Open place</Link>
    </div>
  );
}
