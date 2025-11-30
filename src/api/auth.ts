import type { GetAuthenticatedUserResponse, LogoutResponse } from '../types/auth.ts';
import { httpClient } from './http/httpClient.ts';

export const getAuthenticatedUserApi = async (): Promise<GetAuthenticatedUserResponse> => {
  const { data } = await httpClient.get<GetAuthenticatedUserResponse>('/auth/user');
  return data;
};

export const logoutApi = async (): Promise<LogoutResponse> => {
  const { data } = await httpClient.post<LogoutResponse>('/auth/logout');
  return data;
};
