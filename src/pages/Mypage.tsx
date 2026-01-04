import { Header } from '../layouts/Header.tsx';
import { Footer } from '../layouts/Footer.tsx';
import { useAuth } from '../hooks/useAuth.tsx';
import { SquareArrowOutUpRight, UserRound } from 'lucide-react';
import stamp1Image from '@/assets/mypage/stamp1.webp';
import stamp2Image from '@/assets/mypage/stamp2.webp';
import stamp3Image from '@/assets/mypage/stamp3.webp';
import toast from 'react-hot-toast';
import { Button } from '../components/Button.tsx';
import { useNavigate } from 'react-router-dom';
import { withdrawApi } from '../api/user.ts';
import { useState } from 'react';
import { ConfirmModal } from '../components/ConfirmModal.tsx';
import { useDispatch } from '../redux/hooks/useCustomRedux.tsx';
import { resetTripState } from '../redux/slices/tripSlice.ts';
import { resetEventState } from '../redux/slices/eventSlice.ts';

export const Mypage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

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
      sessionStorage.clear();
      navigate('/login');
      toast.success('회원탈퇴가 완료되었습니다.');
    } catch {
      toast.error('회원탈퇴 실패');
    }
  };
  return (
    <div className="flex flex-col h-dvh">
      <Header title="마이페이지" />
      <div className="flex flex-col h-full bg-white border-3 border-gray-200 rounded-2xl shadow-sm mx-4">
        <div className="text-xl font-semibold flex items-center mx-6 py-3 gap-2">
          <span className="text-primary-base">J-TRIP</span>
          <span className="text-gray-800">Passport</span>
        </div>
        <div className="flex gap-4 items-center border-y-2 border-gray-200 border-dashed p-5">
          {user?.profileImage ? (
            <img
              src={user?.profileImage ?? ''}
              alt="유저 프로필"
              className="size-24 object-cover border-2 border-gray-200 rounded-2xl"
            />
          ) : (
            <div className="flex items-center justify-center size-24 rounded-3xl border border-gray-200 bg-gray-200 shadow-sm">
              <UserRound className="size-16 text-gray-400" />
            </div>
          )}
          <div className="flex flex-col">
            <p className="text-sm text-primary-base">닉네임</p>
            <p className="text-md font-semibold">{user?.nickname}</p>
            <p className="text-sm text-primary-base">이메일</p>
            <p className="text-sm font-semibold">{user?.email}</p>
          </div>
        </div>
        <div className="flex justify-between">
          <img src={stamp1Image} alt="유저 프로필" className="size-20 object-cover" />
          <img src={stamp3Image} alt="유저 프로필" className="size-20 object-cover" />
        </div>
        <div className="flex-1" />
        <img src={stamp2Image} alt="유저 프로필" className="size-20 object-cover" />
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => copyToClipboard('https://j-trip.store')}
            className="w-4/5 rounded-xl mb-3 bg-gradient-to-r from-emerald-300 to-teal-300 text-white font-semibold flex items-center justify-between shadow-sm active:scale-[0.90] transition"
          >
            <span className="text-base">여행을 좋아하는 친구에게 공유하세요</span>
            <SquareArrowOutUpRight className="size-5 opacity-90" />
          </Button>
        </div>
      </div>
      <div className="flex justify-center gap-3 mt-6 mx-4">
        <Button
          variant="secondary"
          className="px-6 py-2 rounded-md bg-gray-500 text-white border-gray-300 hover:bg-gray-400 flex-1"
          onClick={handleLogout}
        >
          로그아웃
        </Button>

        <Button
          variant="outline"
          className="px-6 py-2 rounded-md text-red-500 border-red-300 hover:bg-red-500 hover:text-white flex-1"
          onClick={() => setIsModalOpen(true)}
        >
          회원탈퇴
        </Button>
      </div>

      <ConfirmModal
        open={isModalOpen}
        title="회원탈퇴"
        description="정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="탈퇴"
        danger
        onClose={() => setIsModalOpen(false)}
        onConfirm={executeWithdrawal}
      />
      <Footer />
    </div>
  );
};
