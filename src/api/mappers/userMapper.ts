import type { RawUser, User } from '../../types/user.ts';

export const userMapper = (raw: RawUser): User => {
  return {
    id: raw.id,
    provider: raw.provider,
    email: raw.email,
    userImage: raw.user_image,
    nickname: raw.nickname,
    userMemo: raw.user_memo,
    createdAt: raw.created_at,
    createdBy: raw.created_by,
  };
};
