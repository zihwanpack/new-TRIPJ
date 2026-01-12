import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  nickname: z.string(),
  provider: z.enum(['google', 'kakao', 'naver']),
  profileImage: z.string().nullable(),
  userMemo: z.string().optional(),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
});

export const userListSchema = z.array(userSchema);

export type UserResponse = z.infer<typeof userSchema>;

export type UserListResponse = z.infer<typeof userListSchema>;
