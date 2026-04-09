'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    setResponse(null);
    try {
      const data = await api.register(username, email, password);
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogin = async () => {
    setError('');
    setResponse(null);
    try {
      const data = await api.login(email, password);
      setResponse(data);
      if (data.data && data.data.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
        alert('Login successful! Token saved to localStorage');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Authentication</h1>

      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setMode('login')}
          style={{
            padding: '0.5rem 1rem',
            background: mode === 'login' ? '#000' : '#ccc',
            color: mode === 'login' ? '#fff' : '#000',
            border: 'none',
            cursor: 'pointer',
            marginRight: '1rem',
          }}
        >
          Login
        </button>
        <button
          onClick={() => setMode('register')}
          style={{
            padding: '0.5rem 1rem',
            background: mode === 'register' ? '#000' : '#ccc',
            color: mode === 'register' ? '#fff' : '#000',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Register
        </button>
      </div>

      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd' }}>
        <h2 style={{ marginBottom: '1rem' }}>{mode === 'login' ? 'Login' : 'Register'}</h2>

        {mode === 'register' && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ padding: '0.5rem', width: '300px', border: '1px solid #ccc' }}
            />
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '0.5rem', width: '300px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '0.5rem', width: '300px', border: '1px solid #ccc' }}
          />
        </div>

        <button
          onClick={mode === 'login' ? handleLogin : handleRegister}
          style={{ padding: '0.5rem 1rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
      </section>

      {error && (
        <div style={{ padding: '1rem', background: '#fee', border: '1px solid #c00', marginBottom: '1rem' }}>
          <strong>Error:</strong>
          <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{error}</pre>
        </div>
      )}

      {response && (
        <div>
          <h3>Response:</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto', border: '1px solid #ddd' }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
