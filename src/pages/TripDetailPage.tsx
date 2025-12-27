import { useNavigate, useParams } from 'react-router-dom';

import { Header } from '../layouts/Header.tsx';
import { useFetch } from '../hooks/useFetch.tsx';
import { deleteTripApi, getTripDetailApi } from '../api/trip.ts';
import type { Trip } from '../types/trip.ts';
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
import { getMyAllEventsApi } from '../api/event.ts';
import { FullscreenLoader } from '../components/FullscreenLoader.tsx';
import type { Event } from '../types/event.ts';
import { getUsersByEmailApi } from '../api/user.ts';
import type { UserSummary } from '../types/user.ts';
import { Button } from '../components/Button.tsx';
import { useState } from 'react';
import { getDateRange, filteringByDateRange, formatDate } from '../utils/date.ts';
import { GoogleMapView } from '../components/GoogleMapView.tsx';
import { TripError, EventError, UserError } from '../errors/customErrors.ts';
import { getTotal } from '../utils/getTotal.ts';

export const TripDetailPage = () => {
  const navigate = useNavigate();

  const { tripId: paramId } = useParams();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMapViewOpen, setIsMapViewOpen] = useState<boolean>(false);

  const tripId = paramId ? parseInt(paramId) : 0;

  const {
    data: tripData,
    error: tripError,
    isLoading: tripLoading,
  } = useFetch<Trip, TripError>([tripId], async () => getTripDetailApi({ id: tripId }));

  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsLoading,
  } = useFetch<Event[], EventError>([tripId], async () => getMyAllEventsApi({ tripId }));

  const {
    data: usersData,
    error: usersError,
    isLoading: usersLoading,
  } = useFetch<UserSummary[], UserError>([tripData?.members], async () => {
    if (!tripData?.members || tripData.members.length === 0) {
      return [];
    }
    return getUsersByEmailApi(tripData?.members || []);
  });

  if (tripLoading) return <FullscreenLoader />;
  if (tripError) return <div>에러가 발생했습니다: {tripError.message}</div>;
  if (!tripData) return <div>여행 데이터가 없습니다.</div>;

  const { startDate, endDate, title } = tripData;

  const costs = eventsData?.flatMap((event) => event.cost) || [];
  const totalCost = getTotal(costs.map((cost) => cost.value) || []);

  const visibleUsers = usersData?.slice(0, 3);
  const restUsers = usersData?.length ? usersData.length - 3 : 0;

  const dateList = getDateRange(startDate, endDate);
  const filteredEvents = filteringByDateRange<Event>(eventsData ?? [], selectedDate || '');

  const handleDeleteTrip = async () => {
    try {
      await deleteTripApi({ id: tripId });
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="여행 상세" onClose={() => navigate('/')} />
      <section className="flex flex-col gap-3 mt-4 mx-4">
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
            {formatDate(startDate, 'YYYY. MM. dd')} - {formatDate(endDate, 'YYYY. MM. dd')}
          </span>
        </div>
        <div className="flex items-center gap-2 relative">
          <DollarSign className="size-4 text-gray-400" />
          <span className=" text-gray-400">{totalCost?.toLocaleString()} 원</span>
          <div className="absolute right-0 top-0">
            {usersLoading ? (
              <div className="text-xs text-gray-400">멤버 불러오는 중...</div>
            ) : usersError ? (
              <div className="text-xs text-gray-400">멤버 정보를 불러올 수 없습니다</div>
            ) : (
              <div
                className="relative h-8"
                style={{
                  width: `${visibleUsers?.length ? visibleUsers.length * 20 + (restUsers > 0 ? 20 : 0) : 0}px`,
                }}
              >
                {visibleUsers?.map((user, index) => (
                  <div
                    key={user.id}
                    className="absolute size-8 rounded-full border-2 border-white overflow-hidden bg-gray-200"
                    style={{
                      left: `${index * 20}px`,
                      zIndex: 10 - index,
                    }}
                  >
                    {user.userImage ? (
                      <img
                        src={user.userImage}
                        alt={user.nickname}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-white bg-gray-400">
                        {user.nickname[0]}
                      </div>
                    )}
                  </div>
                ))}

                {restUsers > 0 && (
                  <div
                    className="absolute flex items-center justify-center size-8 text-[8px] font-semibold text-gray-600 bg-gray-100 border-2 border-white rounded-full"
                    style={{
                      left: `${visibleUsers?.length ? visibleUsers.length * 20 : 0}px`,
                    }}
                  >
                    +{restUsers}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
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
          <div className="w-full h-[400px] rounded-lg overflow-hidden">
            <GoogleMapView events={filteredEvents || []} />
          </div>
        ) : (
          <div className="relative">
            {eventsLoading ? (
              <div className="py-20 text-center text-gray-400 flex">
                <Loader2 className="size-4 text-primary-base animate-spin" /> 이벤트 불러오는 중...
              </div>
            ) : eventsError ? (
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

                      <div className="flex-1 p-3 px-5 space-y-2 bg-white border border-gray-200 rounded-lg shadow-lg">
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
                          {formatDate(event.startDate, 'yy. MM. dd')} ~
                          {formatDate(event.endDate, 'yy. MM. dd')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button
              className="absolute top-80 right-0 z-10 bg-primary-base text-white p-2 rounded-3xl flex items-center gap-2 cursor-pointer shadow-lg shadow-primary-base/30"
              onClick={() => navigate(`/trips/${tripId}/events/new`)}
            >
              <Plus size={16} />
              <span className="text-sm font-medium">이벤트 추가</span>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};
