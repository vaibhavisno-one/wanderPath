"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import AdminQueue from "../../components/AdminQueue";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/users/me")
      .then((res) => {
        if (res.data?.role !== "admin") {
          router.push("/places");
          return;
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        router.push("/login");
      });
  }, [router]);

  if (loading) return <p>{error ? `Access check failed: ${error}` : "Loading..."}</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <AdminQueue />
    </div>
  );
}
