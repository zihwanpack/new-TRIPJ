import { Link } from 'react-router-dom';
import { useCallback } from 'react';

import type { Trip } from '../types/trip.ts';
import type TripError from '../errors/TripError.ts';

import { useAuth } from '../hooks/useAuth.tsx';
import { useFetch } from '../hooks/useFetch.tsx';
import { useMinimalLoading } from '../hooks/useMinimumLoading.tsx';
import { TripCard } from '../components/TripCard.tsx';
import { AddTripCard } from '../components/AddTripCard.tsx';
import { HomePageSkeleton } from '../components/skeletons/HomePageSkeleton.tsx';
import { TRIP_IMAGE_PATHS } from '../constants/tripImages.ts';
import { getMyAllTripsApi } from '../api/trip.ts';
import { formatDateToYearMonth } from '../utils/formatDateToYearMonth.ts';
import { isUpcomingTrip } from '../utils/isUpcomingTrip.ts';
import { isPastTrip } from '../utils/isPastTrip.ts';
import { formatDateRange } from '../utils/formatDateRange.ts';
import { getWelcomeMessage } from '../utils/getWelcomeMessage.ts';

export const HomePage = () => {
  const { user } = useAuth();

  const fetchMyTrips = useCallback(() => getMyAllTripsApi(user?.id || ''), [user?.id]);

  const { data: trips, error, isLoading } = useFetch<Trip[], TripError>(fetchMyTrips);

  const showSkeleton = useMinimalLoading(300);

  if (isLoading || showSkeleton) {
    return <HomePageSkeleton />;
  }

  if (error) {
    if (error.statusCode === 404) {
      return <div>{error.message}</div>;
    }

    if (error.statusCode >= 500) {
      return <div>{error.message}</div>;
    }

    return <div>에러 발생: {error.message}</div>;
  }

  const upcomingTrips = trips?.filter((trip) => isUpcomingTrip(trip.endDate));
  const pastTrips = trips?.filter((trip) => isPastTrip(trip.endDate));
  const nearestTrip = upcomingTrips?.[0];
  const welcomeMessage = getWelcomeMessage(nearestTrip?.startDate || null);
  const DEFAULT_TRIP_IMAGE = TRIP_IMAGE_PATHS.BEACH;

  return (
    <div className="flex flex-col justify-around h-full overflow-hidden mx-3">
      <div className="flex flex-col h-10">
        <p className="text-xl font-semibold text-primary-base">여행자 {user?.nickname}님</p>
        <p className="text-xl font-semibold">{welcomeMessage}</p>
      </div>
      <section className="flex flex-col items-start gap-3 ">
        <div className="flex flex-row gap-3 items-center">
          <p className="text-[16px] font-semibold">다가오는 여행</p>
          <p className="text-primary-base ">{upcomingTrips?.length}</p>
        </div>

        <div className="w-full flex gap-4 flex-nowrap snap-x snap-mandatory overflow-x-auto scrollbar-hide">
          {upcomingTrips?.map((trip) => (
            <TripCard
              key={trip.id}
              tripImage={TRIP_IMAGE_PATHS[trip.destination] || DEFAULT_TRIP_IMAGE}
              title={trip.title}
              date={formatDateRange(trip.startDate, trip.endDate)}
              size="large"
            />
          ))}
          <AddTripCard />
        </div>
      </section>

      <section className="flex flex-col items-start gap-3 ">
        <div className="flex flex-row gap-3 justify-between w-full">
          <div className="flex flex-row gap-3 items-center">
            <p className="text-[16px] font-semibold">다녀온 여행</p>
            <p className="text-primary-base ">{pastTrips?.length}</p>
          </div>
          <Link to="/trips" className="text text-[14px] text-gray-400">
            모두 보기
          </Link>
        </div>

        <div className="w-full flex gap-4 flex-nowrap snap-x snap-mandatory overflow-x-auto scrollbar-hide">
          {pastTrips?.map((trip) => (
            <TripCard
              key={trip.id}
              tripImage={TRIP_IMAGE_PATHS[trip.destination] || DEFAULT_TRIP_IMAGE}
              title={trip.title}
              date={formatDateToYearMonth(trip.startDate)}
              size="small"
            />
          ))}
        </div>
      </section>
    </div>
  );
};
