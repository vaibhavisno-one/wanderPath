"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "../../components/AuthForm";
import { apiFetch } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (form) => {
    setLoading(true);
    setError("");
    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullname: form.fullname,
          username: form.username,
          email: form.email,
          password: form.password
        })
      });
      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm mode="register" onSubmit={handleRegister} loading={loading} error={error} />;
}
