import { Suspense, useState } from 'react';
import { Header } from '../layouts/Header.tsx';
import { Footer } from '../layouts/Footer.tsx';
import {
  getMyPastTripsCursorApi,
  getMyUpcomingTripsCursorApi,
  getMyOnGoingTripApi,
} from '../api/trip.ts';
import { useAuthStatus } from '../hooks/user/useAuthStatus.tsx';
import { TripCard } from '../components/trip/TripCard.tsx';
import { TRIP_IMAGE_PATHS, type DestinationKey } from '../constants/tripImages.ts';
import { useNavigate } from 'react-router-dom';
import { calculateDday, formatDateRange } from '../utils/common/date.ts';
import { Skeleton } from '../components/common/Skeleton.tsx';
import { Button } from '../components/common/Button.tsx';
import clsx from 'clsx';
import { Typography } from '../components/common/Typography.tsx';
import { useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { tripQueryKeys } from '../constants/queryKeys.ts';
import type { Trip } from '../types/trip.ts';
import { useOngoingTripQueryOptions } from '../hooks/query/trip.ts';
import { ErrorBoundary } from '../errors/ErrorBoundary.tsx';
import type { TripListWithCursorResponse } from '../schemas/tripSchema.ts';

const LIMIT = 10;

export type TripTabStatus = 'upcoming' | 'ongoing' | 'completed';
const TAB_STATUS: TripTabStatus[] = ['upcoming', 'ongoing', 'completed'];

export const MyTripsPage = () => {
  const { user } = useAuthStatus();
  const [tabStatus, setTabStatus] = useState<TripTabStatus>('upcoming');

  return (
    <div className="flex flex-col h-dvh relative bg-slate-50 dark:bg-slate-950">
      <Header title="나의 여행" />

      <div className="pt-4 bg-white dark:bg-slate-900 z-10">
        <div className="flex p-1 bg-gray-100 dark:bg-slate-800">
          {TAB_STATUS.map((tab) => (
            <Button
              key={tab}
              onClick={() => setTabStatus(tab)}
              className={clsx(
                'flex-1 py-2 text-sm rounded-lg',
                tabStatus === tab ? 'bg-primary-base text-white' : 'text-gray-500'
              )}
            >
              {tab === 'upcoming' && '예정된 여행'}
              {tab === 'ongoing' && '진행중'}
              {tab === 'completed' && '다녀온 여행'}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-slate-900">
        <ErrorBoundary
          fallbackRender={({ reset }) => (
            <EmptyState
              emoji="❌"
              title="데이터 불러오기 실패"
              description="잠시 후 다시 시도해주세요."
              actionText="다시 시도"
              onAction={reset}
            />
          )}
        >
          <Suspense fallback={tabStatus === 'ongoing' ? null : <TripCardSkeleton />}>
            <TripTabContent tabStatus={tabStatus} userId={user!.id} />
          </Suspense>
        </ErrorBoundary>
      </div>

      <Footer />
    </div>
  );
};

const TripTabContent = ({ tabStatus, userId }: { tabStatus: TripTabStatus; userId: string }) => {
  switch (tabStatus) {
    case 'upcoming':
      return <UpcomingTripsTab userId={userId} />;
    case 'ongoing':
      return <OngoingTripTab userId={userId} />;
    case 'completed':
      return <CompletedTripsTab userId={userId} />;
  }
};

const OngoingTripTab = ({ userId }: { userId: string }) => {
  const navigate = useNavigate();

  const { data: ongoingTrip } = useSuspenseQuery<Trip | null>({
    queryKey: tripQueryKeys.ongoing(userId),
    queryFn: () => getMyOnGoingTripApi({ userId }),
    ...useOngoingTripQueryOptions(),
  });

  if (!ongoingTrip) {
    return (
      <EmptyState
        title="현재 진행 중인 여행이 없습니다."
        description="여행을 추가해보세요."
        actionText="여행 추가"
        onAction={() => navigate('/trips/new', { state: { from: 'my-trips' } })}
      />
    );
  }

  return (
    <TripCard
      onClick={() => navigate(`/trips/${ongoingTrip.id}`, { state: { from: 'my-trips' } })}
      tripImage={TRIP_IMAGE_PATHS[ongoingTrip.destination]}
      title={ongoingTrip.title}
      date={formatDateRange(ongoingTrip.startDate, ongoingTrip.endDate)}
      size="myTrips"
      badgeText="진행중"
    />
  );
};

const UpcomingTripsTab = ({ userId }: { userId: string }) => {
  const navigate = useNavigate();

  const { data } = useSuspenseInfiniteQuery({
    queryKey: tripQueryKeys.listByCursor(userId, 'upcoming'),
    queryFn: ({ pageParam }) =>
      getMyUpcomingTripsCursorApi({
        userId,
        cursor: pageParam,
        limit: LIMIT,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage: TripListWithCursorResponse | undefined) => {
      if (!lastPage?.pagination) {
        return undefined;
      }
      return lastPage.pagination.hasNext
        ? (lastPage.pagination.nextCursor ?? undefined)
        : undefined;
    },
  });

  const trips = data.pages.flatMap((p) => p?.items ?? []);

  if (trips.length === 0) {
    return (
      <EmptyState
        title="예정된 여행이 없습니다."
        description="여행을 추가해보세요."
        actionText="여행 추가"
        onAction={() => navigate('/trips/new', { state: { from: 'my-trips' } })}
      />
    );
  }

  return (
    <>
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          onClick={() => navigate(`/trips/${trip.id}`, { state: { from: 'my-trips' } })}
          tripImage={TRIP_IMAGE_PATHS[trip.destination as DestinationKey]}
          title={trip.title}
          date={formatDateRange(trip.startDate, trip.endDate)}
          size="myTrips"
          badgeText={`D-${calculateDday(trip.startDate)}`}
        />
      ))}
    </>
  );
};

const CompletedTripsTab = ({ userId }: { userId: string }) => {
  const navigate = useNavigate();

  const { data } = useSuspenseInfiniteQuery({
    queryKey: tripQueryKeys.listByCursor(userId, 'completed'),
    queryFn: ({ pageParam }) =>
      getMyPastTripsCursorApi({
        userId,
        cursor: pageParam,
        limit: LIMIT,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage: TripListWithCursorResponse | undefined) => {
      if (!lastPage?.pagination) {
        return undefined;
      }
      return lastPage.pagination.hasNext
        ? (lastPage.pagination.nextCursor ?? undefined)
        : undefined;
    },
  });

  const trips = data.pages.flatMap((p) => p?.items ?? []);

  if (trips.length === 0) {
    return (
      <EmptyState
        title="다녀온 여행이 없습니다."
        description="여행을 추가해보세요."
        actionText="여행 추가"
        onAction={() => navigate('/trips/new', { state: { from: 'my-trips' } })}
      />
    );
  }

  return (
    <>
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          onClick={() => navigate(`/trips/${trip.id}`, { state: { from: 'my-trips' } })}
          tripImage={TRIP_IMAGE_PATHS[trip.destination]}
          title={trip.title}
          date={formatDateRange(trip.startDate, trip.endDate)}
          size="myTrips"
        />
      ))}
    </>
  );
};

interface EmptyStateProps {
  emoji?: string;
  title?: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  emoji = '✈️',
  title,
  description,
  actionText,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <span className="text-4xl mb-3">{emoji}</span>

      {title && (
        <Typography variant="h2" className="mb-2">
          {title}
        </Typography>
      )}

      <Typography variant="helper" color="muted" className="mb-6 break-keep">
        {description}
      </Typography>

      {actionText && onAction && (
        <Button onClick={onAction} className="text-primary-base">
          {actionText}
        </Button>
      )}
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
