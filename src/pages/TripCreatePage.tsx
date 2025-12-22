import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { TRIP_CREATE_TOTAL_STEPS } from '../constants/tripCreateTotalSteps.ts';
import { TRIP_CREATE_FORM_SESSION_STORAGE_KEY } from '../constants/tripCreateFormSessionKey.ts';
import { tripSchema, type TripFormValues } from '../schemas/tripSchema.ts';
import { usePersistedStep } from '../hooks/usePersistedStep.tsx';

import { Header } from '../layouts/Header.tsx';
import { ProgressBar } from '../components/ProgressBar.tsx';
import { TripCreateStepFirstForm } from '../components/TripCreateFirstForm.tsx';
import { TripCreateStepSecondForm } from '../components/TripCreateSecondForm.tsx';
import { TripCreateStepThirdForm } from '../components/TripCreateThirdForm.tsx';
import { TripCreateFourthForm } from '../components/TripCreateFourthForm.tsx';
import { useAuth } from '../hooks/useAuth.tsx';

export const TripCreatePage = () => {
  const { step, setStep, resetStep } = usePersistedStep('trip-create-step-key', 1);

  const navigate = useNavigate();
  const { user } = useAuth();

  const initialValues = sessionStorage.getItem(TRIP_CREATE_FORM_SESSION_STORAGE_KEY);
  const defaultValues = initialValues
    ? JSON.parse(initialValues)
    : {
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
      sessionStorage.setItem(TRIP_CREATE_FORM_SESSION_STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleCloseForm = () => {
    resetStep();
    sessionStorage.removeItem(TRIP_CREATE_FORM_SESSION_STORAGE_KEY);
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="여행 추가하기" onClose={handleCloseForm} />
      <ProgressBar progress={step} steps={TRIP_CREATE_TOTAL_STEPS} />
      {step === 1 && <TripCreateStepFirstForm setStep={setStep} form={form} />}
      {step === 2 && <TripCreateStepSecondForm setStep={setStep} form={form} />}
      {step === 3 && <TripCreateStepThirdForm setStep={setStep} form={form} />}
      {step === 4 && <TripCreateFourthForm setStep={setStep} form={form} />}
    </div>
  );
};
