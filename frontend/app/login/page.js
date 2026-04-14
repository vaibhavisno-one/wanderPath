"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "../../components/AuthForm";
import { apiFetch } from "../../lib/api";
import { saveAuth } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (form) => {
    setLoading(true);
    setError("");

    const payload = { password: form.password };
    if (form.identifier.includes("@")) payload.email = form.identifier;
    else payload.username = form.identifier;

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

      if (res.data?.user?.role === "admin") router.push("/admin");
      else router.push("/places");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm mode="login" onSubmit={handleLogin} loading={loading} error={error} />;
}
