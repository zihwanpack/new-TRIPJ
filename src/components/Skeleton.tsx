interface SkeletonProps {
  width: string;
  height: string;
  className?: string;
}

export const Skeleton = ({ width, height, className }: SkeletonProps) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded-md ${className}`}
      style={{ width, height }}
    ></div>
  );
};
