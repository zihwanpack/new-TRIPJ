import type { UseFormReturn } from 'react-hook-form';
import type { EventFormValues } from '../schemas/eventSchema.ts';

interface EventCreateSecondFormProps {
  setStep: (step: number) => void;
  form: UseFormReturn<EventFormValues>;
}
export const EventCreateSecondForm = ({ setStep, form }: EventCreateSecondFormProps) => {
  const {
    watch,
    formState: { errors },
    setValue,
  } = form;

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const isStep2Valid = Boolean(startDate && endDate);

  const handleSelectDate = (date: Date) => {
    setValue('startDate', date.toISOString());
    setValue('endDate', date.toISOString());
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 items-center mt-4 mx-4 min-h-[70px]">
        <h1 className="text-xl font-semibold">일정을 선택해주세요</h1>
        <p className="text-sm text-primary-base">필수</p>
      </div>
      <div className="mx-4 mt-2 flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary-base focus-within:border-transparent transition-all bg-white"></div>
      <div className="mx-4 mt-1 min-h-[20px]">
        {errors.eventName && (
          <p className="text-sm text-red-500 pl-1">{errors.eventName.message}</p>
        )}
      </div>

      <div className="flex-1" />
      <div className="flex justify-center">
        <button
          type="button"
          disabled={!isStep2Valid}
          onClick={() => {
            if (!isStep2Valid) return;
            setStep(3);
          }}
          className={`w-full py-2 rounded-md font-semibold transition m-4 cursor-pointer
            ${isStep2Valid ? 'bg-primary-base text-white hover:opacity-90' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          다음
        </button>
      </div>
    </div>
  );
};
