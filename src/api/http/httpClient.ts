import axios, { type InternalAxiosRequestConfig } from 'axios';
import { camelCaseKeys } from '../../utils/camelCaseKeys';
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

httpClient.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = camelCaseKeys(response.data);
    }
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
        await httpClient.post('/auth/token');
        return httpClient(original);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
