/**
 * HealthFeast API Client with automatic JWT injection and response handling.
 */

const BASE_URL = import.meta.env.VITE_API_URL || '';

export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const headers = { ...options.headers };

  const token = localStorage.getItem('hf_access_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle FormData vs JSON
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized token expiry
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      const refreshToken = localStorage.getItem('hf_refresh_token');
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
          });
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            localStorage.setItem('hf_access_token', data.access);
            headers['Authorization'] = `Bearer ${data.access}`;
            return fetch(url, { ...options, headers }).then(r => r.json());
          }
        } catch {
          // Token refresh failed, clean up
          localStorage.removeItem('hf_access_token');
          localStorage.removeItem('hf_refresh_token');
        }
      }
    }

    if (!response.ok) {
      let errData;
      try {
        errData = await response.json();
      } catch {
        errData = { error: `Request failed with status ${response.status}` };
      }
      throw new Error(errData.error || errData.message || JSON.stringify(errData));
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}
