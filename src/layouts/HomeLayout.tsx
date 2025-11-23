import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from './Footer.tsx';
import { Header } from './Header.tsx';
import { hiddenHeaderPage, headerTitleMap, showFooterPages } from '../constants/layoutConfig.ts';
import type { AppPath, HeaderPath } from '../types/routes.ts';

export const HomeLayout = () => {
  const { pathname } = useLocation();
  const showHeader = !hiddenHeaderPage.includes(pathname as AppPath);
  const showFooter = showFooterPages.includes(pathname as AppPath);
  const headerTitle = headerTitleMap[pathname as HeaderPath];

  return (
    <div className="flex min-h-dvh justify-center bg-slate-50">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between gap-4 bg-white/95 shadow-xl shadow-slate-200/60">
        {showHeader && <Header text={headerTitle} />}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        {showFooter && <Footer />}
      </div>
    </div>
  );
};
