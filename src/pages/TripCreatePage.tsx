import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { TRIP_CREATE_TOTAL_STEPS } from '../constants/tripCreateTotalStep.ts';
import { TRIP_CREATE_FORM_LOCAL_STORAGE_KEY } from '../constants/tripCreateFormLocalKey.ts';
import { tripSchema, type TripFormValues } from '../schemas/tripSchema.ts';
import { usePersistedStep } from '../hooks/usePersistedStep.tsx';

import { Header } from '../layouts/Header.tsx';
import { ProgressBar } from '../components/ProgressBar.tsx';
import { TripCreateStepFirstForm } from '../components/TripCreateFirstForm.tsx';
import { TripCreateStepSecondForm } from '../components/TripCreateSecondForm.tsx';
import { TripCreateStepThirdForm } from '../components/TripCreateThirdForm.tsx';

export const TripCreatePage = () => {
  const { step, setStep, resetStep } = usePersistedStep('trip_create_step', 1);

  const navigate = useNavigate();

  const initialValues = localStorage.getItem(TRIP_CREATE_FORM_LOCAL_STORAGE_KEY);
  const defaultValues = initialValues
    ? JSON.parse(initialValues)
    : {
        destination: '',
        startDate: '',
        endDate: '',
        member: [],
        title: '',
      };

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues,
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(TRIP_CREATE_FORM_LOCAL_STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleCloseOrFinish = () => {
    resetStep();
    localStorage.removeItem(TRIP_CREATE_FORM_LOCAL_STORAGE_KEY);
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="여행 추가하기" onClose={handleCloseOrFinish} />
      <ProgressBar progress={step} steps={TRIP_CREATE_TOTAL_STEPS} />
      {step === 1 && (
        <TripCreateStepFirstForm onNext={setStep} form={form} />
      )}
      {step === 2 && (
        <TripCreateStepSecondForm onNext={setStep} form={form} />
      )}
      {step === 3 && (
        <TripCreateStepThirdForm />
      )}  
      {step === 4 && (
        <TripCreateStepThirdForm />
      )}  
    </div>
  );
};
