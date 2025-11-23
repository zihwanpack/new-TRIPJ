import axios, { type InternalAxiosRequestConfig } from 'axios';
import { tokenManager } from '../../utils/tokenManager';

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

httpClient.interceptors.request.use(
  (config: CustomInternalAxiosRequestConfig) => {
    const token = tokenManager.get();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let pendingRequests: ((token: string) => void)[] = [];

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as CustomInternalAxiosRequestConfig;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingRequests.push((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(httpClient(original));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await httpClient.post('/auth/refresh');

        const newToken = res.data.accessToken;

        tokenManager.set(newToken);

        pendingRequests.forEach((cb) => cb(newToken));
        pendingRequests = [];
        isRefreshing = false;

        original.headers.Authorization = `Bearer ${newToken}`;
        return httpClient(original);
      } catch (err) {
        isRefreshing = false;
        pendingRequests = [];
        tokenManager.set(null);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
