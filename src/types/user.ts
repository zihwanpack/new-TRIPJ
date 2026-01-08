import type { SuccessResponse } from './defaultResponse.ts';

export type Provider = 'google' | 'kakao' | 'naver';

export type User = {
  id: string;
  provider: Provider;
  email: string;
  profileImage: string | null;
  nickname: string;
  userMemo?: string;
  createdAt?: string;
  createdBy?: string;
};

export type UserSummary = Pick<User, 'id' | 'email' | 'nickname' | 'provider' | 'profileImage'>;

export type SearchUsersResponse = SuccessResponse<UserSummary[]>;

export type GetUsersByEmailResponse = SuccessResponse<UserSummary[]>;

export type WithdrawParam = {
  id: string;
};

export type WithdrawResponse = SuccessResponse<null>;
