/**
 * API Client configured for Enterprise HRMS Backend (Node.js/Express)
 * Falls back gracefully to local Mock DB when backend server is offline.
 */

const API_BASE_URL = 'http://localhost:5000/api/v1';

export const apiClient = {
  get: async <T>(endpoint: string): Promise<T | null> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        return (json?.data !== undefined ? json.data : json) as T;
      }
      return null;
    } catch {
      return null;
    }
  },

  post: async <T>(endpoint: string, body: any): Promise<T | null> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        return (json?.data !== undefined ? json.data : json) as T;
      }
      return null;
    } catch {
      return null;
    }
  },
};
