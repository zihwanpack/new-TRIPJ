import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth.tsx';
import { TripCard } from '../components/TripCard.tsx';
import { TRIP_IMAGE_PATHS } from '../constants/tripImages.ts';
import { formatDateRange } from '../utils/date.ts';
import { getWelcomeMessage } from '../utils/getWelcomeMessage.ts';
import { Footer } from '../layouts/Footer.tsx';
import { FullscreenLoader } from '../components/FullscreenLoader.tsx';
import { useSelector, useDispatch } from '../redux/hooks/useCustomRedux.tsx';
import { fetchAllMyTrips, type TripState } from '../redux/slices/tripSlice.ts';
import { useEffect } from 'react';

export const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    ongoingTrip,
    upcomingTrips,
    pastTrips,
    isTripOngoingLoading,
    isTripUpcomingLoading,
    isTripPastLoading,
    tripOngoingError,
    tripUpcomingError,
    tripPastError,
  } = useSelector((state: { trip: TripState }) => state.trip);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllMyTrips({ id: user.id }));
    }
  }, [dispatch, user?.id]);

  if (isTripOngoingLoading || isTripUpcomingLoading || isTripPastLoading) {
    return <FullscreenLoader />;
  }
  const welcomeMessage = getWelcomeMessage({
    ongoingTrip,
    upcomingTrip: upcomingTrips[0] ?? null,
  });

  const DEFAULT_TRIP_IMAGE = TRIP_IMAGE_PATHS.beach;
  return (
    <div className="flex flex-col justify-between h-dvh overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col justify-between h-full mx-3">
        <div className="flex flex-col h-10 mt-3">
          <p className="text-xl font-semibold text-primary-base">{user?.nickname}님</p>
          <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {welcomeMessage}
          </p>
        </div>
        {tripOngoingError ? (
          <div className="flex flex-col items-center justify-center ">
            <p className="text-xl font-semibold text-red-500">{tripOngoingError}</p>
          </div>
        ) : (
          ongoingTrip && (
            <section className="flex flex-col items-start gap-3 ">
              <div className="flex flex-row gap-3 items-center">
                <p className="text-[16px] font-semibold">진행중인 여행</p>
              </div>
              <div className="w-full flex">
                <TripCard
                  key={ongoingTrip?.id || 0}
                  onClick={() => navigate(`/trips/${ongoingTrip?.id}`)}
                  tripImage={TRIP_IMAGE_PATHS[ongoingTrip.destination] || DEFAULT_TRIP_IMAGE}
                  title={ongoingTrip.title}
                  date={formatDateRange(ongoingTrip.startDate, ongoingTrip.endDate)}
                  size="largest"
                />
              </div>
            </section>
          )
        )}
        {tripUpcomingError ? (
          <div className="flex flex-col items-center justify-center ">
            <p className="text-xl font-semibold text-red-500">{tripUpcomingError}</p>
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

        {tripPastError ? (
          <div className="flex flex-col items-center justify-center ">
            <p className="text-xl font-semibold text-red-500">{tripPastError}</p>
          </div>
        ) : (
          pastTrips && (
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
          )
        )}
      </div>
      <Footer />
    </div>
  );
};
