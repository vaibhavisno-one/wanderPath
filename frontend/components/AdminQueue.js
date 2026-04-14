"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export default function AdminQueue() {
  const [queue, setQueue] = useState([]);
  const [stats, setStats] = useState(null);
  const [identifier, setIdentifier] = useState("");
  const [user, setUser] = useState(null);
  const [reason, setReason] = useState("Policy violation");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [queueRes, statsRes] = await Promise.all([
        apiFetch("/admin/queue"),
        apiFetch("/admin/stats")
      ]);

      const pending = (queueRes.data || []).filter((item) => item.status === "pending");
      setQueue(pending);
      setStats(statsRes.data || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (adminId) => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await apiFetch(`/admin/approve/${adminId}`, { method: "POST", body: JSON.stringify({}) });
      setMessage("Approved");
      await load();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const reject = async (adminId) => {
    if (!reason.trim()) {
      setError("Rejection reason is required");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    try {
      await apiFetch(`/admin/reject/${adminId}`, {
        method: "POST",
        body: JSON.stringify({ reason })
      });
      setMessage("Rejected");
      await load();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const searchUser = async () => {
    if (!identifier.trim()) {
      setError("Email or username required");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await apiFetch(`/admin/users/search?identifier=${encodeURIComponent(identifier)}`);
      setUser(res.data);
    } catch (err) {
      setUser(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ban = async () => {
    if (!user?._id) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await apiFetch(`/admin/ban/${user._id}`, {
        method: "POST",
        body: JSON.stringify({ reason })
      });
      setMessage("User banned");
      await searchUser();
      await load();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const unban = async () => {
    if (!user?._id) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await apiFetch(`/admin/unban/${user._id}`, {
        method: "POST",
        body: JSON.stringify({})
      });
      setMessage("User unbanned");
      await searchUser();
      await load();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h3>Stats</h3>
        {loading && <p>Loading...</p>}
        <p>Total users: {stats?.totalUsers ?? "-"}</p>
        <p>Total places: {stats?.totalPlaces ?? "-"}</p>
        <p>Pending approvals: {stats?.pendingApprovals ?? "-"}</p>
        <p>Flagged reviews: {stats?.flaggedReviews ?? "-"}</p>
      </div>

      <div className="card">
        <h3>Pending Queue</h3>
        <input
          placeholder="Rejection reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        {queue.length === 0 && <p>No pending items.</p>}

        {queue.map((item) => (
          <div key={item._id} className="card">
            <p>Record ID: {item._id}</p>
            <p>Type: {item.type}</p>
            <p>Target: {item.targetModel}</p>
            <p>Status: {item.status}</p>
            <button type="button" onClick={() => approve(item._id)} disabled={loading}>Approve</button>
            <button type="button" onClick={() => reject(item._id)} disabled={loading || !reason.trim()}>
              Reject
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>User Management</h3>
        <input
          placeholder="Email or username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <button type="button" onClick={searchUser} disabled={loading || !identifier.trim()}>
          Search User
        </button>

        {user && (
          <div className="card">
            <p>{user.fullname} ({user.username})</p>
            <p>{user.email}</p>
            <p className={user.isActive ? "status-ok" : "status-bad"}>{user.isActive ? "Active" : "Banned"}</p>
            <button type="button" onClick={ban} disabled={loading}>Ban</button>
            <button type="button" onClick={unban} disabled={loading}>Unban</button>
          </div>
        )}
      </div>

      {message && <p className="status-ok">{message}</p>}
      {error && <p className="status-bad">{error}</p>}
    </div>
  );
}
