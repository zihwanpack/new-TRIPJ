import onHouse from '@/assets/navigation/onHouse.svg';
import offHouse from '@/assets/navigation/offHouse.svg';
import offSuitcaseRolling from '@/assets/navigation/offSuitcaseRolling.svg';
import onSuitcaseRolling from '@/assets/navigation/onSuitcaseRolling.svg';
import onUser from '@/assets/navigation/onUser.svg';
import offUser from '@/assets/navigation/offUser.svg';

import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '../components/common/Button.tsx';

export const Footer = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <footer className="mt-2">
      <nav className="grid grid-cols-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
        <Button
          className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 transition hover:text-slate-900 dark:hover:text-slate-100 cursor-grab"
          onClick={() => navigate('/')}
        >
          <img src={pathname === '/' ? onHouse : offHouse} className="text-base" />
          <span>홈</span>
        </Button>
        <Button
          className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 transition hover:text-slate-900 dark:hover:text-slate-100 cursor-grab"
          onClick={() => navigate('/my-trips')}
        >
          <img
            src={pathname === '/my-trips' ? onSuitcaseRolling : offSuitcaseRolling}
            className="text-base"
          />
          <span>내 여행</span>
        </Button>
        <Button
          className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 transition hover:text-slate-900 dark:hover:text-slate-100 cursor-grab"
          onClick={() => navigate('/mypage')}
        >
          <img src={pathname === '/mypage' ? onUser : offUser} className="text-base" />
          <span>마이페이지</span>
        </Button>
      </nav>
    </footer>
  );
};
