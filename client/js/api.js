const API_BASE = window.APP_CONFIG?.API_BASE_URL || 'https://blogapplicationback-end.onrender.com/api';

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (getToken()) {
    headers.Authorization = `Bearer ${getToken()}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}

export const api = {
  getPosts(category = '') {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return request(`/posts${query}`);
  },
  getMyPosts() {
    return request('/posts/mine');
  },
  register(payload) {
    return request('/users/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  login(payload) {
    return request('/users/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  logout() {
    return request('/users/logout', { method: 'POST' });
  },
  createPost(payload) {
    return request('/posts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  updatePost(id, payload) {
    return request(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  deletePost(id) {
    return request(`/posts/${id}`, {
      method: 'DELETE',
    });
  },
};

