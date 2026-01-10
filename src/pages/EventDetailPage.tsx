import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, DollarSign, MapPin } from 'lucide-react';
import { Header } from '../layouts/Header.tsx';
import { FullscreenLoader } from '../components/common/FullscreenLoader.tsx';
import { formatDate } from '../utils/common/date.ts';
import { getTotal } from '../utils/common/getTotal.ts';
import toast from 'react-hot-toast';
import { Typography } from '../components/common/Typography.tsx';
import { eventQueryKeys } from '../constants/queryKeys.ts';
import { deleteEventApi, getEventDetailApi } from '../api/event.ts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/common/Button.tsx';

export const EventDetailPage = () => {
  const { eventId, tripId } = useParams();
  const navigate = useNavigate();
  const eventIdNumber = Number(eventId);
  const tripIdNumber = Number(tripId);

  const queryClient = useQueryClient();

  const {
    data: eventDetail,
    isPending: isEventDetailPending,
    isError: isEventDetailError,
    error: eventDetailError,
  } = useQuery({
    queryKey: eventQueryKeys.detail(eventIdNumber),
    queryFn: () => getEventDetailApi({ eventId: eventIdNumber }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!eventId,
  });

  const deleteEventMutation = useMutation({
    mutationFn: () => deleteEventApi({ eventId: eventIdNumber }),
    onSuccess: () => {
      toast.success('이벤트 삭제에 성공했습니다.');
      queryClient.invalidateQueries({
        queryKey: eventQueryKeys.list(tripIdNumber),
      });
      navigate(`/trips/${tripId}`);
    },
    onError: () => {
      toast.error('이벤트 삭제에 실패했습니다.');
    },
  });

  const deleteEventHandler = () => {
    deleteEventMutation.mutate();
  };

  const editEventHandler = () => {
    navigate(`/trips/${tripId}/events/${eventId}/edit`);
  };

  if (isEventDetailPending) return <FullscreenLoader />;

  if (isEventDetailError)
    return <div className="text-xl font-semibold text-red-500">{eventDetailError?.message}</div>;

  const totalCost = getTotal(eventDetail.cost.map((c) => c.value) || []);

  return (
    <div className="flex flex-col h-dvh bg-gray-50 dark:bg-slate-900 relative">
      <Header title="이벤트 상세" onClose={() => navigate(`/trips/${tripId}`)} />

      <section className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-4 pb-28 space-y-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-4">
          <Typography variant="h1" color="secondary">
            {eventDetail.eventName}
          </Typography>

          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Calendar className="size-4" />
            <span>
              {formatDate(eventDetail.startDate, 'YYYY. MM. DD')} -{' '}
              {formatDate(eventDetail.endDate, 'YYYY. MM. DD')}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Clock className="size-4" />
            <span>
              {formatDate(eventDetail.startDate, 'HH:mm')} ~{' '}
              {formatDate(eventDetail.endDate, 'HH:mm')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <div className="p-2 rounded-full bg-primary-base/10 text-primary-base">
            <MapPin className="size-5" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-gray-400 block mb-1">장소</span>
            <span className="text-base font-medium text-gray-800 dark:text-gray-100">
              {eventDetail.location || '장소 정보 없음'}
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <DollarSign className="size-4" />
              <span className="text-sm font-semibold">예상 비용</span>
            </div>

            <Typography variant="h1" color="secondary" className="mt-2">
              {totalCost.toLocaleString()}
              <span className="text-base font-medium text-gray-500"> 원</span>
            </Typography>
          </div>

          {eventDetail.cost.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {eventDetail.cost.map((cost, index) => (
                <div key={index} className="flex justify-between px-5 py-4 text-sm">
                  <span className="text-gray-600 dark:text-gray-300">{cost.category}</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {cost.value.toLocaleString()} 원
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 text-center text-sm text-gray-400">
              입력된 상세 비용이 없습니다.
            </div>
          )}
        </div>
      </section>

      <div className="flex gap-2 mb-8 px-4">
        <Button
          onClick={editEventHandler}
          className="flex-1 rounded-xl p-5 bg-gray-400 dark:bg-white text-white dark:text-gray-900 text-sm font-medium transition active:scale-[0.98]"
        >
          수정
        </Button>

        <Button
          onClick={deleteEventHandler}
          className="flex-1 rounded-xl p-5 bg-red-400 dark:bg-gray-800 text-white dark:text-gray-400 text-sm font-medium transition hover:bg-red-500 dark:hover:bg-gray-700 active:scale-[0.98]"
        >
          삭제
        </Button>
      </div>
    </div>
  );
};
