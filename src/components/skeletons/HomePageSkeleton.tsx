import { TripCardSkeleton } from './TripCardSkeleton.tsx';

export const HomePageSkeleton = () => {
  return (
    <div className="flex flex-col justify-around h-full overflow-hidden mx-3">
      <div className="flex flex-col h-10">
        <div className="h-5 w-40 bg-gray-300 rounded animate-pulse" />
        <div className="h-5 w-32 bg-gray-300 rounded animate-pulse mt-2" />
      </div>

      <section className="flex flex-col items-start gap-3">
        <div className="flex flex-row gap-3 items-center">
          <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
          <div className="h-4 w-6 bg-gray-300 rounded animate-pulse" />
        </div>

        <div className="w-full flex gap-4 flex-nowrap snap-x snap-mandatory overflow-x-auto scrollbar-hide">
          <TripCardSkeleton size="large" />
          <TripCardSkeleton size="large" />
          <TripCardSkeleton size="large" />
        </div>
      </section>

      <section className="flex flex-col items-start gap-3 mt-6">
        <div className="flex flex-row gap-3 justify-between w-full">
          <div className="flex flex-row gap-3 items-center">
            <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-6 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>

        <div className="w-full flex gap-4 flex-nowrap snap-x snap-mandatory overflow-x-auto scrollbar-hide">
          <TripCardSkeleton size="small" />
          <TripCardSkeleton size="small" />
          <TripCardSkeleton size="small" />
        </div>
      </section>
    </div>
  );
};
