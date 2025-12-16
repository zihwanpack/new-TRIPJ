import { z } from 'zod';

export const tripSchema = z.object({
  destination: z.string().min(1, '여행지를 선택해주세요'),
  startDate: z.string().min(1, '출발일을 선택해주세요'),
  endDate: z.string().min(1, '도착일을 선택해주세요'),
  members: z.array(z.string()),
  title: z
    .string()
    .min(1, '여행 제목을 입력해주세요')
    .max(30, '여행 제목은 30자 이내로 입력해주세요'),
  createdBy: z.string(),
});

export type TripFormValues = z.infer<typeof tripSchema>;
