"use client";

import { useState } from "react";
import { apiFetch } from "../lib/api";

export default function ReviewForm({ placeId, canSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    if (!canSubmit) {
      setError("Review allowed only after verified visit.");
      return;
    }

    try {
      const res = await apiFetch("/reviews", {
        method: "POST",
        body: JSON.stringify({
          placeId,
          rating: Number(rating),
          comment
        })
      });

      const approved = res.data?.approved;
      setStatus(approved ? "Review approved" : "Review pending admin approval");
      setComment("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h3>Write Review</h3>
      {!canSubmit && <p className="status-warn">Verified visit required before review.</p>}
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
      <button type="submit">Submit Review</button>
      {status && <p className="status-warn">{status}</p>}
      {error && <p className="status-bad">{error}</p>}
    </form>
  );
}
