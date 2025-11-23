import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

export const ErrorBoundary = () => {
  const error = useRouteError();

  const title = '문제가 발생했어요 😥';

  // 사용자에게 보여줄 메시지
  let message = '예기치 못한 오류가 발생했어요. 잠시 후 다시 시도해주세요.';

  if (isRouteErrorResponse(error)) {
    // loader/action에서 발생한 에러
    message = error.statusText || message;
  } else if (error instanceof Error) {
    // 일반 JS 에러
    message = error.message || message;
  }

  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center text-center p-6 bg-slate-50">
      <h1 className="text-2xl font-bold text-slate-800 mb-3">{title}</h1>
      <p className="text-slate-600 whitespace-pre-line mb-6">{message}</p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          to="/"
          className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl shadow hover:bg-slate-700 active:scale-[0.97] transition"
        >
          홈으로 돌아가기
        </Link>

        <button
          onClick={() => window.location.reload()}
          className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl shadow hover:bg-slate-100 active:scale-[0.97] transition"
        >
          다시 시도하기
        </button>
      </div>
    </div>
  );
};
