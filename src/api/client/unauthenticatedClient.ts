import axios from 'axios';
import { env } from '../../schemas/common/envSchema.ts';

export const unauthenticatedClient = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
});

unauthenticatedClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
