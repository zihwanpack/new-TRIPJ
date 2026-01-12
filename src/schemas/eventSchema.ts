import { z } from 'zod';

export const eventFormSchema = z.object({
  eventName: z
    .string()
    .min(1, '이벤트 이름을 입력해주세요')
    .max(30, '이벤트 이름은 30자 이내로 입력해주세요')
    .trim(),
  location: z.string().min(1, '여행지를 선택해주세요').trim(),
  startDate: z.string().min(1, '출발일을 선택해주세요'),
  endDate: z.string().min(1, '도착일을 선택해주세요'),
  cost: z.array(
    z.object({
      id: z.number(),
      category: z.string().min(1, '카테고리를 선택해주세요'),
      value: z.number().min(1, '값을 입력해주세요'),
    })
  ),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export const eventSchema = z.object({
  tripId: z.number(),
  eventId: z.number(),
  eventName: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  cost: z.array(z.object({ id: z.number().optional(), category: z.string(), value: z.number() })),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  placeImage: z.string().optional(),
});

export const eventListSchema = z.array(eventSchema);

export type EventResponse = z.infer<typeof eventSchema>;

export type EventListResponse = z.infer<typeof eventListSchema>;
