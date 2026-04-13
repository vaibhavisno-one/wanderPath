'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '@/lib/apiClient';
import useApi from '@/hooks/useApi';

export default function ProfilePage() {
  const { run } = useApi();
  const [me, setMe] = useState(null);
  const [form, setForm] = useState({ fullname: '', email: '' });
  const [loading, setLoading] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await run(apiRequest('/users/me'));
      setMe(res.data);
      setForm({ fullname: res.data.fullname || '', email: res.data.email || '' });
    } finally {
      setLoading(false);
    }
  }, [run]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (!me) {
    return (
      <div className="space-y-2">
        <p className="text-xs">{loading ? 'Loading profile...' : 'Profile not loaded.'}</p>
        <button className="border px-2 py-1 text-xs" onClick={loadProfile} disabled={loading}>
          {loading ? 'Loading...' : 'Load Profile'}
        </button>
      </div>
    );
  }

  return (
    <form
      className="max-w-md border p-3 space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await run(apiRequest('/users/profile', { method: 'PUT', body: JSON.stringify(form) }), 'Profile updated');
        setMe(res.data);
      }}
    >
      <h1 className="font-semibold">Profile</h1>
      <p className="text-xs">role: {me.role}</p>
      <input className="w-full border p-1" value={form.fullname} onChange={(e) => setForm((f) => ({ ...f, fullname: e.target.value }))} />
      <input className="w-full border p-1" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
      <button className="border px-2 py-1">Save</button>
      <button type="button" className="border px-2 py-1 ml-2" onClick={loadProfile} disabled={loading}>
        Refresh
      </button>
    </form>
  );
}
