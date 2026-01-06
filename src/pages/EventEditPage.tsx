import { useNavigate, useParams } from 'react-router-dom';
import { EventFormTemplate } from '../components/EventFormTemplate.tsx';
import { useDispatch, useSelector } from '../redux/hooks/useCustomRedux.tsx';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema, type EventFormValues } from '../schemas/eventSchema.ts';
import { fetchEventDetail, type EventState } from '../redux/slices/eventSlice.ts';
import { FullscreenLoader } from '../components/FullscreenLoader.tsx';

export const EventEditPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [step, setStep] = useState(1);
  const { eventDetail, isEventDetailLoading, eventDetailError } = useSelector(
    (state: { event: EventState }) => state.event
  );
  const dispatch = useDispatch();

  const defaultValues = {
    eventName: '',
    location: '',
    startDate: '',
    endDate: '',
    cost: [],
  };

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    mode: 'onChange',
    defaultValues: defaultValues as EventFormValues,
  });

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventDetail({ id: Number(eventId) }));
    }
  }, [dispatch, eventId]);

  useEffect(() => {
    if (!eventDetail) return;

    form.reset({
      eventName: eventDetail.eventName,
      location: eventDetail.location,
      startDate: eventDetail.startDate,
      endDate: eventDetail.endDate,
      cost: eventDetail.cost,
    });
  }, [eventDetail, form]);

  if (isEventDetailLoading) {
    return <FullscreenLoader />;
  }

  if (eventDetailError) {
    return <div>이벤트 정보를 불러올 수 없습니다.</div>;
  }

  const handleCloseForm = () => {
    navigate('/');
  };

  return (
    <EventFormTemplate
      step={step}
      headerTitle="이벤트 수정하기"
      setStep={setStep}
      handleCloseForm={handleCloseForm}
      form={form}
      mode="edit"
    />
  );
};
