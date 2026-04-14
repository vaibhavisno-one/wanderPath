"use client";

import { useState } from "react";

export default function LocationFetcher({ onChange }) {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [accuracy, setAccuracy] = useState(0);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const push = (nextLat, nextLng, nextAccuracy = 0) => {
    setLat(String(nextLat));
    setLng(String(nextLng));
    setAccuracy(nextAccuracy || 0);
    onChange({
      lat: Number(nextLat),
      lng: Number(nextLng),
      accuracy: Number(nextAccuracy || 0)
    });
  };

  const useMyLocation = () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        push(position.coords.latitude, position.coords.longitude, position.coords.accuracy || 0);
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const useManual = () => {
    setError("");
    if (lat === "" || lng === "") {
      setError("Manual latitude and longitude are required");
      return;
    }
    push(Number(lat), Number(lng), accuracy || 0);
  };

  const geocodeName = async () => {
    setError("");
    if (!query.trim()) {
      setError("Location name is required");
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        setError("No location found");
        return;
      }

      push(Number(data[0].lat), Number(data[0].lon), 0);
    } catch {
      setError("Geocoding failed; use GPS or manual input");
    }
  };

  return (
    <div className="card">
      <h3>Location</h3>
      <button type="button" onClick={useMyLocation}>Use My Location</button>

      <div className="row">
        <input
          placeholder="Manual latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
        <input
          placeholder="Manual longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
        />
      </div>

      <button type="button" onClick={useManual}>Use Manual Lat/Lng</button>

      <input
        placeholder="Location name (e.g. Delhi)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="button" onClick={geocodeName}>Use Location Name</button>

      <p>Selected: lat {lat || "-"}, lng {lng || "-"}, accuracy {accuracy || 0}m</p>
      {error && <p className="status-bad">{error}</p>}
    </div>
  );
}
