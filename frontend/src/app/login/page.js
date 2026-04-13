'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import useApi from '@/hooks/useApi';

export default function LoginPage() {
  const router = useRouter();
  const { run } = useApi();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      className="max-w-sm border p-3 space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const payload = identifier.includes('@') ? { email: identifier, password } : { username: identifier, password };
        await run(login(payload), 'Logged in');
        router.push('/');
      }}
    >
      <h1 className="font-semibold">Login</h1>
      <input className="w-full border p-1" placeholder="email or username" autoComplete="username" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
      <input className="w-full border p-1" placeholder="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="border px-2 py-1">Login</button>
    </form>
  );
}
