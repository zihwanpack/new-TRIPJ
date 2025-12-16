import type { UseFormReturn } from 'react-hook-form';
import type { TripCreateRequest, TripFormValues } from '../schemas/tripSchema.ts';
import { createTripApi } from '../api/trip.ts';
import { useState } from 'react';
import TripError from '../errors/TripError.ts';
import { snakeCaseKeys } from '../utils/snakeCaseFormatter.ts';
import { TRIP_CREATE_FORM_LOCAL_STORAGE_KEY } from '../constants/tripCreateFormLocalKey.ts';
import { useNavigate } from 'react-router-dom';

export const TripCreateFourthForm = ({
  setStep,
  form,
}: {
  setStep: (step: number) => void;
  form: UseFormReturn<TripFormValues>;
}) => {
  const {
    register,
    watch,
    getValues,
    formState: { errors },
  } = form;
  const navigate = useNavigate();
  const title = watch('title');
  const isStep4Valid = title && title.trim().length > 0;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<TripError | null>(null);

  const handleCreateTrip = async () => {
    const formData = getValues();
    setIsLoading(true);
    setError(null);
    const apiData = snakeCaseKeys<TripCreateRequest>(formData);

    try {
      await createTripApi(apiData);
      localStorage.removeItem(TRIP_CREATE_FORM_LOCAL_STORAGE_KEY);
      navigate('/');
    } catch (err) {
      setError(err instanceof TripError ? err : new TripError('여행 추가 실패', 500));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 items-center mt-4 mx-4 min-h-[70px]">
        <h1 className="text-xl font-semibold">여행의 이름을 적어주세요</h1>
        <p className="text-sm text-primary-base">필수</p>
      </div>
      <div className="mx-4 mt-6 flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary-base focus-within:border-transparent transition-all bg-white">
        <input
          type="text"
          {...register('title')}
          placeholder="예) 서울 여행"
          className="w-full outline-none text-slate-700 placeholder:text-gray-300"
        />
      </div>
      <div className="mx-4 mt-1 min-h-[20px]">
        {errors.title && <p className="text-sm text-red-500 pl-1">{errors.title.message}</p>}
        {!errors.title && error && <p className="text-sm text-red-500 pl-1">{error.message}</p>}
      </div>
      <div className="flex-1" />
      <div className="flex gap-3 mb-4 px-4">
        <button
          type="button"
          onClick={() => setStep(3)}
          className="w-full py-2 rounded-md font-semibold transition cursor-pointer bg-gray-100 text-slate-600 hover:bg-gray-200"
        >
          이전
        </button>
        <button
          type="button"
          disabled={!isStep4Valid || isLoading}
          onClick={() => {
            if (!isStep4Valid) return;
            handleCreateTrip();
          }}
          className={`
            w-full py-2 rounded-md font-semibold transition cursor-pointer
            ${
              isStep4Valid
                ? 'bg-primary-base text-white hover:opacity-90'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? '여행 추가 중...' : '여행 추가'}
        </button>
      </div>
    </div>
  );
};
