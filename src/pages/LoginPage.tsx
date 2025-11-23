import { IntroPhraseSection } from '../components/IntroPhraseSection.tsx';
import { SocialLoginSection } from '../components/SocialLoginSection.tsx';
import { LOGIN_CONFIG } from '../constants/loginConfig.ts';
import { useIntroPhrase } from '../hooks/useLoginPhrase.tsx';
import { useLoginPageEffect } from '../hooks/useLoginPageEffect.tsx';

export const LoginPage = () => {
  const introPhrase = useIntroPhrase();
  useLoginPageEffect();

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <img
        src={LOGIN_CONFIG.BACKGROUND.image}
        className="absolute inset-0 h-full w-full object-cover"
        alt=""
      />

      <div className="relative z-10 flex flex-col min-h-dvh">
        <IntroPhraseSection introPhrase={introPhrase} />
        <div className="flex-[2]" />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-white text-sm">간편 로그인으로 여행 시작하기</p>
          <SocialLoginSection />
        </div>
      </div>
    </div>
  );
};
