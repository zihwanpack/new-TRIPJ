import { z } from 'zod';
import { DESTINATION_KEYS } from '../constants/tripImages.ts';

export const tripFormSchema = z.object({
  title: z
    .string()
    .min(1, '여행 제목을 입력해주세요')
    .max(30, '여행 제목은 30자 이내로 입력해주세요'),
  destinationType: z.enum(['domestic', 'overseas'], {
    message: '여행지 타입을 선택해주세요',
  }),
  destination: z.enum(DESTINATION_KEYS, {
    message: '여행지를 선택해주세요',
  }),
  startDate: z.string().min(1, '출발일을 선택해주세요'),
  endDate: z.string().min(1, '도착일을 선택해주세요'),
  createdBy: z.string(),
  members: z.array(z.string()),
});

export type TripFormValues = z.infer<typeof tripFormSchema>;

export const tripSchema = z.object({
  id: z.number(),
  title: z.string(),
  destination: z.enum(DESTINATION_KEYS),
  destinationType: z.enum(['domestic', 'overseas']),
  startDate: z.string(),
  endDate: z.string(),
  createdBy: z.string().optional(),
  members: z.array(z.string()).optional(),
});

export const tripListSchema = z.array(tripSchema);

export const tripListWithCursorSchema = z.object({
  items: tripListSchema,
  pagination: z.object({
    hasNext: z.boolean(),
    nextCursor: z.number().nullable(),
    limit: z.number(),
  }),
});
