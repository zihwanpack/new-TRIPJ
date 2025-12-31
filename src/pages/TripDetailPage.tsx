import { Link, useNavigate, useParams } from 'react-router-dom';

import { Header } from '../layouts/Header.tsx';
import { deleteTripApi } from '../api/trip.ts';
import {
  Calendar,
  DollarSign,
  EllipsisVertical,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Trash,
} from 'lucide-react';
import { FullscreenLoader } from '../components/FullscreenLoader.tsx';
import type { Event } from '../types/event.ts';
import type { UserSummary } from '../types/user.ts';
import { Button } from '../components/Button.tsx';
import { useEffect, useState } from 'react';
import { getDateRange, filteringByDateRange, formatDate } from '../utils/date.ts';
import { GoogleMapView } from '../components/GoogleMapView.tsx';
import { UserError } from '../errors/customErrors.ts';
import { getTotal } from '../utils/getTotal.ts';
import { useDispatch, useSelector } from '../hooks/useCustomRedux.tsx';
import { fetchTripDetail, type TripState } from '../redux/slices/tripSlice.ts';
import { fetchAllEvents, type EventState } from '../redux/slices/eventSlice.ts';
import { getUsersByEmailApi } from '../api/user.ts';

export const TripDetailPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { tripDetail, isTripDetailLoading, tripDetailError } = useSelector(
    (state: { trip: TripState }) => state.trip
  );
  const { allEvents, isAllEventsLoading, allEventsError } = useSelector(
    (state: { event: EventState }) => state.event
  );

  const { tripId } = useParams();

  useEffect(() => {
    if (tripId) {
      dispatch(fetchTripDetail({ id: Number(tripId) }));
      dispatch(fetchAllEvents({ tripId: Number(tripId) }));
    }
  }, [dispatch, tripId]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMapViewOpen, setIsMapViewOpen] = useState<boolean>(false);

  const [usersData, setUsersData] = useState<UserSummary[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<UserError | null>(null);

  const OVERLAP = 18;

  const visibleUsers = usersData.slice(0, 3);
  const restUsers = Math.max(usersData.length - 3, 0);

  const containerWidth = visibleUsers.length * OVERLAP + (restUsers > 0 ? OVERLAP : 0);

  useEffect(() => {
    if (!tripDetail?.members || tripDetail.members.length === 0) return;

    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const data = await getUsersByEmailApi(tripDetail.members || []);
        setUsersData(data);
      } catch (err) {
        console.error(err);
        setUsersError(err as UserError);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [tripDetail?.members]);
  if (isTripDetailLoading || isAllEventsLoading) return <FullscreenLoader />;
  if (tripDetailError || allEventsError)
    return <div>에러가 발생했습니다: {tripDetailError || allEventsError}</div>;
  if (!tripDetail) return <div>여행 데이터가 없습니다.</div>;

  const { startDate, endDate, title } = tripDetail;

  const costs = allEvents?.flatMap((event) => event.cost) || [];
  const totalCost = getTotal(costs.map((cost) => cost.value) || []);

  const dateList = getDateRange(startDate, endDate);
  const filteredEvents = filteringByDateRange<Event>(allEvents ?? [], selectedDate || '');

  const handleDeleteTrip = async () => {
    try {
      await deleteTripApi({ id: Number(tripId) });
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-dvh overflow-hidden relative">
      <Header title="여행 상세" onClose={() => navigate('/')} />
      <section className="flex flex-col gap-3 mt-4 mx-4 flex-1 overflow-y-auto scrollbar-hide pb-10">
        <div className="flex justify-between gap-2 w-full">
          <h1 className="text-xl font-semibold ">{title}</h1>
          <div className="flex items-center gap-2 relative">
            <MapPin
              className={`size-6 cursor-pointer ${
                isMapViewOpen ? 'text-primary-base' : 'text-gray-400'
              }`}
              onClick={() => setIsMapViewOpen((prev) => !prev)}
            />
            <EllipsisVertical
              className="size-6 text-gray-400 cursor-pointer "
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            />
            {isDropdownOpen && (
              <div className="absolute top-10 right-0 w-40 bg-white rounded-lg shadow-lg border z-50">
                <Button className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer">
                  <Pencil className="size-4 text-gray-500" />
                  <span>여행 정보 수정</span>
                </Button>
                <Button className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-red-50 text-red-500 cursor-pointer">
                  <Trash className="size-4" onClick={handleDeleteTrip} />
                  <span>여행 삭제</span>
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-gray-400" />
          <span className=" text-gray-400">
            {formatDate(startDate, 'YYYY. MM. DD')} - {formatDate(endDate, 'YYYY. MM. DD')}
          </span>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <DollarSign className="size-4 text-gray-400" />
            <span className=" text-gray-400">{totalCost?.toLocaleString()} 원</span>
          </div>
          <div>
            {usersLoading ? (
              <div className="text-xs h-8 text-gray-400">멤버 불러오는 중...</div>
            ) : usersError ? (
              <div className="text-xs h-8 text-red-400">멤버 정보를 불러올 수 없습니다</div>
            ) : (
              <div className="relative h-8 right-5" style={{ width: `${containerWidth}px` }}>
                {visibleUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className="absolute size-8 rounded-full border-2 border-white overflow-hidden bg-gray-200"
                    style={{
                      left: index * OVERLAP,
                      zIndex: 10 - index,
                    }}
                  >
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.nickname}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-white bg-gray-400">
                        {user.nickname?.[0] ?? '?'}
                      </div>
                    )}
                  </div>
                ))}

                {restUsers > 0 && (
                  <div
                    className="absolute flex items-center justify-center size-8 text-[10px] font-semibold text-gray-600 bg-gray-100 border-2 border-white rounded-full"
                    style={{ left: visibleUsers.length * OVERLAP }}
                  >
                    +{restUsers}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 snap-x min-h-[44px] snap-mandatory scrollbar-hide pb-2 overflow-x-auto">
          {dateList.map((date) => {
            const key = formatDate(date, 'YYYY-MM-DD');
            const isSelected = selectedDate === key;
            return (
              <Button
                key={key}
                onClick={() => setSelectedDate(key)}
                className={`
          flex-shrink-0 snap-start
          px-4 py-2 rounded-full
          transition cursor-pointer
          ${isSelected ? 'bg-primary-base text-white' : 'bg-gray-100 text-gray-600'}
        `}
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium">{formatDate(date, 'MM.DD (ddd)')}</span>
                </div>
              </Button>
            );
          })}
        </div>
        {isMapViewOpen ? (
          <div className="w-full h-[450px]  rounded-lg">
            <GoogleMapView events={filteredEvents ?? []} />
          </div>
        ) : (
          <div>
            {isAllEventsLoading ? (
              <div className="py-20 text-center text-gray-400 flex">
                <Loader2 className="size-4 text-primary-base animate-spin" /> 이벤트 불러오는 중...
              </div>
            ) : allEventsError ? (
              <div className="py-20 text-center text-red-400">이벤트를 불러오지 못했습니다.</div>
            ) : filteredEvents?.length === 0 ? (
              <div className="py-20 text-center text-gray-400">이벤트가 없습니다. 추가해주세요</div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredEvents?.map((event, index) => (
                  <div key={event.eventId}>
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#3ACC97] text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="text-[13px] font-semibold text-gray-500">
                          {formatDate(event.startDate, 'HH:mm')}
                        </div>
                      </div>

                      <Link
                        to={`/trips/${tripId}/events/${event.eventId}`}
                        className="flex-1 p-3 px-5 space-y-2 bg-white border border-gray-200 rounded-lg shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-base font-semibold text-gray-900">
                            {event.eventName}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="overflow-hidden text-ellipsis whitespace-nowrap max-w-28">
                            {event.location.split(' ').slice(1, 4).join(' ')}
                          </div>
                          <div className="font-medium">
                            {getTotal(event.cost.map((cost) => cost.value) || []).toLocaleString()}
                            원
                          </div>
                        </div>

                        <p className="pt-2 border-t border-gray-100 text-sm text-gray-500">
                          {formatDate(event.startDate, 'YY. MM. DD')} ~
                          {formatDate(event.endDate, 'YY. MM. DD')}
                        </p>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
      <Button
        className="absolute bottom-6 right-4 z-50 bg-primary-base text-white p-3 rounded-full flex items-center gap-2 cursor-pointer shadow-lg shadow-primary-base/30 transition-transform active:scale-95"
        onClick={() => navigate(`/trips/${tripId}/events/new`)}
      >
        <Plus size={16} />
        <span className="text-sm font-medium">이벤트 추가</span>
      </Button>
    </div>
  );
};
