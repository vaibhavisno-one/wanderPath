const ACCESS_TOKEN_KEY = "wanderpath_access_token";
const REFRESH_TOKEN_KEY = "wanderpath_refresh_token";

export function saveAuth({ accessToken, refreshToken, user }) {
  if (typeof window === "undefined") return;
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  if (user) localStorage.setItem("wanderpath_user", JSON.stringify(user));
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem("wanderpath_user");
}

export function getAccessToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(ACCESS_TOKEN_KEY) || "";
}

export function getRefreshToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(REFRESH_TOKEN_KEY) || "";
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("wanderpath_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
