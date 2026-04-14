"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/api";
import ReviewForm from "../../../components/ReviewForm";

function toGeoPoint(lat, lng) {
  return { type: "Point", coordinates: [Number(lng), Number(lat)] };
}

export default function PlaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const placeId = params?.id;

  const [place, setPlace] = useState(null);
  const [visits, setVisits] = useState([]);
  const [geo, setGeo] = useState({ lat: null, lng: null, accuracy: 0 });
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const activeVisit = useMemo(
    () => visits.find((v) => String(v.place?._id || v.place) === String(placeId) && !v.checkOutTime),
    [visits, placeId]
  );

  const hasVerifiedVisit = useMemo(
    () => visits.some((v) => String(v.place?._id || v.place) === String(placeId) && v.isVerified === true),
    [visits, placeId]
  );

  const load = async () => {
    setError("");
    try {
      const [placeRes, visitRes] = await Promise.all([
        apiFetch(`/places/${placeId}`),
        apiFetch("/visits/my-visits")
      ]);
      setPlace(placeRes.data);
      setVisits(visitRes.data || []);
    } catch (err) {
      if (/Unauthorized|access token|request/i.test(err.message)) {
        router.push("/login");
        return;
      }
      setError(err.message);
    }
  };

  useEffect(() => {
    if (placeId) load();
  }, [placeId]);

  const readGPS = () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({
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
    setError("");
    setStatus("");
    if (geo.lat === null || geo.lng === null) {
      setError("GPS required for check-in");
      return;
    }

    try {
      await apiFetch("/visits/check-in", {
        method: "POST",
        body: JSON.stringify({
          placeId,
          userLocation: toGeoPoint(geo.lat, geo.lng),
          accuracy: Number(geo.accuracy || 0)
        })
      });
      setStatus("Checked in successfully");
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const checkOut = async () => {
    setError("");
    setStatus("");
    if (!activeVisit?._id) {
      setError("No active visit");
      return;
    }
    if (geo.lat === null || geo.lng === null) {
      setError("GPS required for check-out");
      return;
    }

    try {
      const res = await apiFetch("/visits/check-out", {
        method: "POST",
        body: JSON.stringify({
          visitId: activeVisit._id,
          userLocation: toGeoPoint(geo.lat, geo.lng),
          accuracy: Number(geo.accuracy || 0)
        })
      });

      setStatus(res.message || "Checked out");
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Place Details</h2>
      {place && (
        <div className="card">
          <h3>{place.name}</h3>
          <p>{place.description}</p>
          <p>{place.address}, {place.city}, {place.state}, {place.country}</p>
          <p className={place.isVerified ? "status-ok" : "status-warn"}>
            {place.isVerified ? "Approved" : "Pending admin approval"}
          </p>
        </div>
      )}

      <div className="card">
        <h3>Visit Actions (GPS only)</h3>
        <button type="button" onClick={readGPS}>Use My Location</button>
        <p>GPS: {geo.lat ?? "-"}, {geo.lng ?? "-"} (accuracy {geo.accuracy || 0}m)</p>

        <button type="button" onClick={checkIn}>Check In</button>
        <button type="button" onClick={checkOut}>Check Out</button>

        <p>
          Active visit: {activeVisit ? activeVisit._id : "None"}
        </p>
        <p className={hasVerifiedVisit ? "status-ok" : "status-warn"}>
          Verified visit: {hasVerifiedVisit ? "Yes" : "No"}
        </p>
      </div>

      <ReviewForm placeId={placeId} canSubmit={hasVerifiedVisit} />

      {status && <p className="status-ok">{status}</p>}
      {error && <p className="status-bad">{error}</p>}
    </div>
  );
}
