import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-950">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">404 😥</h1>
      <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line mb-6">
        페이지를 찾을 수 없어요
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          to="/"
          className="w-full px-4 py-3 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl shadow hover:bg-slate-700 dark:hover:bg-slate-200 active:scale-[0.97] transition"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};
