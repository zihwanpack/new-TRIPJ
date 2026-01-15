import type {
  GetUsersByEmailResponse,
  SearchUsersResponse,
  WithdrawParam,
  WithdrawResponse,
} from '../types/user.ts';
import { authenticatedClient } from './client/authenticatedClient.ts';
import { UserError } from '../errors/customErrors.ts';
import { requestHandler } from './util/requestHandler.ts';
import { userListSchema, type UserListResponse } from '../schemas/userSchema.ts';
import z from 'zod';

export const getSearchUsersApi = async (query: string): Promise<UserListResponse> => {
  return requestHandler({
    request: () => authenticatedClient.get<SearchUsersResponse>(`/users/search?query=${query}`),
    ErrorClass: UserError,
    schema: userListSchema,
  });
};

export const getUsersByEmailApi = async (emails: string[]): Promise<UserListResponse> => {
  return requestHandler({
    request: () => authenticatedClient.post<GetUsersByEmailResponse>(`/users/emails`, { emails }),
    ErrorClass: UserError,
    schema: userListSchema,
  });
};

export const withdrawApi = async ({ id }: WithdrawParam): Promise<null> => {
  return requestHandler({
    request: () => authenticatedClient.delete<WithdrawResponse>(`/users/${id}`),
    ErrorClass: UserError,
    schema: z.null(),
  });
};
