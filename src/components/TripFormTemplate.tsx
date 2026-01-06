import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { Header } from '../layouts/Header.tsx';
import { ProgressBar } from './ProgressBar.tsx';
import { TripDestinationStep } from './TripDestinationStep.tsx';
import type { TripFormValues } from '../schemas/tripSchema.ts';
import { TripDateStep } from './TripDateStep.tsx';
import { TripMembersStep } from './TripMembersStep.tsx';
import { TripTitleAndSubmitStep } from './TripTitleAndSubmitStep.tsx';
import { TRIP_FORM_TOTAL_STEPS } from '../constants/trip.ts';

interface TripFormTemplateProps {
  step: number;
  headerTitle: string;
  setStep: (step: number) => void;
  handleCloseForm: () => void;
  form: UseFormReturn<TripFormValues>;
  mode: 'create' | 'edit';
}

export const TripFormTemplate = ({
  step,
  headerTitle,
  setStep,
  handleCloseForm,
  form,
  mode,
}: TripFormTemplateProps) => {
  return (
    <div className="flex flex-col h-dvh">
      <Header title={headerTitle} onClose={handleCloseForm} />
      <ProgressBar progress={step} steps={TRIP_FORM_TOTAL_STEPS} />
      <FormProvider {...form}>
        {step === 1 && <TripDestinationStep setStep={setStep} />}
        {step === 2 && <TripDateStep setStep={setStep} />}
        {step === 3 && <TripMembersStep setStep={setStep} />}
        {step === 4 && <TripTitleAndSubmitStep setStep={setStep} mode={mode} />}
      </FormProvider>
    </div>
  );
};
