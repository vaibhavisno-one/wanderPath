export default function StatsCards({ stats }) {
  if (!stats) return null;
  const rows = [
    ['active users', stats.totalUsers],
    ['places', stats.totalPlaces],
    ['pending approvals', stats.pendingApprovals],
    ['flagged reviews', stats.flaggedReviews],
  ];
  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      {rows.map(([label, val]) => (
        <div key={label} className="border p-2">
          <p className="text-gray-600">{label}</p>
          <p className="font-semibold text-base">{val}</p>
        </div>
      ))}
    </div>
  );
}
