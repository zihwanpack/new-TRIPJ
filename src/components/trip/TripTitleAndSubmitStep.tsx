import { useFormContext } from 'react-hook-form';
import type { TripFormValues } from '../../schemas/tripSchema.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { TRIP_CREATE_STEP_KEY, TRIP_CREATE_STORAGE_KEY } from '../../constants/trip.ts';
import { CTA } from '../common/CTA.tsx';
import { Input } from '../common/Input.tsx';
import toast from 'react-hot-toast';
import { Typography } from '../common/Typography.tsx';
import { createTripApi, updateTripApi } from '../../api/trip.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tripQueryKeys } from '../../constants/queryKeys.ts';
import { FullscreenLoader } from '../common/FullscreenLoader.tsx';
import type { Trip } from '../../types/trip.ts';

interface TripTitleAndSubmitStepProps {
  setStep: (step: number) => void;
  mode: 'create' | 'edit';
}

export const TripTitleAndSubmitStep = ({ setStep, mode }: TripTitleAndSubmitStepProps) => {
  const {
    register,
    watch,
    getValues,
    formState: { errors },
  } = useFormContext<TripFormValues>();
  const { tripId } = useParams();
  const tripIdNumber = Number(tripId);
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const title = watch('title');
  const isTitleStepValid = Boolean(title && title.trim().length > 0);

  const {
    mutate: createTrip,
    isPending: isCreatePending,
    isError: isCreateError,
    error: createError,
  } = useMutation<Trip, Error, TripFormValues, { previousTrips: Trip[] | undefined }>({
    mutationFn: (data: TripFormValues) => createTripApi({ ...data }),
    onMutate: async (newTripData) => {
      await queryClient.cancelQueries({ queryKey: tripQueryKeys.all });
      const previousTrips = queryClient.getQueryData<Trip[]>(tripQueryKeys.all);
      queryClient.setQueryData<Trip[]>(tripQueryKeys.all, (old) => {
        if (!old) return [];
        return [...old, { ...newTripData, id: Date.now() }];
      });

      return { previousTrips };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.all });
    },
    onSuccess: async (createdTrip) => {
      sessionStorage.removeItem(TRIP_CREATE_STEP_KEY);
      sessionStorage.removeItem(TRIP_CREATE_STORAGE_KEY);

      toast.success('여행 생성에 성공했습니다.');
      navigate(`/trips/${createdTrip.id}`);
    },
    onError: (error, _newTripData, context) => {
      if (context?.previousTrips) {
        queryClient.setQueryData(tripQueryKeys.all, context.previousTrips);
      }
      toast.error(`여행 생성에 실패했습니다. : ${error.message}`);
    },
  });

  const {
    mutate: updateTrip,
    isPending: isUpdatePending,
    isError: isUpdateError,
    error: updateError,
  } = useMutation<Trip, Error, TripFormValues, { previousDetail: Trip | undefined }>({
    mutationFn: (data: TripFormValues) =>
      updateTripApi({
        id: tripIdNumber,
        body: data,
      }),
    onMutate: async (newTripData) => {
      await queryClient.cancelQueries({ queryKey: tripQueryKeys.detail(tripIdNumber) });
      const previousDetail = queryClient.getQueryData<Trip>(tripQueryKeys.detail(tripIdNumber));
      queryClient.setQueryData<Trip>(tripQueryKeys.detail(tripIdNumber), (old) => {
        if (!old) return;
        return { ...old, ...newTripData };
      });
      return { previousDetail };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tripQueryKeys.detail(tripIdNumber) });
    },
    onSuccess: () => {
      toast.success('여행 수정에 성공했습니다.');
      navigate(`/trips/${tripId}`);
    },
    onError: (error, _newTripData, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(tripQueryKeys.detail(tripIdNumber), context.previousDetail);
      }
      toast.error(`여행 수정에 실패했습니다. : ${error.message}`);
    },
  });

  const isLoading = mode === 'create' ? isCreatePending : isUpdatePending;

  const handleCreateTrip = async () => {
    const formData = getValues();
    createTrip(formData);
  };

  const handleUpdateTrip = async () => {
    const formData = getValues();
    updateTrip(formData);
  };

  if (isLoading) return <FullscreenLoader />;

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 items-center mt-4 mx-4 min-h-[70px]">
        <Typography variant="h1">마지막으로 여행의 이름을 적어주세요</Typography>
        <Typography variant="body" color="primary">
          필수
        </Typography>
      </div>
      <div className="mx-4 mt-6 flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary-base focus-within:border-transparent transition-all bg-white dark:bg-slate-900">
        <Input
          containerClassName="flex-1"
          type="text"
          {...register('title')}
          placeholder="예) 서울 여행"
        />
      </div>
      <div className="mx-4 mt-1 min-h-[20px]">
        {errors.title && <p className="text-sm text-red-500 pl-1">{errors.title.message}</p>}
        {!errors.title && mode === 'create' && isCreateError && (
          <p className="text-sm text-red-500 pl-1">{createError.message}</p>
        )}
        {!errors.title && mode === 'edit' && isUpdateError && (
          <p className="text-sm text-red-500 pl-1">{updateError.message}</p>
        )}
      </div>
      <div className="flex-1" />
      <CTA
        isValid={isTitleStepValid}
        setStep={setStep}
        currentStep={4}
        isLoading={isLoading}
        isLastStep={true}
        onSubmit={mode === 'create' ? handleCreateTrip : handleUpdateTrip}
        previousButtonText="이전"
        nextButtonText={mode === 'create' ? '추가하기' : '수정하기'}
      />
    </div>
  );
};
