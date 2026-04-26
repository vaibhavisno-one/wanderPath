"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/api";
import VisitControls from "../../../components/VisitControls";
import ReviewForm from "../../../components/ReviewForm";

export default function PlaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const placeId = params?.id;

  const [place, setPlace] = useState(null);
  const [visits, setVisits] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verified = useMemo(
    () => visits.some((v) => String(v.place?._id || v.place) === String(placeId) && v.isVerified === true),
    [visits, placeId]
  );

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [placeRes, visitRes, reviewRes] = await Promise.all([
        apiFetch(`/places/${placeId}`),
        apiFetch("/visits/my-visits"),
        apiFetch(`/reviews/place/${placeId}`)
      ]);

      setPlace(placeRes.data);
      setVisits(visitRes.data || []);
      setReviews(reviewRes.data || []);

      try {
        const me = await apiFetch("/users/me");
        if (me.data?.role === "admin") {
          const queueRes = await apiFetch("/admin/queue");
          setQueue(queueRes.data || []);
        } else {
          setQueue([]);
        }
      } catch {
        setQueue([]);
      }
    } catch (err) {
      if (/Unauthorized|access token|request/i.test(err.message)) {
        router.push("/login");
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (placeId) load();
  }, [placeId]);

  const pendingReview = queue.some(
    (item) => item.type === "review" && item.status === "pending" && String(item.targetId?._id || item.targetId) !== ""
  );

  return (
    <div>
      <h2>Place Details</h2>
      {loading && <p>Loading...</p>}

      {place && (
        <div className="card">
          <h3>{place.name}</h3>
          <p>{place.description}</p>
          <p>{place.address}, {place.city}, {place.state}, {place.country}</p>
          <p className={place.isVerified ? "status-ok" : "status-warn"}>
            {place.isVerified ? "Approved" : "Pending Approval"}
          </p>
        </div>
      )}

      <VisitControls placeId={placeId} visits={visits} onRefresh={load} />

      <ReviewForm placeId={placeId} canSubmit={verified} onSubmitted={load} />

      <div className="card">
        <h3>Reviews</h3>
        {reviews.length === 0 ? (
          <p>No approved reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="visit-item">
              <p>
                <strong>{review.user?.fullname || review.user?.username || "User"}</strong> · Rating: {review.rating}/5
              </p>
              <p>{review.comment}</p>
              {Array.isArray(review.images) && review.images.length > 0 && (
                <div className="visit-meta">
                  {review.images.map((img) => (
                    <a key={img.public_id || img.url} href={img.url} target="_blank" rel="noreferrer">
                      View image
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <p className={verified ? "status-ok" : "status-warn"}>{verified ? "Visit Verified" : "Not Verified"}</p>
      {pendingReview && <p className="status-warn">Pending Approval</p>}

      {error && <p className="status-bad">{error}</p>}
    </div>
  );
}
