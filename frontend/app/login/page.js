"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { saveAuth } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      password
    };

    if (identifier.includes("@")) payload.email = identifier;
    else payload.username = identifier;

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      saveAuth({
        accessToken: res.data?.accessToken,
        refreshToken: res.data?.refreshToken,
        user: res.data?.user
      });

      if (res.data?.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/places");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit} className="card">
      <h2>Login</h2>
      <input
        placeholder="Email or username"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
      {error && <p className="status-bad">{error}</p>}
    </form>
  );
}
