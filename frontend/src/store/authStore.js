import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/client';

export const useAuthStore = create(persist(
  (set) => ({
    user: null,
    token: null,
    login: async (email, password) => {
      const { data } = await api.post('/auth/login', { email, password });
      set({ user: data.user, token: data.token });
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return data;
    },
    register: async (payload) => {
      const { data } = await api.post('/auth/register', payload);
      set({ user: data.user, token: data.token });
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return data;
    },
    logout: () => {
      set({ user: null, token: null });
      delete api.defaults.headers.common['Authorization'];
    },
    setToken: (token) => {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }),
  { name: 'auth-store' }
));
