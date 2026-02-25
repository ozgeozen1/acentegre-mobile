import axios from 'axios';
import { getToken, clearAll } from '@/src/store/authStore';
import { router } from 'expo-router';

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.kesfetmeli.com/api';

export const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// JWT token interceptor
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 auto-logout
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err?.response?.status === 401) {
      await clearAll();
      router.replace('/login' as never);
    }
    const message =
      err?.response?.data?.message ||
      err?.message ||
      'Beklenmeyen bir hata oluştu.';
    return Promise.reject(new Error(message));
  },
);
