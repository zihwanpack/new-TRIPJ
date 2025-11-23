import type { AuthMeResponse } from '../types/login.ts';
import { httpClient } from './http/httpClient.ts';
import { userMapper } from './mappers/userMapper.ts';

export const authAPI = {
  me: async () => {
    const res = await httpClient.get<AuthMeResponse>('/auth/me');
    return {
      accessToken: res.data.access_token,
      user: userMapper(res.data.user),
    };
  },
  logout: () => httpClient.post('/auth/logout'),
};
