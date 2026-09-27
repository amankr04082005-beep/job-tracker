const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  let res;

  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Cannot reach the server. Check that the backend is running.', 0);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.message || 'Something went wrong', res.status);
  return data;
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),

  getJobs: ({ status, search } = {}) => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (search) params.set('search', search);
    const qs = params.toString();
    return request(`/jobs${qs ? `?${qs}` : ''}`);
  },
  getStats: () => request('/jobs/stats/summary'),
  createJob: (body) => request('/jobs', { method: 'POST', body }),
  updateJob: (id, body) => request(`/jobs/${id}`, { method: 'PUT', body }),
  deleteJob: (id) => request(`/jobs/${id}`, { method: 'DELETE' }),
};
