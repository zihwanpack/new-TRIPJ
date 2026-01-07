import { Header } from '../layouts/Header.tsx';
import { Footer } from '../layouts/Footer.tsx';
import { useAuthStatus } from '../hooks/useAuthStatus.tsx';
import { Moon, SquareArrowOutUpRight, UserRound, Sun, Monitor, ArrowRight } from 'lucide-react';
import stamp1Image from '@/assets/mypage/stamp1.webp';
import stamp2Image from '@/assets/mypage/stamp2.webp';
import stamp3Image from '@/assets/mypage/stamp3.webp';
import toast from 'react-hot-toast';
import { Button } from '../components/Button.tsx';
import { useNavigate } from 'react-router-dom';
import { withdrawApi } from '../api/user.ts';
import { useState } from 'react';
import { Modal } from '../components/Modal.tsx';
import { useDispatch } from '../redux/hooks/useCustomRedux.tsx';
import { resetTripState } from '../redux/slices/tripSlice.ts';
import { resetEventState } from '../redux/slices/eventSlice.ts';
import { resetUserState } from '../redux/slices/userSlice.ts';
import { useTheme } from '../hooks/useTheme.tsx';

export const Mypage = () => {
  const { user, logout } = useAuthStatus();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState<boolean>(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);

      toast.success('복사 완료');
    } catch (err) {
      toast.error('복사 실패');
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(resetEventState());
      dispatch(resetTripState());
      dispatch(resetUserState());
      sessionStorage.clear();
      navigate('/login');
    } catch {
      toast.error('로그아웃 실패');
    }
  };
  const executeWithdrawal = async () => {
    if (!user?.id) return;

    try {
      await withdrawApi({ id: user.id });
      dispatch(resetEventState());
      dispatch(resetTripState());
      dispatch(resetUserState());
      sessionStorage.clear();
      navigate('/login');
      toast.success('회원탈퇴가 완료되었습니다.');
    } catch {
      toast.error('회원탈퇴 실패');
    }
  };
  return (
    <div className="flex flex-col h-dvh bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header title="마이페이지" />
      <div className="flex flex-col h-full bg-white border-3 border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm mx-4 relative dark:bg-gray-900">
        <div className="text-xl font-semibold flex items-center mx-6 py-3 gap-2 text-gray-900 dark:text-gray-100">
          <span className="text-primary-base">J-TRIP</span>
          <span className="text-gray-800 dark:text-gray-100">Passport</span>
        </div>
        <div className="flex gap-4 items-center border-y-2 border-gray-200 dark:border-gray-700 border-dashed p-5">
          {user?.profileImage ? (
            <img
              src={user?.profileImage}
              alt="유저 프로필"
              className="size-24 object-cover border-2 border-gray-200 rounded-2xl"
            />
          ) : (
            <div className="flex items-center justify-center size-24 rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 shadow-sm">
              <UserRound className="size-16 text-gray-400" />
            </div>
          )}
          <div className="flex flex-col">
            <p className="text-sm text-primary-base dark:text-primary-dark">닉네임</p>
            <p className="text-md font-semibold text-gray-900 dark:text-gray-100">
              {user?.nickname}
            </p>
            <p className="text-sm text-primary-base dark:text-primary-dark">이메일</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.email}</p>
          </div>
        </div>
        <img
          src={stamp1Image}
          alt="여행 스탬프1"
          className="size-20 object-cover absolute top-40 left-0"
        />
        <img
          src={stamp2Image}
          alt="여행 스탬프2"
          className="size-20 object-cover absolute top-50 right-10"
        />
        <img
          src={stamp3Image}
          alt="여행 스탬프3"
          className="size-20 object-cover absolute bottom-0 left-30"
        />
        <div className="flex justify-center my-4">
          <Button
            size="lg"
            onClick={() => copyToClipboard('https://j-trip.store')}
            className="w-4/5 rounded-xl bg-gradient-to-r from-emerald-300 to-teal-300 text-white font-semibold flex items-center justify-between shadow-sm dark:shadow-slate-900/40 active:scale-[0.90] transition"
          >
            <span className="text-base">여행을 좋아하는 친구에게 공유하세요</span>
            <SquareArrowOutUpRight className="size-5 opacity-90" />
          </Button>
        </div>
        <section className="mx-4 h-50 bg-white dark:bg-gray-900 overflow-hidden">
          <div className="px-4 py-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
            설정
          </div>
          <div className="relative">
            <Button
              onClick={() => setOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <div className="flex items-center gap-1">
                <Moon size={18} />
                <span className="text-sm font-medium">테마</span>
              </div>
              <div className="text-sm text-gray-400 flex items-center gap-1">
                {theme === 'light' && '라이트'}
                {theme === 'dark' && '다크'}
                {theme === 'system' && '시스템'}
                <ArrowRight size={18} />
              </div>
            </Button>
            {open && (
              <div className="absolute right-0 top-9 z-50 w-36 rounded-xl border bg-white dark:bg-gray-900 shadow-lg">
                <Button
                  onClick={() => {
                    setTheme('light');
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Sun size={14} /> 라이트
                </Button>
                <Button
                  onClick={() => {
                    setTheme('dark');
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Moon size={14} /> 다크
                </Button>
                <Button
                  onClick={() => {
                    setTheme('system');
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Monitor size={14} /> 시스템
                </Button>
              </div>
            )}
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700" />
          <Button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm"
          >
            🚪 로그아웃
          </Button>

          <div className="h-px bg-gray-200 dark:bg-gray-700" />

          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
          >
            🗑️ 회원탈퇴
          </Button>
        </section>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="정말 탈퇴하시겠습니까?"
        description={`회원탈퇴시 유저 정보는 되돌릴 수 없습니다.
                      신중하게 결정해주세요`}
        closeOnBackdrop={false}
        children={
          <div className="flex gap-2">
            <Button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-[0.98] border-2 border-gray-100 rounded-xl"
            >
              취소
            </Button>

            <Button
              onClick={executeWithdrawal}
              className="flex-1 bg-red-500 text-white hover:bg-red-600 active:scale-[0.98] border-2 border-red-500 rounded-xl"
            >
              탈퇴
            </Button>
          </div>
        }
      />
      <Footer />
    </div>
  );
};
