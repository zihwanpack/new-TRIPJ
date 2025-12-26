import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { tripSchema, type TripFormValues } from '../schemas/tripSchema.ts';
import { useStorage } from '../hooks/useStorage.tsx';

import { Header } from '../layouts/Header.tsx';
import { ProgressBar } from '../components/ProgressBar.tsx';
import { TripCreateDestinationStep } from '../components/TripCreateDestinationStep.tsx';
import { TripCreateDateStep } from '../components/TripCreateDateStep.tsx';
import { TripCreateMembersStep } from '../components/TripCreateMembersStep.tsx';
import { TripCreateTitleAndSubmitStep } from '../components/TripCreateTitleAndSubmitStep.tsx';
import { useAuth } from '../hooks/useAuth.tsx';
import {
  TRIP_CREATE_STEP_KEY,
  TRIP_CREATE_STORAGE_KEY,
  TRIP_CREATE_TOTAL_STEPS,
} from '../constants/trip.ts';

export const TripCreatePage = () => {
  const {
    value: step,
    setValue: setStep,
    resetValue: resetStep,
  } = useStorage<number>({ key: TRIP_CREATE_STEP_KEY, initialValue: 1, type: 'session' });

  const navigate = useNavigate();
  const { user } = useAuth();

  const initialValues = sessionStorage.getItem(TRIP_CREATE_STORAGE_KEY);
  const defaultValues = initialValues
    ? JSON.parse(initialValues)
    : {
        destinationType: '',
        destination: '',
        startDate: '',
        endDate: '',
        members: [],
        title: '',
        createdBy: user?.email,
      };

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    if (user?.email) {
      const currentEmail = form.getValues('createdBy');
      if (!currentEmail) {
        form.setValue('createdBy', user.email);
      }
    }
  }, [user, form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      sessionStorage.setItem(TRIP_CREATE_STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleCloseForm = () => {
    resetStep();
    sessionStorage.removeItem(TRIP_CREATE_STORAGE_KEY);
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="여행 추가하기" onClose={handleCloseForm} />
      <ProgressBar progress={step} steps={TRIP_CREATE_TOTAL_STEPS} />
      <FormProvider {...form}>
        {step === 1 && <TripCreateDestinationStep setStep={setStep} />}
        {step === 2 && <TripCreateDateStep setStep={setStep} />}
        {step === 3 && <TripCreateMembersStep setStep={setStep} />}
        {step === 4 && <TripCreateTitleAndSubmitStep setStep={setStep} />}
      </FormProvider>
    </div>
  );
};
