import { useNavigate, useParams } from 'react-router-dom';
import { EventFormTemplate } from '../components/event/EventFormTemplate.tsx';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema, type EventFormValues } from '../schemas/eventSchema.ts';

import { FullscreenLoader } from '../components/common/FullscreenLoader.tsx';
import { getEventDetailApi } from '../api/event.ts';
import { eventQueryKeys } from '../constants/queryKeys.ts';
import { useQuery } from '@tanstack/react-query';
import { useEventDetailQueryOptions } from '../hooks/query/event.ts';
import type { Event } from '../types/event.ts';

export const EventEditPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [step, setStep] = useState(1);
  const eventIdNumber = Number(eventId);

  const {
    data: eventDetail,
    isPending: isEventDetailPending,
    isError: isEventDetailError,
    error: eventDetailError,
  } = useQuery<Event>({
    queryKey: eventQueryKeys.detail(eventIdNumber),
    queryFn: () => getEventDetailApi({ eventId: eventIdNumber }),
    ...useEventDetailQueryOptions({ eventId: eventIdNumber }),
  });

  const defaultValues = {
    eventName: '',
    location: '',
    startDate: '',
    endDate: '',
    cost: [],
  };

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    mode: 'onChange',
    defaultValues: defaultValues as EventFormValues,
  });

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

  if (isEventDetailPending) {
    return <FullscreenLoader />;
  }

  if (isEventDetailError) {
    return <div className="text-xl font-semibold text-red-500">{eventDetailError?.message}</div>;
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
