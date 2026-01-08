import type {
  GetUsersByEmailResponse,
  SearchUsersResponse,
  UserSummary,
  WithdrawParam,
  WithdrawResponse,
} from '../types/user.ts';
import { authenticatedClient } from './client/authenticatedClient.ts';
import { UserError } from '../errors/customErrors.ts';
import { requestHandler } from './util/requestHandler.ts';
import { userListSchema } from '../schemas/userSchema.ts';

export const getSearchUsersApi = async (query: string): Promise<UserSummary[]> => {
  return requestHandler({
    request: () => authenticatedClient.get<SearchUsersResponse>(`/users/search?query=${query}`),
    ErrorClass: UserError,
    schema: userListSchema,
  });
};

export const getUsersByEmailApi = async (emails: string[]): Promise<UserSummary[]> => {
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
  });
};
