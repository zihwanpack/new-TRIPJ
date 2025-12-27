import { Link, useNavigate } from 'react-router-dom';

import type { Trip } from '../types/trip.ts';
import { TripError } from '../errors/customErrors.ts';

import { useAuth } from '../hooks/useAuth.tsx';
import { useFetch } from '../hooks/useFetch.tsx';
import { TripCard } from '../components/TripCard.tsx';
import { TRIP_IMAGE_PATHS } from '../constants/tripImages.ts';
import { getMyPastTripsApi, getMyOnGoingTripApi, getMyUpcomingTripsApi } from '../api/trip.ts';
import { formatDateToYearMonth, formatDateRange } from '../utils/date.ts';
import { getWelcomeMessage } from '../utils/getWelcomeMessage.ts';
import { Footer } from '../layouts/Footer.tsx';
import { FullscreenLoader } from '../components/FullscreenLoader.tsx';

export const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data: onGoingTrip,
    error: onGoingTripError,
    isLoading: onGoingTripLoading,
  } = useFetch<Trip, TripError>([user?.id], async () =>
    getMyOnGoingTripApi({ id: user?.id || '' })
  );

  const {
    data: upcomingTrips,
    error: upcomingTripsError,
    isLoading: upcomingTripsLoading,
  } = useFetch<Trip[], TripError>([user?.id], async () =>
    getMyUpcomingTripsApi({ id: user?.id || '' })
  );

  const {
    data: pastTrips,
    error: pastTripsError,
    isLoading: pastTripsLoading,
  } = useFetch<Trip[], TripError>([user?.id], async () =>
    getMyPastTripsApi({ id: user?.id || '' })
  );

  if (onGoingTripLoading || upcomingTripsLoading || pastTripsLoading) {
    return <FullscreenLoader />;
  }

  const welcomeMessage = getWelcomeMessage({
    ongoingTrip: onGoingTrip,
    upcomingTrip: upcomingTrips?.[0] || null,
  });

  const DEFAULT_TRIP_IMAGE = TRIP_IMAGE_PATHS.beach;
  return (
    <div className="flex flex-col justify-around h-full overflow-hidden mx-3">
      <div className="flex flex-col h-10">
        <p className="text-xl font-semibold text-primary-base">{user?.nickname}님</p>
        <p className="text-xl font-semibold">{welcomeMessage}</p>
      </div>
      {onGoingTripError ? (
        <div className="flex flex-col items-center justify-center ">
          <p className="text-xl font-semibold text-red-500">{onGoingTripError.message}</p>
        </div>
      ) : (
        onGoingTrip && (
          <section className="flex flex-col items-start gap-3 ">
            <div className="flex flex-row gap-3 items-center">
              <p className="text-[16px] font-semibold">진행중인 여행</p>
            </div>
            <div className="w-full flex gap-4 flex-nowrap snap-x snap-mandatory overflow-x-auto scrollbar-hide">
              <TripCard
                key={onGoingTrip?.id || 0}
                onClick={() => navigate(`/trips/${onGoingTrip?.id}`)}
                tripImage={TRIP_IMAGE_PATHS[onGoingTrip.destination] || DEFAULT_TRIP_IMAGE}
                title={onGoingTrip.title}
                date={formatDateRange(onGoingTrip.startDate, onGoingTrip.endDate)}
                size="largest"
              />
            </div>
          </section>
        )
      )}
      {upcomingTripsError ? (
        <div className="flex flex-col items-center justify-center ">
          <p className="text-xl font-semibold text-red-500">{upcomingTripsError.message}</p>
        </div>
      ) : (
        <section className="flex flex-col items-start gap-3 ">
          <div className="flex flex-row gap-3 items-center">
            <p className="text-[16px] font-semibold">다가오는 여행</p>
            <p className="text-primary-base ">{upcomingTrips?.length}</p>
          </div>

          <div className="w-full flex gap-4 flex-nowrap snap-x snap-mandatory overflow-x-auto scrollbar-hide">
            {upcomingTrips?.map((trip) => (
              <TripCard
                key={trip.id}
                onClick={() => navigate(`/trips/${trip.id}`)}
                tripImage={TRIP_IMAGE_PATHS[trip.destination] || DEFAULT_TRIP_IMAGE}
                title={trip.title}
                date={formatDateRange(trip.startDate, trip.endDate)}
                size="large"
              />
            ))}
            <TripCard variant="add" onClick={() => navigate('/trips/new')} />
          </div>
        </section>
      )}

      {pastTripsError ? (
        <div className="flex flex-col items-center justify-center ">
          <p className="text-xl font-semibold text-red-500">{pastTripsError.message}</p>
        </div>
      ) : (
        pastTrips && (
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
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  tripImage={TRIP_IMAGE_PATHS[trip.destination] || DEFAULT_TRIP_IMAGE}
                  title={trip.title}
                  date={formatDateToYearMonth(trip.startDate)}
                  size="small"
                />
              ))}
            </div>
          </section>
        )
      )}

      <Footer />
    </div>
  );
};
