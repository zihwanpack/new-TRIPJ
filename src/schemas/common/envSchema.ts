import { z } from 'zod';

export const envSchema = z.object({
  VITE_API_URL: z.url('API URL이 올바르지 않습니다.'),
  VITE_GOOGLE_MAPS_API_KEY: z.string().min(1, 'Google Maps API Key가 올바르지 않습니다.'),
  VITE_GOOGLE_MAP_ID: z.string().min(1, 'Google Map ID가 올바르지 않습니다.'),
  VITE_GOOGLE_CALLBACK_URL: z.url('Google Callback URL이 올바르지 않습니다.'),
  VITE_KAKAO_CALLBACK_URL: z.url('Kakao Callback URL이 올바르지 않습니다.'),
  VITE_NAVER_CALLBACK_URL: z.url('Naver Callback URL이 올바르지 않습니다.'),
  VITE_APP_FCM_API_KEY: z.string().min(1, 'FCM API Key가 올바르지 않습니다.'),
  VITE_APP_FCM_AUTH_DOMAIN: z.string().min(1, 'FCM Auth Domain가 올바르지 않습니다.'),
  VITE_APP_FCM_PROJECT_ID: z.string().min(1, 'FCM Project ID가 올바르지 않습니다.'),
  VITE_APP_FCM_STORAGE_BUCKET: z.string().min(1, 'FCM Storage Bucket가 올바르지 않습니다.'),
  VITE_APP_FCM_MESSAGING_SENDER_ID: z
    .string()
    .min(1, 'FCM Messaging Sender ID가 올바르지 않습니다.'),
  VITE_APP_FCM_APP_ID: z.string().min(1, 'FCM App ID가 올바르지 않습니다.'),
  VITE_APP_FCM_MEASUREMENT_ID: z.string().min(1, 'FCM Measurement ID가 올바르지 않습니다.'),
});

export const env = envSchema.parse(import.meta.env);
