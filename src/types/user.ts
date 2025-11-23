export type Provider = 'google' | 'kakao' | 'naver';

export type RawUser = {
  id: string;
  provider: Provider;
  email: string;
  user_image: string;
  nickname: string;
  user_memo: string;
  created_at: string;
  created_by: string;
};

export type User = {
  id: string;
  provider: Provider;
  email: string;
  userImage: string;
  nickname: string;
  userMemo: string;
  createdAt: string;
  createdBy?: string;
};
