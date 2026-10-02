const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // In the browser
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // When running locally on localhost or local network Wi-Fi without reverse proxy
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
    if (hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.endsWith('.local')) {
      return `${window.location.protocol}//${hostname}:5000/api`;
    }
    // In production on Vercel, requests to /api are rewritten directly to the backend service
    return '/api';
  }
  // Server-side (SSR / Server Actions / Route Handlers) via Vercel service binding
  if (process.env.BACKEND_URL) {
    return `${process.env.BACKEND_URL}/api`;
  }
  return 'http://localhost:5000/api';
};

const BASE_URL = getBaseUrl();

const api = {
  getHeaders: () => {
    const headers = {
      'Content-Type': 'application/json',
    };
    const token = typeof window !== 'undefined' ? localStorage.getItem('shopnex_token') : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  get: async (endpoint) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: api.getHeaders(),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  },

  post: async (endpoint, body) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: api.getHeaders(),
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  },

  put: async (endpoint, body) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: api.getHeaders(),
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  },

  delete: async (endpoint) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: api.getHeaders(),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  },
};

module.exports = api;
