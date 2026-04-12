'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useGeoLocation } from '@/lib/useGeoLocation';

export default function HomePage() {
  const { location, error: geoError, loading: geoLoading, getLocation } = useGeoLocation();
  const [radius, setRadius] = useState('5000');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFetchNearby = async () => {
    setError('');
    setResponse(null);
    if (!location) {
      setError('Location is required. Click "Use My Location" first.');
      return;
    }

    try {
      const data = await api.getNearbyPlaces(location.latitude, location.longitude, parseInt(radius) || 5000);
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>WanderPath API Testing Console</h1>
      
      <section style={{ marginBottom: '3rem', padding: '1rem', border: '1px solid #ddd' }}>
        <h2 style={{ marginBottom: '1rem' }}>Nearby Places</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <button
            onClick={handleUseMyLocation}
            style={{ padding: '0.5rem 1rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            Use My Location
          </button>
          {location && (
            <p style={{ marginTop: '0.75rem' }}>
              Lat: {location.latitude.toFixed(6)} | Lng: {location.longitude.toFixed(6)} | Accuracy: {Math.round(location.accuracy)}m
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Radius (meters):</label>
          <input
            type="text"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            placeholder="5000"
            style={{ padding: '0.5rem', width: '300px', border: '1px solid #ccc' }}
          />
        </div>

        <button
          onClick={handleFetchNearby}
          disabled={!location}
          style={{ padding: '0.5rem 1rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Fetch Nearby Places
        </button>
      </section>

      {error && (
        <div style={{ padding: '1rem', background: '#fee', border: '1px solid #c00', marginBottom: '1rem' }}>
          <strong>Error:</strong>
          <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{error}</pre>
        </div>
      )}

      {response && (
        <div>
          <h3>Response:</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto', border: '1px solid #ddd' }}>
            {JSON.stringify(response, null, 2)}
          </pre>

          {response.data && response.data.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3>Places List:</h3>
              <ul>
                {response.data.map((place: any, idx: number) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>
                    <strong>{place.name}</strong> - {place.distance ? `${place.distance.toFixed(2)}m` : 'N/A'} 
                    {place._id && ` (ID: ${place._id})`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
