import { useFormContext } from 'react-hook-form';

import { DayPicker } from 'react-day-picker';
import { ko } from 'date-fns/locale';
import type { TripFormValues } from '../schemas/tripSchema.ts';
import { CTA } from './CTA.tsx';
interface TripCreateDateStepProps {
  setStep: (step: number) => void;
}

export const TripCreateDateStep = ({ setStep }: TripCreateDateStepProps) => {
  const { setValue, watch } = useFormContext<TripFormValues>();

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const isDateStepValid = startDate !== '' && endDate !== '';

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 items-center mt-4 mx-4  min-h-[70px]">
        <h1 className="text-xl font-semibold">여행 일정을 선택해주세요.</h1>
        <p className="text-sm text-primary-base">필수</p>
      </div>
      <DayPicker
        showOutsideDays
        mode="range"
        locale={ko}
        captionLayout="label"
        disabled={{ before: new Date() }}
        selected={{
          from: startDate ? new Date(startDate) : undefined,
          to: endDate ? new Date(endDate) : undefined,
        }}
        onSelect={(range) => {
          setValue('startDate', range?.from?.toISOString() ?? '');
          setValue('endDate', range?.to?.toISOString() ?? '');
        }}
        classNames={{
          /* ===== 전체 컨테이너 ===== */
          root: 'w-full max-w-[360px] rounded-xl border border-gray-200 justify-center items-center p-6 bg-white mx-auto',

          month_caption:
            'flex justify-center items-center h-10 mb-4 font-bold text-lg text-slate-900 relative',

          caption_label: 'text-xl font-semibold text-slate-800',

          month: 'relative flex flex-col',
          /* 네비게이션 */
          nav: 'absolute top-46 w-[310px] flex justify-between items-center h-10 px-1 z-10 ',
          button_previous: 'p-1 text-gray-400 hover:text-black',
          button_next: 'p-1  text-gray-400 hover:text-black',
          chevron: 'size-5 cursor-pointer',

          /* ===== 요일 ===== */
          weekdays: 'w-full flex justify-between items-center h-10 mb-3',
          weekday: 'w-10 text-center text-sm font-medium',

          /* ===== 날짜 그리드 ===== */
          weeks: 'space-y-2',
          week: 'flex justify-between',
          day: 'size-10 text-sm cursor-pointer',

          /* 날짜 버튼 */
          day_button: 'size-10 cursor-pointer',
          /* ===== 선택된 날짜 ===== */
          today: `text-primary-base font-bold`,
          range_start: `
          relative
          bg-black text-white rounded-full
          after:content-['']
          after:absolute
          after:top-0
          after:left-[50%]
          after:w-[50%]
          after:h-full
          after:bg-black/8`,
          range_middle: 'bg-black/8 text-black',
          range_end: `
          relative
          bg-black text-white rounded-full
          after:content-['']
          after:absolute
          after:top-0
          after:right-[50%]
          after:w-[50%]
          after:h-full
          after:bg-black/8`,
          outside: 'text-gray-200',
          disabled: 'text-gray-200',
        }}
      />
      <div className="flex-1" />
      <CTA isValid={isDateStepValid} setStep={setStep} currentStep={2} />
    </div>
  );
};
