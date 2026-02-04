// Helper to build API URLs that work with the Vite dev proxy (/api -> backend)
// and with a production backend URL set via VITE_API_BASE environment variable.

const DEFAULT_BACKEND = 'https://playradarhub-backend-54816317792.us-central1.run.app/api';

export function apiUrl(path) {
  // Allow explicit override via VITE_API_BASE
  let base = import.meta.env.VITE_API_BASE;
  if (!base) {
    // If no override and running on a non-localhost host, default to the known backend
    if (typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
      base = DEFAULT_BACKEND;
    } else {
      base = '';
    }
  }

  if (!base) return path;
  base = base.replace(/\/$/, '');

  // In source we use relative paths like `/api/endpoint...` so when a base is provided
  // strip the leading /api prefix and append to the base (so backend receives /endpoint)
  if (path.startsWith('/api')) {
    return base + path.replace(/^\/api/, '');
  }
  return base + (path.startsWith('/') ? path : '/' + path);
}

export default apiUrl;
