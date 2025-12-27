import { useFormContext } from 'react-hook-form';
import type { TripFormValues } from '../schemas/tripSchema.ts';
import { createTripApi } from '../api/trip.ts';
import { useNavigate } from 'react-router-dom';
import { TRIP_CREATE_STEP_KEY, TRIP_CREATE_STORAGE_KEY } from '../constants/trip.ts';
import { useCreateAction } from '../hooks/useCreateAction.tsx';
import { CTA } from './CTA.tsx';
import { Input } from './Input.tsx';

interface TripCreateTitleAndSubmitStepProps {
  setStep: (step: number) => void;
}

export const TripCreateTitleAndSubmitStep = ({ setStep }: TripCreateTitleAndSubmitStepProps) => {
  const {
    register,
    watch,
    getValues,
    formState: { errors },
  } = useFormContext<TripFormValues>();

  const navigate = useNavigate();
  const title = watch('title');
  const isTitleStepValid = Boolean(title && title.trim().length > 0);

  const {
    execute,
    isLoading: isCreateTripLoading,
    error: createTripError,
  } = useCreateAction(createTripApi);

  const handleCreateTrip = async () => {
    const formData = getValues();
    const { id } = await execute(formData);
    sessionStorage.removeItem(TRIP_CREATE_STEP_KEY);
    sessionStorage.removeItem(TRIP_CREATE_STORAGE_KEY);
    navigate(`/trips/${id}`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 items-center mt-4 mx-4 min-h-[70px]">
        <h1 className="text-xl font-semibold">여행의 이름을 적어주세요</h1>
        <p className="text-sm text-primary-base">필수</p>
      </div>
      <div className="mx-4 mt-6 flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary-base focus-within:border-transparent transition-all bg-white">
        <Input type="text" {...register('title')} placeholder="예) 서울 여행" />
      </div>
      <div className="mx-4 mt-1 min-h-[20px]">
        {errors.title && <p className="text-sm text-red-500 pl-1">{errors.title.message}</p>}
        {!errors.title && createTripError && (
          <p className="text-sm text-red-500 pl-1">{createTripError.message}</p>
        )}
      </div>
      <div className="flex-1" />
      <CTA
        isValid={isTitleStepValid}
        setStep={setStep}
        currentStep={4}
        isLoading={isCreateTripLoading}
        isLastStep={true}
        onSubmit={handleCreateTrip}
      />
    </div>
  );
};
