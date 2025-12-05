export const TripCardSkeleton = ({ size }: { size: 'large' | 'small' }) => {
  const sizes = {
    small: 'w-[160px] h-[140px]',
    large: 'w-[180px] h-[220px]',
  } as const;

  return (
    <article
      className={`rounded-2xl bg-gray-200 animate-pulse flex-shrink-0 snap-start ${sizes[size]}`}
    ></article>
  );
};
