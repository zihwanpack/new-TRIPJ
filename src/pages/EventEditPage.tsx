import { useNavigate, useParams } from 'react-router-dom';
import { EventFormTemplate } from '../components/event/EventFormTemplate.tsx';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema, type EventFormValues } from '../schemas/eventSchema.ts';

import { getEventDetailApi } from '../api/event.ts';
import { eventQueryKeys } from '../constants/queryKeys.ts';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEventDetailQueryOptions } from '../hooks/query/event.ts';
import type { Event } from '../types/event.ts';

export const EventEditPage = () => {
  const navigate = useNavigate();
  const { eventId, tripId } = useParams();
  const [step, setStep] = useState<number>(1);
  const eventIdNumber = Number(eventId);

  const { data: eventDetail } = useSuspenseQuery<Event>({
    queryKey: eventQueryKeys.detail(eventIdNumber),
    queryFn: async () => {
      return getEventDetailApi({ eventId: eventIdNumber });
    },
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
    form.reset({
      eventName: eventDetail.eventName?.trim() || '',
      location: eventDetail.location?.trim() || '',
      startDate: eventDetail.startDate,
      endDate: eventDetail.endDate,
      cost: eventDetail.cost,
    });
  }, [eventDetail, form]);

  const handleCloseForm = () => {
    navigate(`/trips/${tripId}`);
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
