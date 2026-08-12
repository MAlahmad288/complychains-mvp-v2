const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        ...options.headers
      }
    });

    if (res.status === 401) {
      this.clearToken();
      window.location.hash = '#/login';
      throw new Error('Session expired');
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  get(endpoint) { return this.request(endpoint); }
  post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); }
  patch(endpoint, body) { return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }); }
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
}

export const api = new ApiClient();

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  logout: () => { api.clearToken(); }
};

export const auditsApi = {
  list: () => api.get('/audits'),
  create: (data) => api.post('/audits', data),
  uploadEvidence: (id, data) => api.post(`/audits/${id}/evidence`, data),
  evaluate: (id) => api.post(`/audits/${id}/evaluate`)
};

export const frameworksApi = {
  list: () => api.get('/frameworks')
};

export const certificatesApi = {
  list: () => api.get('/certificates'),
  download: (id) => api.get(`/certificates/${id}/download`)
};

export const casesApi = {
  list: () => api.get('/cases'),
  create: (data) => api.post('/cases', data)
};