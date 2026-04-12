'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function PlacesPage() {
  const [placeId, setPlaceId] = useState('');
  const [visitId, setVisitId] = useState('');
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState('');

  const handleUseMyLocation = () => {
    setError('');
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (geoError) => {
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError('Location permission denied. Please allow location access.');
          return;
        }
        setError(`Unable to fetch location: ${geoError.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleCheckIn = async () => {
    setError('');
    setResponse(null);
    if (!location) {
      setError('Location is required. Click "Use My Location" first.');
      return;
    }
    try {
      const data = await api.checkIn(placeId, location);
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCheckOut = async () => {
    setError('');
    setResponse(null);
    if (!location) {
      setError('Location is required. Click "Use My Location" first.');
      return;
    }
    try {
      const data = await api.checkOut(visitId, location);
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddReview = async () => {
    setError('');
    setResponse(null);
    try {
      const data = await api.addReview(visitId, parseInt(rating), comment);
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Place Testing</h1>

      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd' }}>
        <h2 style={{ marginBottom: '1rem' }}>Location</h2>
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
      </section>

      <section style={{ marginBottom: '3rem', padding: '1rem', border: '1px solid #ddd' }}>
        <h2 style={{ marginBottom: '1rem' }}>Check-In</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Place ID:</label>
          <input
            type="text"
            value={placeId}
            onChange={(e) => setPlaceId(e.target.value)}
            placeholder="Enter place ID"
            style={{ padding: '0.5rem', width: '300px', border: '1px solid #ccc' }}
          />
        </div>

        <button
          onClick={handleCheckIn}
          disabled={!location}
          style={{ padding: '0.5rem 1rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Check-In
        </button>
      </section>

      <section style={{ marginBottom: '3rem', padding: '1rem', border: '1px solid #ddd' }}>
        <h2 style={{ marginBottom: '1rem' }}>Check-Out</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Visit ID:</label>
          <input
            type="text"
            value={visitId}
            onChange={(e) => setVisitId(e.target.value)}
            placeholder="Enter visit ID from check-in response"
            style={{ padding: '0.5rem', width: '300px', border: '1px solid #ccc' }}
          />
        </div>

        <button
          onClick={handleCheckOut}
          disabled={!location}
          style={{ padding: '0.5rem 1rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Check-Out
        </button>
      </section>

      <section style={{ marginBottom: '3rem', padding: '1rem', border: '1px solid #ddd' }}>
        <h2 style={{ marginBottom: '1rem' }}>Add Review</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Visit ID:</label>
          <input
            type="text"
            value={visitId}
            onChange={(e) => setVisitId(e.target.value)}
            placeholder="Enter visit ID"
            style={{ padding: '0.5rem', width: '300px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Rating (1-5):</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            style={{ padding: '0.5rem', width: '300px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your review comment"
            rows={4}
            style={{ padding: '0.5rem', width: '300px', border: '1px solid #ccc' }}
          />
        </div>

        <button
          onClick={handleAddReview}
          style={{ padding: '0.5rem 1rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Add Review
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
        </div>
      )}
    </div>
  );
}
