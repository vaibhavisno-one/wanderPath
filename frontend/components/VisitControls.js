"use client";

import { useMemo, useState } from "react";
import { apiFetch } from "../lib/api";

function geoPoint(lat, lng) {
  return { type: "Point", coordinates: [Number(lng), Number(lat)] };
}

export default function VisitControls({ placeId, visits, onRefresh }) {
  const [gps, setGps] = useState({ lat: null, lng: null, accuracy: 0 });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const activeVisit = useMemo(
    () => visits.find((v) => String(v.place?._id || v.place) === String(placeId) && !v.checkOutTime),
    [visits, placeId]
  );

  const hasVerifiedVisit = useMemo(
    () => visits.some((v) => String(v.place?._id || v.place) === String(placeId) && v.isVerified === true),
    [visits, placeId]
  );

  const readGPS = () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy || 0
        });
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const checkIn = async () => {
    if (gps.lat === null || gps.lng === null) {
      setError("GPS required for check-in");
      return;
    }

    setLoading(true);
    setError("");
    setStatus("");
    try {
      await apiFetch("/visits/check-in", {
        method: "POST",
        body: JSON.stringify({
          placeId,
          userLocation: geoPoint(gps.lat, gps.lng),
          accuracy: Number(gps.accuracy || 0)
        })
      });
      setStatus("Checked in successfully");
      await onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkOut = async () => {
    if (!activeVisit?._id) {
      setError("No active visit to check out");
      return;
    }

    if (gps.lat === null || gps.lng === null) {
      setError("GPS required for check-out");
      return;
    }

    setLoading(true);
    setError("");
    setStatus("");
    try {
      const res = await apiFetch("/visits/check-out", {
        method: "POST",
        body: JSON.stringify({
          visitId: activeVisit._id,
          userLocation: geoPoint(gps.lat, gps.lng),
          accuracy: Number(gps.accuracy || 0)
        })
      });
      setStatus(res.message || "Check-out completed");
      await onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Visit Controls</h3>
      <button type="button" onClick={readGPS} disabled={loading}>Use My Location</button>
      <p>GPS: {gps.lat ?? "-"}, {gps.lng ?? "-"} (accuracy {gps.accuracy || 0}m)</p>

      <div className="row">
        <button type="button" onClick={checkIn} disabled={loading || gps.lat === null || gps.lng === null}>
          {loading ? "Working..." : "Check In"}
        </button>
        <button type="button" onClick={checkOut} disabled={loading || !activeVisit || gps.lat === null || gps.lng === null}>
          {loading ? "Working..." : "Check Out"}
        </button>
      </div>

      <p>Active visit: {activeVisit ? activeVisit._id : "None"}</p>
      <p className={hasVerifiedVisit ? "status-ok" : "status-warn"}>
        {hasVerifiedVisit ? "Visit Verified" : activeVisit ? "Not Verified" : "Not Verified"}
      </p>

      {status && <p className="status-ok">{status}</p>}
      {error && <p className="status-bad">{error}</p>}
    </div>
  );
}
