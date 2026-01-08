import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, DollarSign, MapPin, Pencil, Trash } from 'lucide-react';

import { Header } from '../layouts/Header.tsx';
import { FullscreenLoader } from '../components/FullscreenLoader.tsx';
import { CTA } from '../components/CTA.tsx';

import { useDispatch, useSelector } from '../redux/hooks/useCustomRedux.tsx';
import {
  deleteEvent,
  fetchEventDetail,
  clearEventDetail,
  type EventState,
} from '../redux/slices/eventSlice.ts';

import { formatDate } from '../utils/date.ts';
import { getTotal } from '../utils/getTotal.ts';
import toast from 'react-hot-toast';
import { Typography } from '../components/Typography.tsx';

export const EventDetailPage = () => {
  const { eventId, tripId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { eventDetail, isEventDetailLoading, eventDetailError } = useSelector(
    (state: { event: EventState }) => state.event
  );

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventDetail({ eventId: Number(eventId) }));
    }
    return () => {
      dispatch(clearEventDetail());
    };
  }, [eventId, dispatch]);

  const deleteEventHandler = async () => {
    const result = await dispatch(deleteEvent({ eventId: Number(eventId) }));
    if (deleteEvent.fulfilled.match(result)) {
      toast.success('이벤트 삭제에 성공했습니다.');
      navigate(`/trips/${tripId}`);
    } else {
      toast.error('이벤트 삭제에 실패했습니다.');
    }
  };

  const editEventHandler = () => {
    navigate(`/trips/${tripId}/events/${eventId}/edit`);
  };

  if (isEventDetailLoading) return <FullscreenLoader />;
  if (eventDetailError)
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">에러가 발생했습니다.</div>
    );
  if (!eventDetail)
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        이벤트 데이터가 없습니다.
      </div>
    );

  const totalCost = getTotal(eventDetail.cost.map((c) => c.value) || []);

  return (
    <div className="flex flex-col h-dvh bg-gray-50 dark:bg-slate-900 relative">
      <Header title="이벤트 상세" onClose={() => navigate(`/trips/${tripId}`)} />

      <section className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-4 pb-28 space-y-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <Typography variant="h1" color="secondary" className="mb-4 leading-tight">
            {eventDetail.eventName}
          </Typography>

          <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="size-5 mt-0.5 shrink-0 text-primary-dark/80" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-400 mb-0.5">날짜</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {formatDate(eventDetail.startDate, 'YYYY. MM. DD')} ~{' '}
                  {formatDate(eventDetail.endDate, 'YYYY. MM. DD')}
                </span>
              </div>
            </div>

            <div className="w-full h-px bg-gray-200 dark:bg-gray-700 border-dashed" />

            <div className="flex items-center gap-3">
              <Clock className="size-5  mt-0.5 shrink-0 text-primary-dark/80" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-400 mb-0.5">시간</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {formatDate(eventDetail.startDate, 'HH:mm')} ~{' '}
                  {formatDate(eventDetail.endDate, 'HH:mm')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 items-center gap-3">
          <div className="bg-primary-base/10 dark:bg-primary-base/20 p-2 rounded-full shrink-0 text-primary-dark">
            <MapPin className="size-5 text-primary-dark" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-semibold text-gray-400 block mb-1">장소</span>
            <span className="text-base font-medium text-gray-800 dark:text-gray-100 leading-snug block">
              {eventDetail.location || '장소 정보 없음'}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="size-5 text-primary-dark/80" />
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                예상 비용
              </span>
            </div>

            <Typography variant="h1" color="secondary" className="mt-1">
              {totalCost.toLocaleString()}
              <span className="text-base font-medium text-gray-500">원</span>
            </Typography>
          </div>

          {eventDetail.cost.length > 0 ? (
            <div className="bg-gray-50/50 dark:bg-slate-900 divide-y divide-gray-100/80 dark:divide-gray-700/80">
              {eventDetail.cost.map((cost, index) => (
                <div key={index} className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {cost.category}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {cost.value.toLocaleString()} 원
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 text-center text-sm text-gray-400 dark:text-gray-500 bg-gray-50/50 dark:bg-slate-900">
              입력된 상세 비용이 없습니다.
            </div>
          )}
        </div>
      </section>

      <CTA
        customButtons={[
          {
            text: '수정하기',
            onClick: editEventHandler,
            variant: 'primary',
            icon: <Pencil className="size-4" />,
          },
          {
            text: '삭제하기',
            onClick: deleteEventHandler,
            variant: 'danger',
            icon: <Trash className="size-4" />,
          },
        ]}
      />
    </div>
  );
};
