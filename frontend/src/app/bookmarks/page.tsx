'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function BookmarksPage() {
  const [placeId, setPlaceId] = useState('');
  const [bookmarkId, setBookmarkId] = useState('');
  const [bookmarks, setBookmarks] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState('');

  const handleGetBookmarks = async () => {
    setError('');
    setResponse(null);
    try {
      const data = await api.getBookmarks();
      setBookmarks(data);
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddBookmark = async () => {
    setError('');
    setResponse(null);
    try {
      const data = await api.addBookmark(placeId);
      setResponse(data);
      alert('Bookmark added! Refresh list to see it.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveBookmark = async () => {
    setError('');
    setResponse(null);
    try {
      const data = await api.removeBookmark(bookmarkId);
      setResponse(data);
      alert('Bookmark removed! Refresh list to see updated list.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Bookmarks</h1>

      <section style={{ marginBottom: '3rem', padding: '1rem', border: '1px solid #ddd' }}>
        <h2 style={{ marginBottom: '1rem' }}>Get Bookmarks</h2>
        
        <button
          onClick={handleGetBookmarks}
          style={{ padding: '0.5rem 1rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Fetch Bookmarks
        </button>
      </section>

      <section style={{ marginBottom: '3rem', padding: '1rem', border: '1px solid #ddd' }}>
        <h2 style={{ marginBottom: '1rem' }}>Add Bookmark</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Place ID:</label>
          <input
            type="text"
            value={placeId}
            onChange={(e) => setPlaceId(e.target.value)}
            placeholder="Enter place ID to bookmark"
            style={{ padding: '0.5rem', width: '300px', border: '1px solid #ccc' }}
          />
        </div>

        <button
          onClick={handleAddBookmark}
          style={{ padding: '0.5rem 1rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Add Bookmark
        </button>
      </section>

      <section style={{ marginBottom: '3rem', padding: '1rem', border: '1px solid #ddd' }}>
        <h2 style={{ marginBottom: '1rem' }}>Remove Bookmark</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Bookmark ID:</label>
          <input
            type="text"
            value={bookmarkId}
            onChange={(e) => setBookmarkId(e.target.value)}
            placeholder="Enter bookmark ID to remove"
            style={{ padding: '0.5rem', width: '300px', border: '1px solid #ccc' }}
          />
        </div>

        <button
          onClick={handleRemoveBookmark}
          style={{ padding: '0.5rem 1rem', background: '#c00', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Remove Bookmark
        </button>
      </section>

      {bookmarks && bookmarks.data && bookmarks.data.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Your Bookmarks:</h3>
          <ul>
            {bookmarks.data.map((bookmark: any, idx: number) => (
              <li key={idx} style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #ddd', background: '#f9f9f9' }}>
                <p><strong>Bookmark ID:</strong> {bookmark._id}</p>
                <p><strong>Place:</strong> {bookmark.placeId?.name || bookmark.placeId}</p>
                {bookmark.placeId?.location && (
                  <p><strong>Location:</strong> [{bookmark.placeId.location.coordinates[1]}, {bookmark.placeId.location.coordinates[0]}]</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {bookmarks && bookmarks.data && bookmarks.data.length === 0 && (
        <p>No bookmarks found.</p>
      )}

      {error && (
        <div style={{ padding: '1rem', background: '#fee', border: '1px solid #c00', marginBottom: '1rem' }}>
          <strong>Error:</strong>
          <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{error}</pre>
        </div>
      )}

      {response && (
        <div>
          <h3>Last Response:</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto', border: '1px solid #ddd' }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
