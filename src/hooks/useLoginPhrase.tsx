import { useEffect, useState } from 'react';
import { LOGIN_CONFIG } from '../constants/loginConfig.ts';
import type { IntroPhrase } from '../types/login.ts';
import { delay } from '../utils/delay';

export const useIntroPhrase = (): IntroPhrase => {
  const phrases = LOGIN_CONFIG.INTRO_PHRASES;

  const [showPhrase, setShowPhrase] = useState<IntroPhrase>(phrases[0]);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      let idx = 0;

      while (isMounted) {
        await delay(LOGIN_CONFIG.PHRASE_INTERVAL);
        idx = (idx + 1) % phrases.length;
        if (isMounted) setShowPhrase(phrases[idx]);
      }
    };
    run();
    return () => {
      isMounted = false;
    };
  }, [phrases]);

  return showPhrase;
};
