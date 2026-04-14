"use client";

import { useState } from "react";
import LocationFetcher from "../../components/LocationFetcher";
import { apiFetch } from "../../lib/api";

export default function AddPlacePage() {
  const [location, setLocation] = useState({ lat: null, lng: null, accuracy: 0 });
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    lat: "",
    lng: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const useSelectedLocation = () => {
    setForm((prev) => ({
      ...prev,
      lat: location.lat ?? "",
      lng: location.lng ?? ""
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setStatus("");

    try {
      const lat = Number(form.lat);
      const lng = Number(form.lng);

      await apiFetch("/places", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          address: form.address,
          city: form.city,
          state: form.state,
          country: form.country,
          location: {
            type: "Point",
            coordinates: [lng, lat]
          }
        })
      });

      setStatus("Pending Approval");
      setForm({
        name: "",
        description: "",
        address: "",
        city: "",
        state: "",
        country: "India",
        lat: "",
        lng: ""
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Place</h2>
      <LocationFetcher onChange={setLocation} />

      <form className="card" onSubmit={submit}>
        <button type="button" onClick={useSelectedLocation} disabled={location.lat === null || location.lng === null}>
          Use My Location
        </button>

        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <div className="row">
          <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
        </div>
        <div className="row">
          <input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          <input placeholder="Latitude" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
        </div>
        <input placeholder="Longitude" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />

        <button
          type="submit"
          disabled={
            loading ||
            !form.name.trim() ||
            !form.description.trim() ||
            !form.address.trim() ||
            !form.city.trim() ||
            !form.state.trim() ||
            form.lat === "" ||
            form.lng === ""
          }
        >
          {loading ? "Submitting..." : "Submit Place"}
        </button>
      </form>

      {status && <p className="status-warn">{status}</p>}
      {error && <p className="status-bad">{error}</p>}
    </div>
  );
}
