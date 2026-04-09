const API_BASE_URL = 'http://localhost:8000';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(JSON.stringify(data, null, 2));
  }
  return data;
};

export const api = {
  // Auth
  register: async (username, email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  // Places
  getNearbyPlaces: async (latitude, longitude, radius = 5000) => {
    const params = new URLSearchParams({ latitude, longitude, radius });
    const response = await fetch(`${API_BASE_URL}/api/v1/places/nearby?${params}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Visits
  checkIn: async (placeId) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/visits/check-in`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders() 
      },
      body: JSON.stringify({ placeId }),
    });
    return handleResponse(response);
  },

  checkOut: async (visitId) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/visits/check-out`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders() 
      },
      body: JSON.stringify({ visitId }),
    });
    return handleResponse(response);
  },

  // Reviews
  addReview: async (visitId, rating, comment) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/reviews`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders() 
      },
      body: JSON.stringify({ visitId, rating, comment }),
    });
    return handleResponse(response);
  },

  // Admin
  getQueue: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/queue`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  approveReview: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/approve/${id}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  rejectReview: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/reject/${id}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Bookmarks
  getBookmarks: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/bookmarks`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  addBookmark: async (placeId) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/bookmarks`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders() 
      },
      body: JSON.stringify({ placeId }),
    });
    return handleResponse(response);
  },

  removeBookmark: async (bookmarkId) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/bookmarks/${bookmarkId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};
