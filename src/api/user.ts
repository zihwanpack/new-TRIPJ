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

export const getSearchUsersApi = async (query: string): Promise<UserSummary[]> => {
  return requestHandler(
    () => authenticatedClient.get<SearchUsersResponse>(`/users/search?query=${query}`),
    UserError
  );
};

export const getUsersByEmailApi = async (emails: string[]): Promise<UserSummary[]> => {
  return requestHandler(
    () =>
      authenticatedClient.post<GetUsersByEmailResponse>(`/users/emails`, {
        emails,
      }),
    UserError
  );
};

export const withdrawApi = async ({ id }: WithdrawParam): Promise<null> => {
  return requestHandler(
    () => authenticatedClient.delete<WithdrawResponse>(`/users/${id}`),
    UserError
  );
};
