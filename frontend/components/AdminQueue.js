"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export default function AdminQueue() {
  const [queue, setQueue] = useState([]);
  const [stats, setStats] = useState(null);
  const [flagged, setFlagged] = useState([]);
  const [identifier, setIdentifier] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const [reason, setReason] = useState("Policy violation");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const [queueRes, statsRes, flaggedRes] = await Promise.all([
        apiFetch("/admin/queue"),
        apiFetch("/admin/stats"),
        apiFetch("/admin/flagged-reviews")
      ]);
      setQueue(queueRes.data || []);
      setStats(statsRes.data || null);
      setFlagged(flaggedRes.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (adminId) => {
    setMessage("");
    setError("");
    try {
      await apiFetch(`/admin/approve/${adminId}`, { method: "POST", body: JSON.stringify({}) });
      setMessage("Content approved");
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const reject = async (adminId) => {
    setMessage("");
    setError("");
    try {
      await apiFetch(`/admin/reject/${adminId}`, {
        method: "POST",
        body: JSON.stringify({ reason })
      });
      setMessage("Content rejected");
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const searchUser = async () => {
    setError("");
    setMessage("");
    try {
      const res = await apiFetch(`/admin/users/search?identifier=${encodeURIComponent(identifier)}`);
      setTargetUser(res.data);
    } catch (err) {
      setTargetUser(null);
      setError(err.message);
    }
  };

  const ban = async () => {
    if (!targetUser?._id) return;
    setError("");
    setMessage("");
    try {
      await apiFetch(`/admin/ban/${targetUser._id}`, {
        method: "POST",
        body: JSON.stringify({ reason })
      });
      setMessage("User banned");
      await searchUser();
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const unban = async () => {
    if (!targetUser?._id) return;
    setError("");
    setMessage("");
    try {
      await apiFetch(`/admin/unban/${targetUser._id}`, {
        method: "POST",
        body: JSON.stringify({})
      });
      setMessage("User unbanned");
      await searchUser();
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="card">
        <h3>Dashboard Metrics</h3>
        <p>Total users: {stats?.totalUsers ?? "-"}</p>
        <p>Total places: {stats?.totalPlaces ?? "-"}</p>
        <p>Pending approvals: {stats?.pendingApprovals ?? "-"}</p>
        <p>Flagged reviews: {stats?.flaggedReviews ?? "-"}</p>
      </div>

      <div className="card">
        <h3>Ban / Unban User</h3>
        <input
          placeholder="Email or username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <button type="button" onClick={searchUser}>Search User</button>
        <input
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        {targetUser && (
          <>
            <p>{targetUser.fullname} ({targetUser.username}) - {targetUser.email}</p>
            <p>Status: {targetUser.isActive ? "Active" : "Banned"}</p>
            <button type="button" onClick={ban}>Ban User</button>
            <button type="button" onClick={unban}>Unban User</button>
          </>
        )}
      </div>

      <div className="card">
        <h3>Pending Moderation Queue</h3>
        {queue.length === 0 && <p>No pending items</p>}
        {queue.map((item) => (
          <div key={item._id} className="card">
            <p>Record ID: {item._id}</p>
            <p>Type: {item.type}</p>
            <p>Target Model: {item.targetModel}</p>
            <p>Status: {item.status}</p>
            <button type="button" onClick={() => approve(item._id)}>Approve</button>
            <button type="button" onClick={() => reject(item._id)}>Reject</button>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Flagged Reviews</h3>
        {flagged.length === 0 && <p>No flagged reviews</p>}
        {flagged.map((item) => (
          <div key={item._id} className="card">
            <p>Review ID: {item._id}</p>
            <p>User: {item.user?.fullname || "-"}</p>
            <p>Place: {item.place?.name || "-"}</p>
            <p>Approved: {item.approved ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>

      {message && <p className="status-ok">{message}</p>}
      {error && <p className="status-bad">{error}</p>}
    </div>
  );
}
