export const PLACE_STATES = {
  VERIFIED: 'verified',
  PENDING: 'pending',
  REJECTED: 'rejected',
};

export const VISIT_STATES = {
  NOT_VISITED: 'not_visited',
  ACTIVE_CHECKIN: 'active_checkin',
  COMPLETED_UNVERIFIED: 'completed_unverified',
  VERIFIED: 'verified',
};

export const REVIEW_STATES = {
  NOT_ALLOWED: 'not_allowed',
  ALLOWED: 'allowed',
  PENDING: 'pending',
  APPROVED: 'approved',
  FLAGGED: 'flagged',
};

export function getPlaceState(place, moderationStatus) {
  if (place?.isVerified) return PLACE_STATES.VERIFIED;
  if (moderationStatus === 'rejected') return PLACE_STATES.REJECTED;
  return PLACE_STATES.PENDING;
}

export function getVisitState(visits, placeId) {
  const placeVisits = (visits || []).filter((v) => (v.place?._id || v.place) === placeId);
  if (placeVisits.some((v) => !v.checkOutTime)) return VISIT_STATES.ACTIVE_CHECKIN;
  if (placeVisits.some((v) => v.isVerified)) return VISIT_STATES.VERIFIED;
  if (placeVisits.some((v) => v.checkOutTime && !v.isVerified)) return VISIT_STATES.COMPLETED_UNVERIFIED;
  return VISIT_STATES.NOT_VISITED;
}

export function getReviewState({ review, visitState }) {
  if (review?.flagged) return REVIEW_STATES.FLAGGED;
  if (review?.approved) return REVIEW_STATES.APPROVED;
  if (review && !review.approved) return REVIEW_STATES.PENDING;
  if (visitState === VISIT_STATES.VERIFIED || visitState === VISIT_STATES.ACTIVE_CHECKIN) {
    return REVIEW_STATES.ALLOWED;
  }
  return REVIEW_STATES.NOT_ALLOWED;
}
