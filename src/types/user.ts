import type { SuccessResponse } from './defaultResponse.ts';

export type Provider = 'google' | 'kakao' | 'naver';

export type User = {
  id: number;
  provider: Provider;
  email: string;
  userImage: string | null;
  nickname: string;
  userMemo?: string;
  createdAt: string;
  createdBy?: string;
};

export type UserSummary = Pick<User, 'id' | 'email' | 'nickname' | 'provider' | 'userImage'>;

export type SearchUsersResponse = SuccessResponse<UserSummary[]>;

export type GetUsersByEmailResponse = SuccessResponse<UserSummary[]>;
