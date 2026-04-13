'use client';

import { useState } from 'react';
import { placesApi } from '@/lib/api/places.api';
import useApi from '@/hooks/useApi';
import useLocation from '@/hooks/useLocation';

export default function AddPlacePage() {
  const { run } = useApi();
  const { location, fetchLocation, loading } = useLocation();
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    lat: '',
    lng: '',
  });

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <form
      className="max-w-xl border p-3 space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        await run(placesApi.create({
          ...form,
          lat: Number(form.lat),
          lng: Number(form.lng),
        }), 'Place submitted for admin review');
      }}
    >
      <h1 className="font-semibold">Add Place</h1>
      <p className="text-xs text-gray-600">New places are created as pending and require admin approval.</p>
      <div className="border p-2 text-xs space-y-2">
        <p className="font-semibold">Location Input</p>
        <p className="text-gray-600">You can use manual coordinates or auto-fill from your current GPS location.</p>
        <button
          type="button"
          className="border px-2 py-1"
          onClick={async () => {
            const gps = await fetchLocation();
            update('lat', String(gps.latitude));
            update('lng', String(gps.longitude));
          }}
          disabled={loading}
        >
          {loading ? 'Fetching GPS...' : 'Use Current GPS'}
        </button>
        {location && <p>GPS accuracy: {Math.round(location.accuracy)}m</p>}
      </div>

      <input className="w-full border p-1" placeholder="Name (max 100)" value={form.name} onChange={(e) => update('name', e.target.value)} required maxLength={100} />
      <textarea className="w-full border p-1 text-xs" placeholder="Description (10-5000 chars)" value={form.description} onChange={(e) => update('description', e.target.value)} required minLength={10} maxLength={5000} />

      <input className="w-full border p-1" placeholder="Address" value={form.address} onChange={(e) => update('address', e.target.value)} required />
      <div className="grid grid-cols-2 gap-2">
        <input className="w-full border p-1" placeholder="City" value={form.city} onChange={(e) => update('city', e.target.value)} required />
        <input className="w-full border p-1" placeholder="State" value={form.state} onChange={(e) => update('state', e.target.value)} required />
      </div>
      <input className="w-full border p-1" placeholder="Country" value={form.country} onChange={(e) => update('country', e.target.value)} />

      <div className="grid grid-cols-2 gap-2">
        <input className="w-full border p-1" type="number" step="any" placeholder="Latitude" value={form.lat} onChange={(e) => update('lat', e.target.value)} required />
        <input className="w-full border p-1" type="number" step="any" placeholder="Longitude" value={form.lng} onChange={(e) => update('lng', e.target.value)} required />
      </div>

      <button className="border px-2 py-1">Submit Place</button>
    </form>
  );
}
