import loginBgImage from '@/assets/login/background.webp';
import googleLogo from '@/assets/login/logoGoogle.svg';
import naverLogo from '@/assets/login/logoNaver.svg';
import kakaoLogo from '@/assets/login/logoKakao.svg';

import { useState } from 'react';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth.tsx';
import { Button } from '../components/Button.tsx';
import type { Provider } from '../types/user.ts';

const WORDS = ['누구나', 'J처럼', '여행하기'];

export const LoginPage = () => {
  const { user, loading } = useAuth();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const handleSocialLogin = (provider: Provider) => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <img
        src={loginBgImage}
        className="absolute inset-0 h-full w-full object-cover"
        alt="login background"
      />

      <div className="relative z-10 flex flex-col min-h-dvh">
        <section className="flex-1 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white animate-fade">{WORDS[index]}</h1>
        </section>
        <div className="flex-[2]" />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-white text-sm">간편 로그인으로 여행 시작하기</p>
          <section className="flex gap-4">
            <Button
              onClick={() => handleSocialLogin('google')}
              className="rounded-full p-3 shadow-md size-14 flex items-center justify-center cursor-pointer bg-google"
            >
              <img src={googleLogo} alt="google login" className="size-6" />
            </Button>
            <Button
              onClick={() => handleSocialLogin('naver')}
              className="rounded-full p-3 shadow-md size-14 flex items-center justify-center cursor-pointer bg-naver"
            >
              <img src={naverLogo} alt="naver login" className="size-6" />
            </Button>
            <Button
              onClick={() => handleSocialLogin('kakao')}
              className="rounded-full p-3 shadow-md size-14 flex items-center justify-center cursor-pointer bg-kakao"
            >
              <img src={kakaoLogo} alt="kakao login" className="size-6" />
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
};
