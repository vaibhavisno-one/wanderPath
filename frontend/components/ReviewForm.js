"use client";

import { useState } from "react";
import { apiFetch } from "../lib/api";

export default function ReviewForm({ placeId, canSubmit, onSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    if (!canSubmit) {
      setError("Verified visit required before review.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch("/reviews", {
        method: "POST",
        body: JSON.stringify({
          placeId,
          rating: Number(rating),
          comment
        })
      });

      if (res.data?.approved) {
        setStatus("Review approved");
      } else {
        setStatus("Pending Approval");
      }
      setComment("");
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h3>Write Review</h3>
      <p className={canSubmit ? "status-ok" : "status-warn"}>
        {canSubmit ? "Visit Verified" : "Not Verified"}
      </p>

      <label>Rating (1-5)</label>
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />

      <label>Comment</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        minLength={10}
        placeholder="At least 10 characters"
      />

      <button type="submit" disabled={loading || !canSubmit || comment.trim().length < 10}>
        {loading ? "Submitting..." : "Submit Review"}
      </button>

      {status && <p className="status-warn">{status}</p>}
      {error && <p className="status-bad">{error}</p>}
    </form>
  );
}
