"use client";

import { useState } from "react";

export default function AuthForm({ mode, onSubmit, loading, error }) {
  const isLogin = mode === "login";
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    identifier: "",
    password: ""
  });

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="card">
      <h2>{isLogin ? "Login" : "Register"}</h2>

      {!isLogin && (
        <input
          placeholder="Full name"
          value={form.fullname}
          onChange={(e) => setForm({ ...form, fullname: e.target.value })}
        />
      )}

      {!isLogin && (
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
      )}

      {!isLogin && (
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      )}

      {isLogin && (
        <input
          placeholder="Email or username"
          value={form.identifier}
          onChange={(e) => setForm({ ...form, identifier: e.target.value })}
        />
      )}

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
      </button>

      {error && <p className="status-bad">{error}</p>}
    </form>
  );
}
