'use client';

import { useState } from 'react';
import { reviewsApi } from '@/lib/api/reviews.api';
import { REVIEW_STATES } from '@/lib/state';
import useApi from '@/hooks/useApi';
import RatingStars from '@/components/reviews/RatingStars';

export default function ReviewForm({ placeId, visitId, reviewState }) {
  const { run } = useApi();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittedState, setSubmittedState] = useState(null);

  if (reviewState === REVIEW_STATES.NOT_ALLOWED) {
    return <p className="text-xs text-red-700">Review locked: verify visit or active check-in required.</p>;
  }

  if (submittedState === REVIEW_STATES.PENDING) {
    return <p className="text-xs text-yellow-700">Review submitted. Pending admin approval.</p>;
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await run(reviewsApi.create({ placeId, rating, comment }), 'Review submitted');
        setSubmittedState(REVIEW_STATES.PENDING);
      }}
      className="border p-2 space-y-2"
    >
      <RatingStars value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        minLength={10}
        maxLength={1000}
        className="w-full border p-1 text-xs"
        placeholder="10-1000 characters"
        required
      />
      <input type="hidden" value={visitId || ''} readOnly />
      <button className="border px-2 py-1 text-xs" type="submit">Submit Review</button>
    </form>
  );
}
