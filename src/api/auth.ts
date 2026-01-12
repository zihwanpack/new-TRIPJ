import { AuthError } from '../errors/customErrors.ts';
import { userSchema, type UserResponse } from '../schemas/userSchema.ts';
import type { GetUserResponse, LogoutResponse } from '../types/auth.ts';
import { authenticatedClient } from './client/authenticatedClient.ts';
import { unauthenticatedClient } from './client/unauthenticatedClient.ts';
import { requestHandler } from './util/requestHandler.ts';
import z from 'zod';

export const getUserInfoApi = async (): Promise<UserResponse> => {
  return requestHandler({
    request: () => authenticatedClient.get<GetUserResponse>('/auth/user'),
    ErrorClass: AuthError,
    schema: userSchema,
  });
};

export const logoutApi = async (): Promise<null> => {
  return requestHandler({
    request: () => unauthenticatedClient.post<LogoutResponse>('/users/logout'),
    ErrorClass: AuthError,
    schema: z.null(),
  });
};
