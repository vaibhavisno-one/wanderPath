"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LocationFetcher from "../../components/LocationFetcher";
import PlaceCard from "../../components/PlaceCard";
import { apiFetch } from "../../lib/api";

export default function PlacesPage() {
  const router = useRouter();
  const [coords, setCoords] = useState({ lat: null, lng: null, accuracy: 0 });
  const [radius, setRadius] = useState(5000);
  const [places, setPlaces] = useState([]);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState("");
  const [me, setMe] = useState(null);

  const [newPlace, setNewPlace] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    lat: "",
    lng: ""
  });

  useEffect(() => {
    apiFetch("/users/me")
      .then((res) => setMe(res.data))
      .catch(() => router.push("/login"));
  }, [router]);

  const loadNearby = async () => {
    setError("");
    if (coords.lat === null || coords.lng === null) {
      setError("Select location first (GPS/manual/name)");
      return;
    }

    try {
      const res = await apiFetch(`/places/nearby?lat=${coords.lat}&lng=${coords.lng}&radius=${radius}`);
      setPlaces(res.data?.data || []);
      setMeta(res.data || null);
    } catch (err) {
      setError(err.message);
    }
  };

  const fillPlaceFromSelectedLocation = () => {
    setNewPlace({
      ...newPlace,
      lat: coords.lat ?? "",
      lng: coords.lng ?? ""
    });
  };

  const createPlace = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const lat = Number(newPlace.lat);
      const lng = Number(newPlace.lng);

      await apiFetch("/places", {
        method: "POST",
        body: JSON.stringify({
          name: newPlace.name,
          description: newPlace.description,
          address: newPlace.address,
          city: newPlace.city,
          state: newPlace.state,
          country: newPlace.country,
          location: {
            type: "Point",
            coordinates: [lng, lat]
          }
        })
      });

      alert("Place submitted for admin review.");
      setNewPlace({
        name: "",
        description: "",
        address: "",
        city: "",
        state: "",
        country: "India",
        lat: "",
        lng: ""
      });
      await loadNearby();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Places</h2>

      <LocationFetcher onChange={setCoords} />

      <div className="card">
        <h3>Find Nearby Places</h3>
        <input
          type="number"
          placeholder="Radius in meters"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
        />
        <button onClick={loadNearby}>Fetch Nearby Places</button>
        {meta && <p>Total: {meta.total} | Page: {meta.page}/{meta.totalPages}</p>}
      </div>

      <div className="card">
        <h3>Create Place (user/admin, goes to approval)</h3>
        <button type="button" onClick={fillPlaceFromSelectedLocation}>Use Selected Location For Place</button>

        <form onSubmit={createPlace}>
          <input placeholder="Name" value={newPlace.name} onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })} />
          <textarea placeholder="Description" value={newPlace.description} onChange={(e) => setNewPlace({ ...newPlace, description: e.target.value })} />
          <input placeholder="Address" value={newPlace.address} onChange={(e) => setNewPlace({ ...newPlace, address: e.target.value })} />
          <div className="row">
            <input placeholder="City" value={newPlace.city} onChange={(e) => setNewPlace({ ...newPlace, city: e.target.value })} />
            <input placeholder="State" value={newPlace.state} onChange={(e) => setNewPlace({ ...newPlace, state: e.target.value })} />
          </div>
          <div className="row">
            <input placeholder="Country" value={newPlace.country} onChange={(e) => setNewPlace({ ...newPlace, country: e.target.value })} />
            <input placeholder="Latitude" value={newPlace.lat} onChange={(e) => setNewPlace({ ...newPlace, lat: e.target.value })} />
          </div>
          <input placeholder="Longitude" value={newPlace.lng} onChange={(e) => setNewPlace({ ...newPlace, lng: e.target.value })} />
          <button type="submit">Submit Place</button>
        </form>
      </div>

      {places.map((place) => <PlaceCard key={place._id} place={place} />)}
      {!places.length && <p>No nearby places loaded yet.</p>}

      {error && <p className="status-bad">{error}</p>}
      {!me && <p className="status-warn">Checking auth...</p>}
    </div>
  );
}
