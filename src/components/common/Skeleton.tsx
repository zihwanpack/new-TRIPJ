import clsx from 'clsx';

interface SkeletonProps {
  width: string;
  height: string;
  className?: string;
}

export const Skeleton = ({ width, height, className }: SkeletonProps) => {
  return (
    <div
      className={clsx('animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md', className)}
      style={{ width, height }}
    ></div>
  );
};
