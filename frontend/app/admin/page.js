"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import AdminQueue from "../../components/AdminQueue";

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/users/me")
      .then((res) => {
        if (res.data?.role !== "admin") {
          router.push("/places");
          return;
        }
        setReady(true);
      })
      .catch((err) => {
        setError(err.message);
        router.push("/login");
      });
  }, [router]);

  if (!ready) {
    return <p>{error ? `Access check failed: ${error}` : "Checking admin access..."}</p>;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <AdminQueue />
    </div>
  );
}
