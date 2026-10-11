import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000
});

// Request interceptor - attach token
api.interceptors.request.use((config) => {
  const stored = JSON.parse(localStorage.getItem('auth-store') || '{}');
  const token = stored?.state?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auth-store');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
