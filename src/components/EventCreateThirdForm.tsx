import type { UseFormReturn } from 'react-hook-form';
import type { EventFormValues } from '../schemas/eventSchema.ts';

interface EventCreateThirdFormProps {
  setStep: (step: number) => void;
  form: UseFormReturn<EventFormValues>;
}
export const EventCreateThirdForm = ({ setStep, form }: EventCreateThirdFormProps) => {
  const {
    watch,
    formState: { errors },
    register,
  } = form;

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const isStep3Valid = Boolean(startDate) && Boolean(endDate);

  return <div>EventCreateThirdForm</div>;
};
