import { clearAuth, getAccessToken, getRefreshToken, saveAuth } from "./auth";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/v1";

async function parseResponse(res) {
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || "Invalid response" };
  }
  return data;
}

async function tryRefresh() {
  const refreshToken = getRefreshToken();
  const res = await fetch(`${API_BASE}/auth/refresh-token`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(refreshToken ? { refreshToken } : {})
  });

  const payload = await parseResponse(res);

  if (!res.ok || !payload?.success) {
    clearAuth();
    return false;
  }

  saveAuth({
    accessToken: payload.data?.accessToken,
    refreshToken: payload.data?.refreshToken
  });

  return true;
}

export async function apiFetch(path, options = {}, retry = true) {
  const token = getAccessToken();
  const headers = {
    ...(options.headers || {})
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers
  });

  if (res.status === 401 && retry && path !== "/auth/refresh-token") {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return apiFetch(path, options, false);
    }
  }

  const payload = await parseResponse(res);

  if (!res.ok || payload?.success === false) {
    const message = payload?.message || `Request failed: ${res.status}`;
    throw new Error(message);
  }

  return payload;
}
