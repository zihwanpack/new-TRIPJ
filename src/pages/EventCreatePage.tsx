import { useNavigate } from 'react-router-dom';

import { useStorage } from '../hooks/useStorage.tsx';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema, type EventFormValues } from '../schemas/eventSchema.ts';
import { EVENT_CREATE_STEP_KEY, EVENT_CREATE_STORAGE_KEY } from '../constants/event.ts';
import { useEffect } from 'react';
import { EventFormTemplate } from '../components/event/EventFormTemplate.tsx';

export const EventCreatePage = () => {
  const {
    value: step,
    setValue: setStep,
    resetValue: resetStep,
  } = useStorage<number>({ key: EVENT_CREATE_STEP_KEY, initialValue: 1, type: 'session' });

  const navigate = useNavigate();
  const handleCloseForm = () => {
    resetStep();
    sessionStorage.removeItem(EVENT_CREATE_STORAGE_KEY);
    navigate('/');
  };

  const initialValues = sessionStorage.getItem(EVENT_CREATE_STORAGE_KEY);
  const defaultValues = initialValues
    ? JSON.parse(initialValues)
    : {
        eventName: '',
        location: '',
        startDate: '',
        endDate: '',
        cost: [],
      };

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      sessionStorage.setItem(EVENT_CREATE_STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <EventFormTemplate
      mode="create"
      step={step}
      headerTitle="이벤트 추가하기"
      setStep={setStep}
      handleCloseForm={handleCloseForm}
      form={form}
    />
  );
};
