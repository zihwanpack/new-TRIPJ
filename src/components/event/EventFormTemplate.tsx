import { Header } from '../../layouts/Header.tsx';
import type { EventFormValues } from '../../schemas/eventSchema.ts';
import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { ProgressBar } from '../common/ProgressBar.tsx';
import { EVENT_FORM_TOTAL_STEPS } from '../../constants/event.ts';
import { EventTitleLocationStep } from './EventTitleLocationStep.tsx';
import { EventDateTimeStep } from './EventDateTimeStep.tsx';
import { EventCostAndSubmitStep } from './EventCostAndSubmitStep.tsx';

interface EventFormTemplateProps {
  step: number;
  headerTitle: string;
  setStep: (step: number) => void;
  handleCloseForm: () => void;
  form: UseFormReturn<EventFormValues>;
  mode: 'create' | 'edit';
}

export const EventFormTemplate = ({
  step,
  headerTitle,
  setStep,
  handleCloseForm,
  form,
  mode,
}: EventFormTemplateProps) => {
  return (
    <div className="flex flex-col h-dvh bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header title={headerTitle} onClose={handleCloseForm} />
      <ProgressBar progress={step} steps={EVENT_FORM_TOTAL_STEPS} />
      <FormProvider {...form}>
        {step === 1 && <EventTitleLocationStep setStep={setStep} />}
        {step === 2 && <EventDateTimeStep setStep={setStep} />}
        {step === 3 && <EventCostAndSubmitStep setStep={setStep} mode={mode} />}
      </FormProvider>
    </div>
  );
};
