'use client';

import { useState } from 'react';
import { adminApi } from '@/lib/api/admin.api';
import useApi from '@/hooks/useApi';

export default function AdminUsersPage() {
  const { run } = useApi();
  const [userId, setUserId] = useState('');
  const [reason, setReason] = useState('');

  return (
    <div className="space-y-2 max-w-md">
      <h1 className="font-semibold">User Moderation</h1>
      <p className="text-xs text-gray-600">Backend has ban/unban by userId, no user-list endpoint.</p>
      <input className="w-full border p-1" placeholder="user id" value={userId} onChange={(e) => setUserId(e.target.value)} />
      <input className="w-full border p-1" placeholder="ban reason" value={reason} onChange={(e) => setReason(e.target.value)} />
      <div className="flex gap-2">
        <button className="border px-2 py-1" onClick={() => run(adminApi.ban(userId, reason), 'User banned')}>Ban</button>
        <button className="border px-2 py-1" onClick={() => run(adminApi.unban(userId), 'User unbanned')}>Unban</button>
      </div>
    </div>
  );
}
