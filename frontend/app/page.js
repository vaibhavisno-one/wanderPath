"use client";

import { useState } from "react";
import LocationFetcher from "../components/LocationFetcher";
import PlaceCard from "../components/PlaceCard";
import { apiFetch } from "../lib/api";

export default function HomePage() {
  const [coords, setCoords] = useState({ lat: null, lng: null, accuracy: 0 });
  const [radius, setRadius] = useState(5000);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNearby = async () => {
    if (coords.lat === null || coords.lng === null) {
      setError("Please set latitude and longitude first.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await apiFetch(`/places/nearby?lat=${coords.lat}&lng=${coords.lng}&radius=${radius}`);
      setPlaces(res.data?.data || []);
    } catch (err) {
      setError(err.message);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>WanderPath</h1>
      <LocationFetcher onChange={setCoords} />

      <div className="card">
        <h3>Nearby Places</h3>
        <input
          type="number"
          placeholder="Radius meters"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
        />
        <button type="button" onClick={fetchNearby} disabled={loading || coords.lat === null || coords.lng === null}>
          {loading ? "Loading..." : "Fetch Nearby"}
        </button>
      </div>

      {places.map((place) => <PlaceCard key={place._id} place={place} />)}
      {!loading && places.length === 0 && <p>No places loaded.</p>}
      {error && <p className="status-bad">{error}</p>}
    </div>
  );
}
