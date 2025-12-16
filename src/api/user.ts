import { AxiosError } from 'axios';
import { httpClient } from './http/httpClient.ts';
import type { UserSearchResponse } from '../types/user.ts';
import UserError from '../errors/UserError.ts';

export const getSearchUsersApi = async (query: string): Promise<UserSearchResponse[]> => {
  try {
    const { data } = await httpClient.get<UserSearchResponse[]>(`/users/search?query=${query}`);
    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? error.message;
      throw new UserError(message, status);
    }
    throw new UserError('An unknown error occurred', 500);
  }
};
