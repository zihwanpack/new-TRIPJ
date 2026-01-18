import { Link, useNavigate } from 'react-router-dom';

import { useAuthStatus } from '../hooks/user/useAuthStatus.tsx';
import { TripCard } from '../components/trip/TripCard.tsx';
import { TRIP_IMAGE_PATHS} from '../constants/tripImages.ts';
import { formatDateRange } from '../utils/common/date.ts';
import { getWelcomeMessage } from '../utils/trip/getWelcomeMessage.ts';
import { Footer } from '../layouts/Footer.tsx';
import { useSuspenseQueries } from '@tanstack/react-query';
import { tripQueryKeys } from '../constants/queryKeys.ts';
import { getMyOnGoingTripApi, getMyUpcomingTripsApi, getMyPastTripsApi } from '../api/trip';
import {
  useOngoingTripQueryOptions,
  usePastTripsQueryOptions,
  useUpcomingTripsQueryOptions,
} from '../hooks/query/trip.ts';

const DEFAULT_TRIP_IMAGE = TRIP_IMAGE_PATHS.beach;

export const HomePage = () => {
  const { user } = useAuthStatus();
  const navigate = useNavigate();
  const userId = user?.id ?? '';

  const [ongoingQuery, upcomingQuery, pastQuery] = useSuspenseQueries({
    queries: [
      {
        queryKey: tripQueryKeys.ongoing(userId),
        queryFn: () => getMyOnGoingTripApi({ userId }),
        ...useOngoingTripQueryOptions(),
      },
      {
        queryKey: tripQueryKeys.upcoming(userId),
        queryFn: () => getMyUpcomingTripsApi({ userId }),
        ...useUpcomingTripsQueryOptions({ userId }),
      },
      {
        queryKey: tripQueryKeys.past(userId),
        queryFn: () => getMyPastTripsApi({ userId }),
        ...usePastTripsQueryOptions({ userId }),
      },
    ],
  });

  const ongoingTrip = ongoingQuery.data;
  const upcomingTrips = upcomingQuery.data;
  const pastTrips = pastQuery.data;

  const welcomeMessage = getWelcomeMessage({
    ongoingTrip: ongoingTrip ?? null,
    upcomingTrip: upcomingTrips?.[0] ?? null,
  });

  return (
    <div className="flex flex-col justify-between h-dvh overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col justify-between h-full mx-3">
        <div className="flex flex-col h-10 mt-3">
          <p className="text-xl font-semibold text-primary-base">{user?.nickname}님</p>
          <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {welcomeMessage}
          </p>
        </div>

        <section className="flex flex-col items-start gap-3 ">
          <div className="flex flex-row gap-3 items-center">
            <p className="text-[16px] font-semibold">진행중인 여행</p>
          </div>
          <div className="w-full flex">
            {ongoingTrip ? (
              <TripCard
                key={ongoingTrip.id}
                onClick={() => navigate(`/trips/${ongoingTrip.id}`, { state: { from: 'home' } })}
                tripImage={
                  TRIP_IMAGE_PATHS[ongoingTrip.destination] || DEFAULT_TRIP_IMAGE
                }
                title={ongoingTrip.title}
                date={formatDateRange(ongoingTrip.startDate, ongoingTrip.endDate)}
                size="largest"
              />
            ) : (
              <TripCard variant="add" onClick={() => navigate('/trips/new')} size="largest" />
            )}
          </div>
        </section>

        <section className="flex flex-col items-start gap-3 ">
          <div className="flex flex-row gap-3 items-center">
            <p className="text-[16px] font-semibold">다가오는 여행</p>
            <p className="text-primary-base ">{upcomingTrips?.length}</p>
          </div>
          <div className="w-full flex gap-4 flex-nowrap snap-x snap-mandatory overflow-x-auto scrollbar-hide">
            {upcomingTrips?.map((trip) => (
              <TripCard
                key={trip.id}
                className="flex-shrink-0"
                onClick={() => navigate(`/trips/${trip.id}`)}
                tripImage={TRIP_IMAGE_PATHS[trip.destination] || DEFAULT_TRIP_IMAGE}
                title={trip.title}
                date={formatDateRange(trip.startDate, trip.endDate)}
                size="large"
              />
            ))}
            <TripCard
              variant="add"
              onClick={() => navigate('/trips/new')}
              className="flex-shrink-0"
            />
          </div>
        </section>

        <section className="flex flex-col items-start gap-3 ">
          <div className="flex flex-row gap-3 justify-between w-full">
            <div className="flex flex-row gap-3 items-center">
              <p className="text-[16px] font-semibold">다녀온 여행</p>
              <p className="text-primary-base ">{pastTrips?.length}</p>
            </div>
            <Link to="/my-trips" className="text text-[14px] text-gray-400">
              모두 보기
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};
