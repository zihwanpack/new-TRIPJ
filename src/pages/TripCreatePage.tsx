import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { tripFormSchema, type TripFormValues } from '../schemas/tripSchema.ts';
import { useStorage } from '../hooks/useStorage.tsx';

import { useAuthStatus } from '../hooks/useAuthStatus.tsx';
import { TRIP_CREATE_STEP_KEY, TRIP_CREATE_STORAGE_KEY } from '../constants/trip.ts';
import { TripFormTemplate } from '../components/TripFormTemplate.tsx';

export const TripCreatePage = () => {
  const {
    value: step,
    setValue: setStep,
    resetValue: resetStep,
  } = useStorage<number>({ key: TRIP_CREATE_STEP_KEY, initialValue: 1, type: 'session' });

  const navigate = useNavigate();
  const { user } = useAuthStatus();

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
    resolver: zodResolver(tripFormSchema),
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
    <TripFormTemplate
      mode="create"
      step={step}
      headerTitle="여행 추가하기"
      setStep={setStep}
      handleCloseForm={handleCloseForm}
      form={form}
    />
  );
};
