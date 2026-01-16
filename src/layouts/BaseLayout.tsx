import { AnimatePresence } from 'framer-motion';
import { useLocation, useOutlet } from 'react-router-dom';
import { PageTransition } from '../components/common/PageTransition';

export const BaseLayout = () => {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className="flex min-h-dvh justify-center bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between gap-4 bg-white/95 dark:bg-slate-900/95 shadow-xl shadow-slate-200/60 dark:shadow-slate-900/60">
        <main className="flex-1 overflow-hidden text-slate-900 dark:text-slate-100">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>{outlet}</PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
