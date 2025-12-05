import { useAuth } from '../hooks/useAuth.tsx';
import { TripCard } from '../components/TripCard.tsx';
import { AddTripCard } from '../components/AddTripCard.tsx';
import { Link } from 'react-router-dom';
import { formatToYearMonth } from '../utils/formatToYearMonth.ts';
import { TRIP_IMAGE_PATHS } from '../constants/tripImages.ts';
import type { Trip } from '../types/trip.ts';

export const HomePage = () => {
  const { user } = useAuth();

  const upcomingTrips: Trip[] = [
    {
      id: 1,
      destination: 'JEJU',
      title: '제주도 가족여행',
      startDate: '2025.12.10',
      endDate: '2025.12.12',
    },
    {
      id: 2,
      destination: 'BUSAN',
      title: '부산 겨울여행',
      startDate: '2025.12.20',
      endDate: '2025.12.22',
    },
  ];

  const pastTrips: Trip[] = [
    {
      id: 1,
      destination: 'JEJU',
      title: '제주도 가족여행',
      startDate: '2025.12.10',
      endDate: '2025.12.12',
    },
    {
      id: 2,
      destination: 'SEOUL',
      title: '서울 단풍여행',
      startDate: '2025.10.01',
      endDate: '2025.10.02',
    },
  ];

  const DEFAULT_IMAGE = TRIP_IMAGE_PATHS.BEACH;
  return (
    <div className="flex flex-col justify-around h-full overflow-hidden mx-3">
      <div className="flex flex-col h-10">
        <p className="text-xl font-semibold text-primary-base">여행자 {user?.nickname}님</p>
        <p className="text-xl font-semibold">3일 후 떠날 준비 되셨나요?</p>
      </div>
      <section className="flex flex-col items-start gap-3 ">
        <div className="flex flex-row gap-3 items-center">
          <p className="text-[16px] font-semibold">다가오는 여행</p>
          <p className="text-primary-base ">2</p>
        </div>

        <div className="w-full flex gap-4 flex-nowrap snap-x snap-mandatory overflow-x-auto scrollbar-hide">
          {upcomingTrips.map((trip) => (
            <TripCard
              key={trip.id}
              tripImage={TRIP_IMAGE_PATHS[trip.destination] || DEFAULT_IMAGE}
              title={trip.title}
              date={`${trip.startDate} ~ ${trip.endDate}`}
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
            <p className="text-primary-base ">2</p>
          </div>
          <Link to="/trips" className="text text-[14px] text-gray-400">
            모두 보기
          </Link>
        </div>

        <div className="w-full flex gap-4 flex-nowrap snap-x snap-mandatory overflow-x-auto scrollbar-hide">
          {pastTrips.map((trip) => (
            <TripCard
              key={trip.id}
              tripImage={TRIP_IMAGE_PATHS[trip.destination] || DEFAULT_IMAGE}
              title={trip.title}
              date={formatToYearMonth(trip.startDate)}
              size="small"
            />
          ))}
        </div>
      </section>
    </div>
  );
};
