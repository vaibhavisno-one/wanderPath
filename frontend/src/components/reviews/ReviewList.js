export default function ReviewList({ reviews }) {
  if (!reviews?.length) return <p className="text-xs text-gray-600">No reviews to display.</p>;
  return (
    <div className="space-y-1">
      {reviews.map((r) => (
        <div key={r._id} className="border p-2 text-xs">
          <div className="flex justify-between">
            <span>{r.user?.fullname || r.user?.username || 'user'}</span>
            <span>{r.rating}/5</span>
          </div>
          <p>{r.comment}</p>
          <p className="text-[10px] uppercase">{r.flagged ? 'flagged' : r.approved ? 'approved' : 'pending'}</p>
        </div>
      ))}
    </div>
  );
}
