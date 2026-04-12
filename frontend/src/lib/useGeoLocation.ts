"use client";

import { useState, useCallback } from "react";

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface UseGeoLocationReturn {
  location: GeoLocation | null;
  error: string;
  loading: boolean;
  getLocation: () => void;
}

/**
 * Shared hook for GPS-based location fetching.
 * Replaces manual lat/lng inputs and duplicated navigator.geolocation logic.
 *
 * Usage:
 *   const { location, error, loading, getLocation } = useGeoLocation();
 *
 * Then call getLocation() when the user clicks "Use My Location".
 */
export function useGeoLocation(): UseGeoLocationReturn {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getLocation = useCallback(() => {
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
      },
      (geoError) => {
        setLoading(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError(
            "Location permission denied. Please allow location access and try again."
          );
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
  }, []);

  return { location, error, loading, getLocation };
}
