import { AuthError } from '../errors/customErrors.ts';
import { userSchema } from '../schemas/userSchema.ts';
import type { GetUserResponse, LogoutResponse } from '../types/auth.ts';
import type { User } from '../types/user.ts';
import { authenticatedClient } from './client/authenticatedClient.ts';
import { unauthenticatedClient } from './client/unauthenticatedClient.ts';
import { requestHandler } from './util/requestHandler.ts';

export const getUserApi = async (): Promise<User> => {
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
  });
};
