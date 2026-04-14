"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export default function HomePage() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    apiFetch("/users/me").then((res) => setMe(res.data)).catch(() => setMe(null));
  }, []);

  return (
    <div>
      <h1>WanderPath</h1>
      <p>Minimal frontend aligned with backend APIs.</p>

      {me ? (
        <p>Logged in as <strong>{me.username}</strong> ({me.role})</p>
      ) : (
        <p>You are not logged in.</p>
      )}

      <div className="card">
        <Link href="/places">Go to Places</Link>
      </div>
    </div>
  );
}
