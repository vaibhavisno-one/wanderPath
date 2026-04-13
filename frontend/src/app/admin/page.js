'use client';

import Link from 'next/link';
import { useState } from 'react';
import { adminApi } from '@/lib/api/admin.api';
import { reviewsApi } from '@/lib/api/reviews.api';
import useApi from '@/hooks/useApi';
import useAuth from '@/hooks/useAuth';

export default function AdminDashboardPage() {
  const { run } = useApi();
  const { isAdmin } = useAuth();
  const [userId, setUserId] = useState('');
  const [banReason, setBanReason] = useState('policy violation');
  const [reviewId, setReviewId] = useState('');

  if (!isAdmin) {
    return <p className="text-xs text-red-700">Admin access required.</p>;
  }

  return (
    <div className="space-y-3">
      <h1 className="font-semibold text-base">Admin Dashboard</h1>

      <div className="border p-2 text-xs flex gap-3 flex-wrap">
        <Link href="/admin/queue" className="underline">Queue</Link>
        <Link href="/admin/flagged" className="underline">Flagged Reviews</Link>
        <Link href="/admin/stats" className="underline">Stats</Link>
        <Link href="/admin/users" className="underline">Users</Link>
      </div>

      <div className="border p-2 space-y-2">
        <h2 className="font-semibold">User Power</h2>
        <input className="border p-1 w-full" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <input className="border p-1 w-full" placeholder="Ban reason" value={banReason} onChange={(e) => setBanReason(e.target.value)} />
        <div className="flex gap-2">
          <button className="border px-2 py-1" onClick={() => run(adminApi.ban(userId, banReason), 'User banned')}>Ban User</button>
          <button className="border px-2 py-1" onClick={() => run(adminApi.unban(userId), 'User unbanned')}>Unban User</button>
        </div>
      </div>

      <div className="border p-2 space-y-2">
        <h2 className="font-semibold">Review Power</h2>
        <input className="border p-1 w-full" placeholder="Review ID" value={reviewId} onChange={(e) => setReviewId(e.target.value)} />
        <button className="border px-2 py-1" onClick={() => run(reviewsApi.remove(reviewId), 'Review removed')}>Remove Review</button>
        <p className="text-[11px] text-gray-600">Place delete endpoint is not available in backend; only moderation approve/reject exists.</p>
      </div>
    </div>
  );
}
