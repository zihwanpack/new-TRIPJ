import { Link, useNavigate, useParams } from 'react-router-dom';

import { Header } from '../layouts/Header.tsx';
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
import { FullscreenLoader } from '../components/common/FullscreenLoader.tsx';
import type { Event } from '../types/event.ts';
import { Button } from '../components/common/Button.tsx';
import { useState } from 'react';
import { getDateRange, filteringByDateRange, formatDate } from '../utils/common/date.ts';
import { GoogleMapView } from '../components/trip/GoogleMapView.tsx';
import { getTotal } from '../utils/common/getTotal.ts';

import toast from 'react-hot-toast';
import clsx from 'clsx';
import { Typography } from '../components/common/Typography.tsx';
import { eventQueryKeys, tripQueryKeys, userQueryKeys } from '../constants/queryKeys.ts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteTripApi, getTripDetailApi } from '../api/trip.ts';
import { getUsersByEmailApi } from '../api/user.ts';
import { getMyAllEventsApi } from '../api/event.ts';

type EventViewStatus = 'loading' | 'error' | 'empty' | 'success' | 'map';

type MemberViewStatus = 'loading' | 'error' | 'success';

const getEventViewStatus = (
  isMapViewOpen: boolean,
  isAllEventsLoading: boolean,
  allEventsError: boolean,
  filteredEvents: Event[]
): EventViewStatus => {
  if (isMapViewOpen) return 'map';
  if (isAllEventsLoading) return 'loading';
  if (allEventsError) return 'error';
  if (filteredEvents.length === 0) return 'empty';
  return 'success';
};

const getMemberViewStatus = (
  isUsersByEmailsLoading: boolean,
  usersByEmailsError: boolean
): MemberViewStatus => {
  if (isUsersByEmailsLoading) return 'loading';
  if (usersByEmailsError) return 'error';
  return 'success';
};

export const TripDetailPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { tripId } = useParams();
  const tripIdNumber = Number(tripId);
  const {
    data: tripDetail,
    isPending: isTripDetailPending,
    isError: isTripDetailError,
    error: tripDetailError,
  } = useQuery({
    queryKey: tripQueryKeys.detail(tripIdNumber),
    queryFn: () => getTripDetailApi({ id: tripIdNumber }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!tripIdNumber,
  });

  const {
    data: allEvents = [],
    isLoading: isEventsLoading,
    isError: isEventsError,
    error: eventsError,
  } = useQuery({
    queryKey: eventQueryKeys.list(tripIdNumber),
    queryFn: () => getMyAllEventsApi({ tripId: tripIdNumber }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!tripIdNumber,
  });

  const members = tripDetail?.members ?? [];
  const {
    data: usersByEmails,
    isLoading: isMembersLoading,
    isError: isMembersError,
    error: membersError,
  } = useQuery({
    queryKey: userQueryKeys.byEmails(members),
    queryFn: () => getUsersByEmailApi(members),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!members.length,
  });

  const deleteTripMutation = useMutation({
    mutationFn: () => deleteTripApi({ id: tripIdNumber }),
    onSuccess: () => {
      toast.success('여행 삭제에 성공했습니다.');
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.all });
      navigate('/');
    },
    onError: () => {
      toast.error('여행 삭제에 실패했습니다.');
    },
  });

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMapViewOpen, setIsMapViewOpen] = useState<boolean>(false);

  const OVERLAP = 18;

  const visibleUsers = usersByEmails?.slice(0, 3) ?? [];
  const restUsers = Math.max(usersByEmails?.length ?? 0 - 3, 0);

  const containerWidth = visibleUsers.length * OVERLAP + (restUsers > 0 ? OVERLAP : 0);

  if (isTripDetailPending || isEventsLoading) return <FullscreenLoader />;
  if (isTripDetailError || isEventsError || isMembersError)
    return (
      <div>
        에러가 발생했습니다:
        {tripDetailError?.message || eventsError?.message || membersError?.message}
      </div>
    );
  if (!tripDetail) return <div>여행 데이터가 없습니다.</div>;

  const { startDate, endDate, title } = tripDetail;

  const costs = allEvents?.flatMap((event) => event.cost) || [];
  const totalCost = getTotal(costs.map((cost) => cost.value) || []);

  const dateList = getDateRange(startDate, endDate);
  const filteredEvents = filteringByDateRange<Event>(allEvents ?? [], selectedDate || '');

  const handleDeleteTrip = async () => {
    deleteTripMutation.mutate();
  };
  const editTripEventHandler = () => {
    navigate(`/trips/${tripId}/edit`);
  };

  const eventViewState = getEventViewStatus(
    isMapViewOpen,
    isEventsLoading,
    Boolean(eventsError),
    filteredEvents
  );

  const memberViewState = getMemberViewStatus(isMembersLoading, Boolean(membersError));

  return (
    <div className="flex flex-col h-dvh overflow-hidden relative bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header title="여행 상세" onClose={() => navigate('/')} />
      <section className="flex flex-col gap-3 mt-4 mx-4 flex-1 overflow-y-auto scrollbar-hide pb-10">
        <div className="flex justify-between gap-2 w-full">
          <Typography variant="h1" color="secondary" className="mb-3">
            {title}
          </Typography>
          <div className="flex items-center gap-2 relative">
            <MapPin
              className={clsx(
                'size-6 cursor-pointer transition-colors duration-200',
                isMapViewOpen ? 'text-primary-base' : 'text-gray-400 dark:text-gray-500'
              )}
              onClick={() => setIsMapViewOpen((prev) => !prev)}
            />
            <EllipsisVertical
              className="size-6 text-gray-400 cursor-pointer "
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            />
            {isDropdownOpen && (
              <div className="absolute top-10 right-0 w-40 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <Button
                  className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={editTripEventHandler}
                >
                  <Pencil className="size-4 text-gray-500" />
                  <span>여행 정보 수정</span>
                </Button>
                <Button className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500 cursor-pointer">
                  <Trash className="size-4" onClick={handleDeleteTrip} />
                  <span>여행 삭제</span>
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-gray-400 dark:text-gray-500" />
          <span className=" text-gray-400 dark:text-gray-500">
            {formatDate(startDate, 'YYYY. MM. DD')} - {formatDate(endDate, 'YYYY. MM. DD')}
          </span>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <DollarSign className="size-4 text-gray-400 dark:text-gray-500" />
            <span className=" text-gray-400 dark:text-gray-500">
              {totalCost?.toLocaleString()} 원
            </span>
          </div>
          {(() => {
            switch (memberViewState) {
              case 'loading':
                return (
                  <div className="text-xs h-8 text-gray-400 dark:text-gray-500">
                    멤버 불러오는 중...
                  </div>
                );

              case 'error':
                return (
                  <div className="text-xs h-8 text-red-400">멤버 정보를 불러올 수 없습니다</div>
                );

              case 'success':
                return (
                  <div className="relative h-8 right-5" style={{ width: `${containerWidth}px` }}>
                    {visibleUsers.map((user, index) => (
                      <div
                        key={user.id}
                        className="absolute size-8 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-gray-200 dark:bg-gray-700"
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
                        className="absolute flex items-center justify-center size-8 text-[10px] font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-slate-900 rounded-full"
                        style={{ left: visibleUsers.length * OVERLAP }}
                      >
                        +{restUsers}
                      </div>
                    )}
                  </div>
                );
            }
          })()}
        </div>
        <div className="flex gap-2 snap-x min-h-[44px] snap-mandatory scrollbar-hide pb-2 overflow-x-auto">
          {dateList.map((date) => {
            const key = formatDate(date, 'YYYY-MM-DD');
            const isSelected = selectedDate === key;
            return (
              <Button
                key={key}
                onClick={() => setSelectedDate(key)}
                className={clsx(
                  'flex-shrink-0 snap-start px-4 py-2 rounded-full transition cursor-pointer',
                  isSelected
                    ? 'bg-primary-base text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                )}
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium">{formatDate(date, 'MM.DD (ddd)')}</span>
                </div>
              </Button>
            );
          })}
        </div>
        {(() => {
          switch (eventViewState) {
            case 'map':
              return (
                <div className="w-full h-[450px] rounded-lg overflow-hidden">
                  <GoogleMapView events={filteredEvents} />
                </div>
              );

            case 'loading':
              return (
                <div className="py-20 text-center text-gray-400 dark:text-gray-500 flex justify-center gap-2">
                  <Loader2 className="size-4 text-primary-base animate-spin" />
                  이벤트 불러오는 중...
                </div>
              );

            case 'error':
              return (
                <div className="py-20 text-center text-red-400">이벤트를 불러오지 못했습니다.</div>
              );

            case 'empty':
              return (
                <div className="py-20 text-center text-gray-400 dark:text-gray-500">
                  이벤트가 없습니다. 추가해주세요
                </div>
              );

            case 'success':
              return (
                <div className="flex flex-col gap-3">
                  {filteredEvents.map((event, index) => (
                    <div key={event.eventId}>
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#3ACC97] text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <div className="text-[13px] font-semibold text-gray-500 dark:text-gray-400">
                            {formatDate(event.startDate, 'HH:mm')}
                          </div>
                        </div>
                        <Link
                          to={`/trips/${tripId}/events/${event.eventId}`}
                          className="flex-1 p-3 px-5 space-y-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                              {event.eventName}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                            <div className="overflow-hidden text-ellipsis whitespace-nowrap max-w-28">
                              {event.location.split(' ').slice(1, 4).join(' ')}
                            </div>
                            <div className="font-medium">
                              {getTotal(event.cost.map((cost) => cost.value)).toLocaleString()}원
                            </div>
                          </div>
                          <p className="pt-2 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(event.startDate, 'YY. MM. DD')} ~
                            {formatDate(event.endDate, 'YY. MM. DD')}
                          </p>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              );

            default:
              return null;
          }
        })()}
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
