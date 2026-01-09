import { useEffect, useRef, useState, useCallback } from 'react';
import { useImmer } from 'use-immer';

import { Header } from '../layouts/Header.tsx';
import { Footer } from '../layouts/Footer.tsx';
import type { Trip } from '../types/trip.ts';
import {
  getMyPastTripsCursorApi,
  getMyUpcomingTripsCursorApi,
  getMyOnGoingTripApi,
} from '../api/trip.ts';
import { useAuthStatus } from '../hooks/useAuthStatus.tsx';
import { TripCard } from '../components/trip/TripCard.tsx';
import { TRIP_IMAGE_PATHS } from '../constants/tripImages.ts';
import { useNavigate } from 'react-router-dom';
import { calculateDday, formatDateRange } from '../utils/common/date.ts';
import { Skeleton } from '../components/common/Skeleton.tsx';
import { Button } from '../components/common/Button.tsx';
import { ArrowUpIcon } from 'lucide-react';
import clsx from 'clsx';
import { Typography } from '../components/common/Typography.tsx';

type TripTabStatus = 'upcoming' | 'ongoing' | 'completed';

export const MyTripsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStatus();
  const [tabStatus, setTabStatus] = useState<TripTabStatus>('upcoming');
  const [trips, setTrips] = useImmer<Trip[]>([]);

  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const LIMIT = 10;
  const infiniteScrollTriggerRef = useRef<HTMLDivElement>(null);

  const [showTopBtn, setShowTopBtn] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setShowTopBtn(scrollContainerRef.current.scrollTop > 300);
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
    setTrips([]);
    setNextCursor(null);
    setHasNext(true);
    setIsLoading(false);
    setError(null);
  }, [tabStatus, setTrips]);

  const fetchTrips = useCallback(async () => {
    if (isLoading || (!hasNext && tabStatus !== 'ongoing') || !user?.id) return;

    try {
      setIsLoading(true);

      if (tabStatus === 'ongoing') {
        const response = await getMyOnGoingTripApi({ userId: user.id });

        setTrips((draft) => {
          draft.length = 0;
          draft.push(response);
        });
        setHasNext(false);
        setNextCursor(null);
      } else {
        const currentApi =
          tabStatus === 'upcoming' ? getMyUpcomingTripsCursorApi : getMyPastTripsCursorApi;

        const response = await currentApi({
          userId: user.id,
          cursor: nextCursor,
          limit: LIMIT,
        });

        setTrips((draft) => {
          draft.push(...response.items);
        });

        setNextCursor(response.pagination.nextCursor);
        setHasNext(response.pagination.hasNext);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabStatus, nextCursor, hasNext, isLoading, user?.id]);

  useEffect(() => {
    if (tabStatus === 'ongoing' || isLoading || !hasNext) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchTrips();
        }
      },
      { threshold: 0.5, rootMargin: '100px' }
    );

    if (infiniteScrollTriggerRef.current) {
      observer.observe(infiniteScrollTriggerRef.current);
    }

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTrips, hasNext, tabStatus]);

  useEffect(() => {
    if (tabStatus === 'ongoing') {
      fetchTrips();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabStatus]);

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

  return (
    <div className="flex flex-col h-dvh relative bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header title="나의 여행" />
      <div className="flex justify-around items-center p-2 bg-white dark:bg-slate-900 shadow-sm z-10">
        <Button
          onClick={() => setTabStatus('upcoming')}
          className={tabStatus === 'upcoming' ? 'text-primary-base font-bold' : 'text-gray-500'}
        >
          예정된 여행
        </Button>
        <Button
          onClick={() => setTabStatus('ongoing')}
          className={tabStatus === 'ongoing' ? 'text-primary-base font-bold' : 'text-gray-500'}
        >
          진행중인 여행
        </Button>
        <Button
          onClick={() => setTabStatus('completed')}
          className={tabStatus === 'completed' ? 'text-primary-base font-bold' : 'text-gray-500'}
        >
          다녀온 여행
        </Button>
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
              onClick={() => navigate(`/trips/${trip.id}`)}
              tripImage={TRIP_IMAGE_PATHS[trip?.destination ?? '']}
              title={trip?.title ?? ''}
              date={formatDateRange(trip?.startDate ?? '', trip?.endDate ?? '')}
              size="myTrips"
              badgeText={tabUI.getBadge(trip?.startDate ?? '', trip?.endDate ?? '')}
            />
          ))}
        {isLoading && (
          <>
            <TripCardSkeleton />
            <TripCardSkeleton />
          </>
        )}
        {!isLoading && trips.length === 0 && !error && (
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
        {tabStatus !== 'ongoing' && !isLoading && hasNext && (
          <div ref={infiniteScrollTriggerRef} className="h-4" />
        )}
      </div>

      {error && (
        <div className="text-center py-4">
          <Typography variant="helper" color="error">
            {error}
          </Typography>
        </div>
      )}
      {showTopBtn && (
        <Button
          onClick={handleScrollToTop}
          className={clsx(
            'absolute bottom-30 right-5 z-50 p-3 rounded-full shadow-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-700 transition-all duration-300 ease-in-out active:scale-90 active:bg-gray-50 dark:active:bg-slate-800',
            showTopBtn
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
