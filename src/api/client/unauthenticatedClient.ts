import axios from 'axios';

export const unauthenticatedClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
