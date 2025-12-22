import { useNavigate } from 'react-router-dom';
import { ProgressBar } from '../components/ProgressBar.tsx';
import { EVENT_CREATE_FORM_SESSION_STORAGE_KEY } from '../constants/eventCreateFormSessionKey.ts';
import { usePersistedStep } from '../hooks/usePersistedStep.tsx';
import { Header } from '../layouts/Header.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema, type EventFormValues } from '../schemas/eventSchema.ts';
import { EVENT_CREATE_TOTAL_STEPS } from '../constants/eventCreateTotalSteps.ts';
import { EventCreateFirstForm } from '../components/EventCreateFirstForm.tsx';
import { EventCreateSecondForm } from '../components/EventCreateSecondForm.tsx';
import { EventCreateThirdForm } from '../components/EventCreateThirdForm.tsx';
import { useEffect } from 'react';

export const EventCreatePage = () => {
  const { step, setStep, resetStep } = usePersistedStep('event-create-step-key', 1);
  const navigate = useNavigate();
  const handleCloseForm = () => {
    resetStep();
    sessionStorage.removeItem(EVENT_CREATE_FORM_SESSION_STORAGE_KEY);
    navigate('/');
  };
  const initialValues = sessionStorage.getItem(EVENT_CREATE_FORM_SESSION_STORAGE_KEY);
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
      sessionStorage.setItem(EVENT_CREATE_FORM_SESSION_STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="flex flex-col h-full">
      <Header title="이벤트 추가하기" onClose={handleCloseForm} />
      <ProgressBar progress={step} steps={EVENT_CREATE_TOTAL_STEPS} />
      {step === 1 && <EventCreateFirstForm setStep={setStep} form={form} />}
      {step === 2 && <EventCreateSecondForm setStep={setStep} form={form} />}
      {step === 3 && <EventCreateThirdForm setStep={setStep} form={form} />}
    </div>
  );
};
