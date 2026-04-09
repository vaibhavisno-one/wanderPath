'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function AdminPage() {
  const [queue, setQueue] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFetchQueue = async () => {
    setError('');
    setResponse(null);
    try {
      const data = await api.getQueue();
      setQueue(data);
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleApprove = async (id: string) => {
    setError('');
    setResponse(null);
    try {
      const data = await api.approveReview(id);
      setResponse(data);
      alert('Approved! Refresh queue to see updated list.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleReject = async (id: string) => {
    setError('');
    setResponse(null);
    try {
      const data = await api.rejectReview(id);
      setResponse(data);
      alert('Rejected! Refresh queue to see updated list.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Admin Panel</h1>

      <section style={{ marginBottom: '3rem', padding: '1rem', border: '1px solid #ddd' }}>
        <h2 style={{ marginBottom: '1rem' }}>Review Queue</h2>
        
        <button
          onClick={handleFetchQueue}
          style={{ padding: '0.5rem 1rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Fetch Queue
        </button>
      </section>

      {queue && queue.data && queue.data.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Pending Reviews:</h3>
          {queue.data.map((item: any, idx: number) => (
            <div
              key={idx}
              style={{
                padding: '1rem',
                border: '1px solid #ddd',
                marginBottom: '1rem',
                background: '#f9f9f9',
              }}
            >
              <p><strong>ID:</strong> {item._id}</p>
              <p><strong>User:</strong> {item.userId?.username || item.userId}</p>
              <p><strong>Place:</strong> {item.placeId?.name || item.placeId}</p>
              <p><strong>Rating:</strong> {item.rating}/5</p>
              <p><strong>Comment:</strong> {item.comment}</p>
              <p><strong>Status:</strong> {item.status}</p>
              
              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={() => handleApprove(item._id)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#0a0',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    marginRight: '0.5rem',
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(item._id)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#c00',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {queue && queue.data && queue.data.length === 0 && (
        <p>No pending reviews in queue.</p>
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
