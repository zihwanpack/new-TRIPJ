import type { User } from './user.ts';

export interface GetAuthenticatedUserResponse {
  message: string;
  user: User;
}

export interface LogoutResponse {
  message: string;
  success: boolean;
}

export interface AuthContextValue {
  user: User | null;
  logout: () => Promise<void>;
  loading: boolean;
}
