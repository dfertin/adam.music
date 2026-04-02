const API_PREFIX = 'https://adam-music-20.onrender.com/api';

export async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('adam_token') : null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_PREFIX}${path}`, { ...options, headers, body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || res.statusText || 'Ошибка запроса');
    err.status = res.status;
    throw err;
  }
  return data;
}
