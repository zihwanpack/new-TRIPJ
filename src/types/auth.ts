import type { SuccessResponse } from './defaultResponse.ts';
import type { User } from './user.ts';

export type GetUserResponse = SuccessResponse<User>;

export type LogoutResponse = SuccessResponse<null>;

export type AuthContextValue = {
  user: User | null;
  logout: () => Promise<void>;
  withdrawal: () => Promise<void>;
  loading: boolean;
};
