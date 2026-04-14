"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setSuccess("Registered successfully. Please login.");
      router.push("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit} className="card">
      <h2>Register</h2>
      <input placeholder="Full name" value={form.fullname} onChange={(e) => setForm({ ...form, fullname: e.target.value })} />
      <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
      <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Register</button>
      {success && <p className="status-ok">{success}</p>}
      {error && <p className="status-bad">{error}</p>}
    </form>
  );
}
