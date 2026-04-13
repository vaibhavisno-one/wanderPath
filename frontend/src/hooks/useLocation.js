'use client';

import { useState } from 'react';
import { getCurrentPosition } from '@/lib/location';

export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLocation = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCurrentPosition();
      setLocation(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setManualLocation = ({ latitude, longitude, accuracy = 30 }) => {
    const data = {
      latitude: Number(latitude),
      longitude: Number(longitude),
      accuracy: Number(accuracy),
    };
    setLocation(data);
    setError('');
    return data;
  };

  return { location, error, loading, fetchLocation, setManualLocation };
}
