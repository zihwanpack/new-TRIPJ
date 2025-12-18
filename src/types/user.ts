export type Provider = 'google' | 'kakao' | 'naver';

export type User = {
  id: string;
  provider: Provider;
  email: string;
  userImage: string | null;
  nickname: string;
  userMemo?: string;
  createdAt: string;
  createdBy?: string;
};

export type UserSearchResponse = Pick<User, 'id' | 'email' | 'nickname' | 'provider' | 'userImage'>;

export type GetUsersByEmailApiResponse = Pick<
  User,
  'id' | 'email' | 'nickname' | 'provider' | 'userImage'
>[];
