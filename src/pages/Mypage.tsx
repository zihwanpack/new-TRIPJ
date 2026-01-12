import { Header } from '../layouts/Header.tsx';
import { Footer } from '../layouts/Footer.tsx';
import { useAuthStatus } from '../hooks/user/useAuthStatus.tsx';
import {
  Moon,
  SquareArrowOutUpRight,
  UserRound,
  Sun,
  Monitor,
  LogOut,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import stamp1Image from '@/assets/mypage/stamp1.webp';
import stamp2Image from '@/assets/mypage/stamp2.webp';
import stamp3Image from '@/assets/mypage/stamp3.webp';
import toast from 'react-hot-toast';
import { Button } from '../components/common/Button.tsx';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Modal } from '../components/common/Modal.tsx';
import { useTheme } from '../hooks/common/useTheme.tsx';

import clsx from 'clsx';
import { Typography } from '../components/common/Typography.tsx';

export const Mypage = () => {
  const { user, logout, withdrawal } = useAuthStatus();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('복사 완료');
    } catch {
      toast.error('복사 실패');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      sessionStorage.clear();
      localStorage.clear();
      navigate('/login');
    } catch {
      toast.error('로그아웃 실패');
    }
  };
  const executeWithdrawal = async () => {
    try {
      await withdrawal();
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
        <section className="flex-1 bg-gray-50 dark:bg-slate-900/50 px-6  z-10">
          <Typography variant="h3" color="secondary" className="mb-3 ml-1">
            설정
          </Typography>
          <div className="flex flex-col gap-3">
            <div className="relative" ref={dropdownRef}>
              <Button
                onClick={() => setIsThemeDropdownOpen((prev) => !prev)}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 active:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={clsx(
                      'p-2 rounded-xl transition-colors',
                      theme === 'light' &&
                        'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
                      theme === 'dark' &&
                        'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
                      theme === 'system' &&
                        'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    )}
                  >
                    {theme === 'light' && <Sun size={20} />}
                    {theme === 'dark' && <Moon size={20} />}
                    {theme === 'system' && <Monitor size={20} />}
                  </div>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">화면 테마</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-sm font-medium">
                    {theme === 'light' && '라이트'}
                    {theme === 'dark' && '다크'}
                    {theme === 'system' && '시스템'}
                  </span>
                  <ChevronRight
                    size={18}
                    className={clsx('transition-transform', isThemeDropdownOpen && 'rotate-90')}
                  />
                </div>
              </Button>

              {isThemeDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 p-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
                  {(['light', 'dark', 'system'] as const).map((mode) => (
                    <Button
                      key={mode}
                      onClick={() => {
                        setTheme(mode);
                        setIsThemeDropdownOpen(false);
                      }}
                      className={clsx(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                        theme === mode
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      )}
                    >
                      {mode === 'light' && <Sun size={16} />}
                      {mode === 'dark' && <Moon size={16} />}
                      {mode === 'system' && <Monitor size={16} />}
                      {mode === 'light' && '라이트 모드'}
                      {mode === 'dark' && '다크 모드'}
                      {mode === 'system' && '시스템 설정'}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  <LogOut size={20} />
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-200">로그아웃</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </Button>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 active:bg-red-50 dark:active:bg-red-900/20 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500">
                  <Trash2 size={20} />
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-red-500 transition-colors">
                  회원탈퇴
                </span>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-red-400" />
            </Button>
          </div>
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
