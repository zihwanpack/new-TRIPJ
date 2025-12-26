import { useNavigate } from 'react-router-dom';
import { ProgressBar } from '../components/ProgressBar.tsx';
import { useStorage } from '../hooks/useStorage.tsx';
import { Header } from '../layouts/Header.tsx';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema, type EventFormValues } from '../schemas/eventSchema.ts';
import {
  EVENT_CREATE_STEP_KEY,
  EVENT_CREATE_STORAGE_KEY,
  EVENT_CREATE_TOTAL_STEPS,
} from '../constants/event.ts';
import { EventCreateTitleLocationStep } from '../components/EventCreateTitleLocationStep.tsx';
import { EventCreateDateStep } from '../components/EventCreateDateStep.tsx';
import { EventCreateCostStep } from '../components/EventCreateCostStep.tsx';
import { useEffect } from 'react';

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
    resolver: zodResolver(eventSchema),
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
    <div className="flex flex-col h-full">
      <Header title="이벤트 추가하기" onClose={handleCloseForm} />
      <ProgressBar progress={step} steps={EVENT_CREATE_TOTAL_STEPS} />
      <FormProvider {...form}>
        {step === 1 && <EventCreateTitleLocationStep setStep={setStep} />}
        {step === 2 && <EventCreateDateStep setStep={setStep} />}
        {step === 3 && <EventCreateCostStep setStep={setStep} />}
      </FormProvider>
    </div>
  );
};
