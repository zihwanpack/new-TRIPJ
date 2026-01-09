import axios, { type InternalAxiosRequestConfig } from 'axios';
import { env } from '../../schemas/common/envSchema.ts';
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const authenticatedClient = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
});

authenticatedClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const original = error.config as CustomInternalAxiosRequestConfig;

    if (error.response?.status === 401 && original.url?.includes('/auth/token')) {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await authenticatedClient.post('/auth/token');
        return authenticatedClient(original);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
