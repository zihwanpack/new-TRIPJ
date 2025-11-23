import googleLogo from '@/assets/login/logoGoogle.svg';
import kakaoLogo from '@/assets/login/logoKakao.svg';
import naverLogo from '@/assets/login/logoNaver.svg';
import BG from '@/assets/login/loginBG.webp';

export const LOGIN_CONFIG = {
  SOCIAL_LOGIN: {
    LOGOS: [googleLogo, kakaoLogo, naverLogo] as const,
    PROVIDERS: ['google', 'kakao', 'naver'] as const,
    COLORS: ['bg-white', 'bg-[#FEE500]', 'bg-[#03C75A]'] as const,
  },

  INTRO_PHRASES: ['누구나', 'J처럼', '여행하기'] as const,
  BACKGROUND: {
    image: BG,
  },

  PHRASE_INTERVAL: 2500,
} as const;
