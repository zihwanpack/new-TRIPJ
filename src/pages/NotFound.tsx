// src/pages/NotFound.tsx
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center text-center p-6 bg-slate-50">
      <h1 className="text-2xl font-bold text-slate-800 mb-3">404 😥</h1>
      <p className="text-slate-600 whitespace-pre-line mb-6">페이지를 찾을 수 없어요</p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          to="/"
          className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl shadow hover:bg-slate-700 active:scale-[0.97] transition"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
