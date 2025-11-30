import { Outlet } from 'react-router-dom';
import { Footer } from './Footer.tsx';

export const DefaultLayout = () => {
  return (
    <div className="flex min-h-dvh justify-center bg-slate-50">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between gap-4 bg-white/95 shadow-xl shadow-slate-200/60">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};
