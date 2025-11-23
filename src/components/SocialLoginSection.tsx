import { LOGIN_CONFIG } from '../constants/loginConfig.ts';

export const SocialLoginSection = () => {
  return (
    <section className="flex gap-4">
      {LOGIN_CONFIG.SOCIAL_LOGIN.LOGOS.map((logo, idx) => {
        const provider = LOGIN_CONFIG.SOCIAL_LOGIN.PROVIDERS[idx];
        return (
          <button
            key={provider}
            onClick={() => {
              // ❗백엔드 OAuth 엔드포인트로 이동
              window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
            }}
            className={`${LOGIN_CONFIG.SOCIAL_LOGIN.COLORS[idx]} rounded-full p-3 shadow-md w-14 h-14 flex items-center justify-center cursor-pointer`}
          >
            <img src={logo} alt={`${provider} login`} className="w-6 h-6" />
          </button>
        );
      })}
    </section>
  );
};
