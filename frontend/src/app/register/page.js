'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/auth';
import useApi from '@/hooks/useApi';

export default function RegisterPage() {
  const router = useRouter();
  const { run } = useApi();
  const [form, setForm] = useState({ fullname: '', username: '', email: '', password: '' });

  return (
    <form
      className="max-w-sm border p-3 space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        await run(register(form), 'Registered successfully');
        router.push('/login');
      }}
    >
      <h1 className="font-semibold">Register</h1>
      {['fullname', 'username', 'email', 'password'].map((k) => (
        <input
          key={k}
          className="w-full border p-1"
          placeholder={k}
          type={k === 'password' ? 'password' : 'text'}
          value={form[k]}
          onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
          required
        />
      ))}
      <button className="border px-2 py-1">Register</button>
    </form>
  );
}
