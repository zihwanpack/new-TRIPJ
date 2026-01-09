import { useFormContext } from 'react-hook-form';

import type { TripFormValues } from '../../schemas/tripSchema.ts';
import { CTA } from '../common/CTA.tsx';
import { Calendar } from '../common/Calendar.tsx';
import { Typography } from '../common/Typography.tsx';
interface TripDateStepProps {
  setStep: (step: number) => void;
}

export const TripDateStep = ({ setStep }: TripDateStepProps) => {
  const { setValue, watch } = useFormContext<TripFormValues>();

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const isDateStepValid = startDate !== '' && endDate !== '';

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 items-center mt-4 mx-4  min-h-[70px]">
        <Typography variant="h1">여행 일정을 선택해주세요.</Typography>
        <Typography variant="body" color="primary">
          필수
        </Typography>
      </div>
      <Calendar startDate={startDate} endDate={endDate} setValue={setValue} />
      <div className="flex-1" />
      <CTA
        isValid={isDateStepValid}
        setStep={setStep}
        currentStep={2}
        previousButtonText="이전"
        nextButtonText="다음"
      />
    </div>
  );
};
