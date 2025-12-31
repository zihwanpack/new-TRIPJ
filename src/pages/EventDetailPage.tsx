import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, DollarSign, MapPin, Pencil, Trash } from 'lucide-react';

import { Header } from '../layouts/Header.tsx';
import { Button } from '../components/Button.tsx';
import { FullscreenLoader } from '../components/FullscreenLoader.tsx';

import { useDispatch, useSelector } from '../hooks/useCustomRedux.tsx';
import { fetchEventDetail, type EventState } from '../redux/slices/eventSlice.ts';

import { formatDate } from '../utils/date.ts';
import { getTotal } from '../utils/getTotal.ts';
import toast from 'react-hot-toast';
import { deleteEventApi } from '../api/event.ts';

export const EventDetailPage = () => {
  const { eventId, tripId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { eventDetail, isEventDetailLoading, eventDetailError } = useSelector(
    (state: { event: EventState }) => state.event
  );

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventDetail({ id: Number(eventId) }));
    }
  }, [eventId, dispatch]);

  const deleteEventHandler = async () => {
    try {
      await deleteEventApi({ id: Number(eventId) });
      toast.success('이벤트 삭제에 성공했습니다.');
      navigate(`/trips/${tripId}`);
    } catch (error) {
      console.error(error);
      toast.error('이벤트 삭제에 실패했습니다.');
    }
  };

  if (isEventDetailLoading) return <FullscreenLoader />;
  if (eventDetailError)
    return <div className="p-4 text-center text-gray-500">에러가 발생했습니다.</div>;
  if (!eventDetail)
    return <div className="p-4 text-center text-gray-500">이벤트 데이터가 없습니다.</div>;

  const totalCost = getTotal(eventDetail.cost.map((c) => c.value) || []);

  return (
    <div className="flex flex-col h-dvh bg-gray-50 relative">
      <Header title="일정 상세" onClose={() => navigate(`/trips/${tripId}`)} />
      <section className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-4 pb-28 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
            {eventDetail.eventName}
          </h1>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="size-5 mt-0.5 shrink-0 text-primary-dark/80" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-400 mb-0.5">날짜</span>
                <span className="text-sm font-medium text-gray-700">
                  {formatDate(eventDetail.startDate, 'YYYY. MM. DD')} ~{' '}
                  {formatDate(eventDetail.endDate, 'YYYY. MM. DD')}
                </span>
              </div>
            </div>

            <div className="w-full h-px bg-gray-200 border-dashed" />

            <div className="flex items-center gap-3">
              <Clock className="size-5  mt-0.5 shrink-0 text-primary-dark/80" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-400 mb-0.5">시간</span>
                <span className="text-sm font-medium text-gray-700">
                  {formatDate(eventDetail.startDate, 'HH:mm')} ~{' '}
                  {formatDate(eventDetail.endDate, 'HH:mm')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex bg-white rounded-2xl border border-gray-100 shadow-sm p-5 items-center gap-3">
          <div className="bg-primary-base/10 p-2 rounded-full shrink-0 text-primary-dark">
            <MapPin className="size-5 text-primary-dark" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-semibold text-gray-400 block mb-1">장소</span>
            <span className="text-base font-medium text-gray-800 leading-snug block">
              {eventDetail.location || '장소 정보 없음'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="size-5 text-primary-dark/80" />
              <span className="text-sm font-semibold text-gray-500">예상 비용</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {totalCost.toLocaleString()}{' '}
              <span className="text-base font-medium text-gray-500">원</span>
            </p>
          </div>

          {eventDetail.cost.length > 0 ? (
            <div className="bg-gray-50/50 divide-y divide-gray-100/80">
              {eventDetail.cost.map((cost, index) => (
                <div key={index} className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm text-gray-600 font-medium">{cost.category}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {cost.value.toLocaleString()} 원
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 text-center text-sm text-gray-400 bg-gray-50/50">
              입력된 상세 비용이 없습니다.
            </div>
          )}
        </div>
      </section>

      <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-white/90 backdrop-blur-md border-t border-gray-100 flex gap-3 z-10">
        <Button
          className="flex-1 h-12 bg-primary-base/90 border border-gray-200 text-white hover:bg-primary-dark rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors"
          onClick={() => navigate(`/trips/${tripId}/events/${eventId}/edit`)}
        >
          <Pencil className="size-4" />
          <span className="font-semibold">수정하기</span>
        </Button>

        <Button
          className="flex-1 h-12 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-sm border border-red-100 flex items-center justify-center gap-2 transition-colors"
          onClick={deleteEventHandler}
        >
          <Trash className="size-4" />
          <span className="font-semibold">삭제하기</span>
        </Button>
      </div>
    </div>
  );
};
