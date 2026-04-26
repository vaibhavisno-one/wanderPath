"use client";

import { useState } from "react";
import { apiFetch } from "../lib/api";

export default function ReviewForm({ placeId, canSubmit, onSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
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
      const formData = new FormData();
      formData.append("placeId", placeId);
      formData.append("rating", String(Number(rating)));
      formData.append("comment", comment);

      images.forEach((file) => {
        formData.append("images", file);
      });

      const res = await apiFetch("/reviews", {
        method: "POST",
        body: formData
      });

      if (res.data?.approved) {
        setStatus("Review approved");
      } else {
        setStatus("Pending Approval");
      }
      setComment("");
      setImages([]);
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
      <label>Images (optional)</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setImages(Array.from(e.target.files || []))}
        disabled={loading}
      />
      {images.length > 0 && <p>{images.length} image(s) selected</p>}

      <button type="submit" disabled={loading || !canSubmit || comment.trim().length < 10}>
        {loading ? "Submitting..." : "Submit Review"}
      </button>

      {status && <p className="status-warn">{status}</p>}
      {error && <p className="status-bad">{error}</p>}
    </form>
  );
}
