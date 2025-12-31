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
import { useAuth } from '../hooks/useAuth.tsx';
import { TripCard } from '../components/TripCard.tsx';
import { TRIP_IMAGE_PATHS } from '../constants/tripImages.ts';
import { useNavigate } from 'react-router-dom';
import { calculateDday, formatDateRange } from '../utils/date.ts';
import { Skeleton } from '../components/Skeleton.tsx';
import { Button } from '../components/Button.tsx';
import { ArrowUpIcon } from 'lucide-react';

type TripTab = 'upcoming' | 'ongoing' | 'completed';

export const MyTripsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState<TripTab>('upcoming');
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
  }, [tab, setTrips]);

  const fetchTrips = useCallback(async () => {
    if (isLoading || (!hasNext && tab !== 'ongoing') || !user?.id) return;

    try {
      setIsLoading(true);

      if (tab === 'ongoing') {
        const response = await getMyOnGoingTripApi({ id: user.id as number });

        setTrips((draft) => {
          draft.length = 0;
          draft.push(response);
        });
        setHasNext(false);
        setNextCursor(null);
      } else {
        const currentApi =
          tab === 'upcoming' ? getMyUpcomingTripsCursorApi : getMyPastTripsCursorApi;

        const response = await currentApi({
          id: user.id,
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
  }, [tab, nextCursor, hasNext, isLoading, user?.id]);

  useEffect(() => {
    if (tab === 'ongoing' || isLoading || !hasNext) return;

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
  }, [fetchTrips, hasNext, tab]);

  useEffect(() => {
    if (tab === 'ongoing') {
      fetchTrips();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <div className="flex flex-col h-dvh relative">
      <Header title="나의 여행" />
      <div className="flex justify-around items-center p-2 bg-white shadow-sm z-10">
        <Button
          onClick={() => setTab('upcoming')}
          className={tab === 'upcoming' ? 'text-primary-base font-bold' : 'text-gray-500'}
        >
          예정된 여행
        </Button>
        <Button
          onClick={() => setTab('ongoing')}
          className={tab === 'ongoing' ? 'text-primary-base font-bold' : 'text-gray-500'}
        >
          진행중인 여행
        </Button>
        <Button
          onClick={() => setTab('completed')}
          className={tab === 'completed' ? 'text-primary-base font-bold' : 'text-gray-500'}
        >
          다녀온 여행
        </Button>
      </div>

      <div
        className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-4 p-4 bg-gray-100"
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
              badgeText={getTripBadgeLabel(tab, trip?.startDate ?? '', trip?.endDate ?? '')}
            />
          ))}
        {isLoading && (
          <>
            <TripCardSkeleton />
            <TripCardSkeleton />
          </>
        )}
        {!isLoading && trips.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 mt-20">
            <span className="text-4xl mb-2">✈️</span>
            <p>
              {tab === 'upcoming'
                ? '예정된 여행이 없습니다.'
                : tab === 'ongoing'
                  ? '현재 진행 중인 여행이 없습니다.'
                  : '다녀온 여행이 없습니다.'}
            </p>
            {tab === 'upcoming' && (
              <Button onClick={() => navigate('/trips/new')} className="mt-4 text-primary-base">
                여행 계획하기
              </Button>
            )}
          </div>
        )}
        {tab !== 'ongoing' && !isLoading && hasNext && (
          <div ref={infiniteScrollTriggerRef} className="h-4" />
        )}
      </div>

      {error && <div className="text-center text-red-500 py-4">{error}</div>}
      {showTopBtn && (
        <Button
          onClick={handleScrollToTop}
          className={`
          absolute bottom-30 right-5 z-50 
          p-3 rounded-full shadow-lg bg-white border border-gray-100
          transition-all duration-300 ease-in-out
          active:scale-90 active:bg-gray-50 
          ${showTopBtn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
        `}
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
    <div className="h-[100px] flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-transparent shrink-0">
      <Skeleton width="70px" height="70px" className="rounded-xl" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton width="60%" height="1.25rem" className="rounded-md" />
        <Skeleton width="40%" height="1rem" className="rounded-md" />
      </div>
    </div>
  );
};

const getTripBadgeLabel = (tab: TripTab, startDate: string, endDate: string): string => {
  switch (tab) {
    case 'upcoming':
      return `D-${calculateDday(startDate)}`;
    case 'ongoing':
      return '진행중';
    case 'completed':
      return `D+${Math.abs(calculateDday(endDate))}`;
    default:
      return '';
  }
};
