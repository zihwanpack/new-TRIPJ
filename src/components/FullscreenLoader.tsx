import { HashLoader } from 'react-spinners';

export const FullscreenLoader = ({
  color = 'var(--color-primary-base)',
  loading = true,
}: {
  color?: string;
  loading?: boolean;
}) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center gap-4">
        <HashLoader
          color={color}
          loading={loading}
          size={80}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <p className="mt-4 text-xl font-extrabold bg-gradient-to-r from-primary-base to-purple-400 bg-clip-text text-transparent animate-pulse">
          잠시만 기다려주세요
        </p>
      </div>
    </div>
  );
};
