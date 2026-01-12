import { useEffect, useRef, useState } from 'react';
import { Header } from '../layouts/Header.tsx';
import { Footer } from '../layouts/Footer.tsx';
import {
  getMyPastTripsCursorApi,
  getMyUpcomingTripsCursorApi,
  getMyOnGoingTripApi,
} from '../api/trip.ts';
import { useAuthStatus } from '../hooks/user/useAuthStatus.tsx';
import { TripCard } from '../components/trip/TripCard.tsx';
import { TRIP_IMAGE_PATHS } from '../constants/tripImages.ts';
import { useNavigate } from 'react-router-dom';
import { calculateDday, formatDateRange } from '../utils/common/date.ts';
import { Skeleton } from '../components/common/Skeleton.tsx';
import { Button } from '../components/common/Button.tsx';
import { ArrowUpIcon } from 'lucide-react';
import clsx from 'clsx';
import { Typography } from '../components/common/Typography.tsx';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { tripQueryKeys } from '../constants/queryKeys.ts';
import type { Trip } from '../types/trip.ts';
import { FullscreenLoader } from '../components/common/FullscreenLoader.tsx';
import { useMyTripsQueryOptions, useOngoingTripQueryOptions } from '../hooks/query/trip.ts';

export type TripTabStatus = 'upcoming' | 'ongoing' | 'completed';

export const MyTripsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStatus();
  const [tabStatus, setTabStatus] = useState<TripTabStatus>('upcoming');
  const LIMIT = 10;

  const {
    data: tripsData,
    fetchNextPage,
    hasNextPage,
    isLoading: isTripsLoading,
    isFetchingNextPage,
    error: tripsError,
  } = useInfiniteQuery({
    queryKey: tripQueryKeys.listByCursor(user?.id ?? '', tabStatus),
    queryFn: ({ pageParam }: { pageParam: number | null }) => {
      const currentApi =
        tabStatus === 'upcoming' ? getMyUpcomingTripsCursorApi : getMyPastTripsCursorApi;
      return currentApi({
        userId: user!.id,
        cursor: pageParam,
        limit: LIMIT,
      });
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.nextCursor : undefined,
    enabled: !!user?.id && tabStatus !== 'ongoing',
    ...useMyTripsQueryOptions(),
  });

  const {
    data: ongoingTrip,
    isLoading: isOngoingLoading,
    error: ongoingTripError,
  } = useQuery<Trip | null>({
    queryKey: tripQueryKeys.ongoing(user!.id),
    queryFn: () => getMyOnGoingTripApi({ userId: user!.id }),
    enabled: tabStatus === 'ongoing' && !!user?.id,
    ...useOngoingTripQueryOptions(),
  });

  const tripsFromCursor = tripsData?.pages.flatMap((page) => page.items) ?? [];
  const trips: Trip[] =
    tabStatus === 'ongoing' ? (ongoingTrip ? [ongoingTrip] : []) : tripsFromCursor;

  const isInitialLoading = tabStatus === 'ongoing' ? isOngoingLoading : isTripsLoading;
  const isPageLoading = tabStatus === 'ongoing' ? isOngoingLoading : isTripsLoading;
  const pageError = tabStatus === 'ongoing' ? ongoingTripError : tripsError;

  const infiniteScrollTriggerRef = useRef<HTMLDivElement>(null);

  const [showTopButton, setShowTopButton] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setShowTopButton(scrollContainerRef.current.scrollTop > 300);
    }
  };
  const handleScrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current?.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (tabStatus === 'ongoing' || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.5, rootMargin: '100px' }
    );

    if (infiniteScrollTriggerRef.current) {
      observer.observe(infiniteScrollTriggerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, tabStatus]);

  const TRIP_TAB_UI = {
    upcoming: {
      emptyText: '예정된 여행이 없습니다.',
      getBadge: (start: string) => `D-${calculateDday(start)}`,
      showButton: true,
    },
    ongoing: {
      emptyText: '현재 진행 중인 여행이 없습니다.',
      getBadge: () => '진행중',
      showButton: false,
    },
    completed: {
      emptyText: '다녀온 여행이 없습니다.',
      getBadge: (_start: string, end?: string) => `D+${Math.abs(calculateDday(end ?? ''))}`,
      showButton: false,
    },
  } as const;

  const tabUI = TRIP_TAB_UI[tabStatus];

  if (isInitialLoading) {
    return <FullscreenLoader />;
  }

  return (
    <div className="flex flex-col h-dvh relative bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header title="나의 여행" />
      <div className="pt-4 bg-white dark:bg-slate-900 z-10 ">
        <div className="flex p-1 bg-gray-100 dark:bg-slate-800">
          <Button
            onClick={() => setTabStatus('upcoming')}
            className={clsx(
              'flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              tabStatus === 'upcoming'
                ? 'bg-primary-base text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            )}
          >
            예정된 여행
          </Button>

          <Button
            onClick={() => setTabStatus('ongoing')}
            className={clsx(
              'flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              tabStatus === 'ongoing'
                ? 'bg-primary-base text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            )}
          >
            진행중
          </Button>

          <Button
            onClick={() => setTabStatus('completed')}
            className={clsx(
              'flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              tabStatus === 'completed'
                ? 'bg-primary-base text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            )}
          >
            다녀온 여행
          </Button>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-4 p-4 bg-gray-100 dark:bg-slate-900"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        {trips.length > 0 &&
          trips.map((trip) => (
            <TripCard
              key={trip?.id ?? 0}
              onClick={() => navigate(`/trips/${trip.id}`, { state: { from: 'my-trips' } })}
              tripImage={TRIP_IMAGE_PATHS[trip?.destination ?? '']}
              title={trip?.title ?? ''}
              date={formatDateRange(trip?.startDate ?? '', trip?.endDate ?? '')}
              size="myTrips"
              badgeText={tabUI.getBadge(trip?.startDate ?? '', trip?.endDate ?? '')}
            />
          ))}
        {isFetchingNextPage && (
          <>
            <TripCardSkeleton />
            <TripCardSkeleton />
          </>
        )}
        {trips.length === 0 && !pageError && (
          <div className="flex flex-col items-center justify-center h-full mt-20">
            <span className="text-4xl mb-2">✈️</span>
            <Typography variant="helper" color="muted">
              {tabUI.emptyText}
            </Typography>
            {tabUI.showButton && (
              <Button onClick={() => navigate('/trips/new')} className="mt-4 text-primary-base">
                여행 계획하기
              </Button>
            )}
          </div>
        )}
        {tabStatus !== 'ongoing' && !isPageLoading && hasNextPage && (
          <div ref={infiniteScrollTriggerRef} className="h-4" />
        )}
      </div>

      {pageError && (
        <div className="text-center py-4">
          <Typography variant="helper" color="error">
            {pageError?.message}
          </Typography>
        </div>
      )}
      {showTopButton && (
        <Button
          onClick={handleScrollToTop}
          className={clsx(
            'absolute bottom-30 right-5 z-50 p-3 rounded-full shadow-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-700 transition-all duration-300 ease-in-out active:scale-90 active:bg-gray-50 dark:active:bg-slate-800',
            showTopButton
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10 pointer-events-none'
          )}
        >
          <ArrowUpIcon className="w-6 h-6 text-primary-base" />
        </Button>
      )}
      <Footer />
    </div>
  );
};

const TripCardSkeleton = () => {
  return (
    <div className="h-[100px] flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-transparent shrink-0">
      <Skeleton width="70px" height="70px" className="rounded-xl" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton width="60%" height="1.25rem" className="rounded-md" />
        <Skeleton width="40%" height="1rem" className="rounded-md" />
      </div>
    </div>
  );
};
