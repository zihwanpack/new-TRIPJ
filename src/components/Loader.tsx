export const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-20 animate-fadeIn">
      <div className="w-12 h-12 border-4 border-[#3ACC97] border-t-transparent rounded-full animate-spin animate-floating" />

      <p className="mt-4 text-sm text-gray-700 animate-pulse">로딩중입니다…</p>
    </div>
  );
};
