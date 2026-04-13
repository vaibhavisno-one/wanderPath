'use client';

import { useState } from 'react';
import { bookmarksApi } from '@/lib/api/bookmarks.api';
import useApi from '@/hooks/useApi';

export default function BookmarksPage() {
  const { run } = useApi();
  const [items, setItems] = useState([]);

  const reload = async () => {
    const res = await run(bookmarksApi.list());
    setItems(res.data?.data || []);
  };

  return (
    <div className="space-y-2">
      <h1 className="font-semibold">Bookmarks</h1>
      <button className="border px-2 py-1 text-xs" onClick={reload}>Refresh</button>
      {items.map((b) => (
        <div key={b._id} className="border p-2 text-xs flex justify-between items-center">
          <span>{b.place?.name || b.place}</span>
          <button className="border px-2" onClick={async () => { await run(bookmarksApi.remove(b.place?._id || b.place), 'Removed'); reload(); }}>remove</button>
        </div>
      ))}
      {!items.length && <p className="text-xs">No bookmarks.</p>}
    </div>
  );
}
