const TOKEN_KEY = 'eu_req_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`/api${path}`, {
    ...options,
    headers,
    body: options.body && !(options.body instanceof FormData) && typeof options.body !== 'string'
      ? JSON.stringify(options.body)
      : options.body,
  });
  const data = await response.json().catch(() => ({ ok: false, error: 'Invalid server response' }));
  if (!response.ok || data.ok === false) {
    const error = new Error(data.error || 'Request failed');
    error.status = response.status;
    error.payload = data;
    throw error;
  }
  return data;
}
