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
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const useSelectedLocation = () => {
    setForm((prev) => ({
      ...prev,
      lat: location.lat !== null ? String(location.lat) : "",
      lng: location.lng !== null ? String(location.lng) : ""
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

      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        throw new Error("Latitude and longitude must be valid numbers");
      }

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("address", form.address);
      formData.append("city", form.city);
      formData.append("state", form.state);
      formData.append("country", form.country);
      formData.append("location", JSON.stringify({
        type: "Point",
        coordinates: [lng, lat]
      }));

      images.forEach((file) => {
        formData.append("images", file);
      });

      await apiFetch("/places", {
        method: "POST",
        body: formData
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
      setImages([]);
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
        <label>Images (required)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(Array.from(e.target.files || []))}
          disabled={loading}
        />
        {images.length > 0 && <p>{images.length} image(s) selected</p>}

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
            form.lng === "" ||
            images.length === 0
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
