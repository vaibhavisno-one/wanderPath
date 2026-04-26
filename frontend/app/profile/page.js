"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    username: ""
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const structuredVisits = visits.reduce((acc, visit) => {
    const placeId = String(visit.place?._id || visit.place || "unknown");
    const place = visit.place || {};
    const lastVisitDate = new Date(
      visit.checkOutTime || visit.checkInTime || visit.createdAt || Date.now()
    );
    const lastVisitTimestamp = Number.isNaN(lastVisitDate.getTime())
      ? 0
      : lastVisitDate.getTime();

    if (!acc[placeId]) {
      acc[placeId] = {
        placeId,
        placeName: place.name || "Unknown place",
        address: [place.address, place.city, place.state].filter(Boolean).join(", ") || "Address unavailable",
        totalVisits: 0,
        verifiedVisits: 0,
        activeVisits: 0,
        lastVisitTimestamp
      };
    }

    acc[placeId].totalVisits += 1;
    if (visit.isVerified) acc[placeId].verifiedVisits += 1;
    if (!visit.checkOutTime) acc[placeId].activeVisits += 1;
    if (lastVisitTimestamp > acc[placeId].lastVisitTimestamp) {
      acc[placeId].lastVisitTimestamp = lastVisitTimestamp;
    }

    return acc;
  }, {});

  const visitGroups = Object.values(structuredVisits).sort(
    (a, b) => b.lastVisitTimestamp - a.lastVisitTimestamp
  );

  useEffect(() => {
    const loadUser = async () => {
      try {
        const [userRes, visitsRes] = await Promise.all([
          apiFetch("/users/me"),
          apiFetch("/visits/my-visits")
        ]);

        const user = userRes.data || {};
        setForm({
          fullname: user.fullname || "",
          email: user.email || "",
          username: user.username || ""
        });
        setAvatarUrl(user.avatar?.url || "");
        setVisits(visitsRes.data || []);
      } catch (err) {
        if (/Unauthorized|access token/i.test(err.message)) {
          router.push("/login");
          return;
        }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("fullname", form.fullname);
      formData.append("email", form.email);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const res = await apiFetch("/users/profile", {
        method: "PATCH",
        body: formData
      });

      setAvatarUrl(res.data?.avatar?.url || "");
      setAvatar(null);
      setStatus("Profile updated");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>My Profile</h2>
      <form className="card" onSubmit={submit}>
        <label>Full Name</label>
        <input
          value={form.fullname}
          onChange={(e) => setForm({ ...form, fullname: e.target.value })}
          disabled={saving}
        />

        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          disabled={saving}
        />

        <label>Username</label>
        <input value={form.username} disabled />

        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="Current avatar"
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
          />
        )}

        <label>Avatar (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files?.[0] || null)}
          disabled={saving}
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </form>

      <div className="card">
        <h3>My Visits</h3>
        {visitGroups.length === 0 ? (
          <p>No visits yet.</p>
        ) : (
          visitGroups.map((group) => (
            <div key={group.placeId} className="visit-item">
              <p><strong>{group.placeName}</strong></p>
              <p>{group.address}</p>
              <div className="visit-meta">
                <span>Total visits: {group.totalVisits}</span>
                <span className="status-ok">Verified: {group.verifiedVisits}</span>
                <span className="status-warn">Unverified: {group.totalVisits - group.verifiedVisits}</span>
                {group.activeVisits > 0 && <span>Active: {group.activeVisits}</span>}
                <span>
                  Last visit: {group.lastVisitTimestamp ? new Date(group.lastVisitTimestamp).toLocaleString() : "-"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {status && <p className="status-ok">{status}</p>}
      {error && <p className="status-bad">{error}</p>}
    </div>
  );
}
