import type { LOGIN_CONFIG } from '../constants/loginConfig.ts';
import type { RawUser } from './user.ts';

export type IntroPhrase = (typeof LOGIN_CONFIG.INTRO_PHRASES)[number];

export interface AuthMeResponse {
  message: string;
  access_token: string;
  user: RawUser;
}
