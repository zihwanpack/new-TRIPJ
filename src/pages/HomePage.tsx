import { useAuth } from '../hooks/useAuth.tsx';
import { Header } from '../layouts/Header.tsx';

export const HomePage = () => {
  const { user } = useAuth();

  return (
    <>
      <Header title="홈" />
      <section className="flex flex-col items-start m-3">
        <div className="flex flex-col">
          <p className="text-xl font-bold color-primary-base">여행자 {user?.nickname}님</p>
          <p className="text-sm text-gray-500">3일 후 떠날 준비 되셨나요?</p>
        </div>
      </section>
    </>
  );
};
