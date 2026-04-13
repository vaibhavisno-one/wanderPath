import useAuthStore from '@/store/authStore';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';
const GET_COOLDOWN_MS = 1200;
const inFlight = new Map();
const lastGetRequestAt = new Map();
const lastGetResponse = new Map();

function normalize(json) {
  return {
    ok: true,
    data: json?.data,
    message: json?.message || '',
    statusCode: json?.statusCode || 200,
    success: json?.success !== false,
    raw: json,
  };
}

async function parseError(res) {
  let json;
  try {
    json = await res.json();
  } catch {
    json = { message: 'Request failed' };
  }
  const err = new Error(json?.message || 'Request failed');
  err.status = res.status;
  err.payload = json;
  if (res.status === 429) {
    err.rateLimited = true;
    const retryAfter = Number(res.headers.get('retry-after'));
    if (!Number.isNaN(retryAfter) && retryAfter > 0) {
      err.message = `Rate limited. Retry in ${retryAfter}s.`;
    } else {
      err.message = 'Rate limited. Please wait and try again.';
    }
  }
  throw err;
}

async function refreshAccessToken() {
  const { refreshToken, setAccessToken, setAuth, user } = useAuthStore.getState();
  const res = await fetch(`${API_BASE}/auth/refresh-token`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) throw new Error('Refresh token failed');
  const json = await res.json();
  setAccessToken(json?.data?.accessToken || null);
  setAuth({ user, accessToken: json?.data?.accessToken || null, refreshToken: json?.data?.refreshToken || refreshToken });
  return json?.data?.accessToken;
}

export async function apiRequest(path, options = {}, retry = true) {
  const { accessToken, logout } = useAuthStore.getState();
  const method = (options.method || 'GET').toUpperCase();
  const reqKey = `${method}:${path}`;
  const isAuthRoute = path.startsWith('/auth/');

  if (method === 'GET') {
    const inFlightRequest = inFlight.get(reqKey);
    if (inFlightRequest) return inFlightRequest;

    const lastAt = lastGetRequestAt.get(reqKey) || 0;
    if (Date.now() - lastAt < GET_COOLDOWN_MS) {
      const cached = lastGetResponse.get(reqKey);
      if (cached) return cached;
    }
    lastGetRequestAt.set(reqKey, Date.now());
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const execute = async () => {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const shouldTryRefresh = res.status === 401 && retry && Boolean(accessToken) && !isAuthRoute;
    if (shouldTryRefresh) {
      try {
        const newToken = await refreshAccessToken();
        return apiRequest(path, {
          ...options,
          headers: { ...(options.headers || {}), Authorization: `Bearer ${newToken}` },
        }, false);
      } catch {
        logout();
        throw new Error('Session expired. Please login again.');
      }
    }

    if (!res.ok) return parseError(res);
    const json = await res.json();
    const normalized = normalize(json);
    if (method === 'GET') {
      lastGetResponse.set(reqKey, normalized);
    }
    return normalized;
  };

  if (method !== 'GET') {
    return execute();
  }

  const requestPromise = execute().finally(() => {
    inFlight.delete(reqKey);
  });
  inFlight.set(reqKey, requestPromise);
  return requestPromise;
}
