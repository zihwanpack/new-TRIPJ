import { useFormContext } from 'react-hook-form';
import { CTA } from './CTA.tsx';
import { DayPicker } from 'react-day-picker';
import { ko } from 'date-fns/locale';
import { useParams } from 'react-router-dom';
import { FullscreenLoader } from './FullscreenLoader.tsx';
import { useRef, useState, useEffect } from 'react';
import { formatDate, formatTimeDisplay } from '../utils/date.ts';
import { Button } from './Button.tsx';
import type { EventFormValues } from '../schemas/eventSchema.ts';
import { useDispatch, useSelector } from '../redux/hooks/useCustomRedux.tsx';
import { fetchTripDetail, type TripState } from '../redux/slices/tripSlice.ts';
import clsx from 'clsx';

interface EventDateTimeStepProps {
  setStep: (step: number) => void;
}

export const EventDateTimeStep = ({ setStep }: EventDateTimeStepProps) => {
  const { watch, setValue } = useFormContext<EventFormValues>();
  const { tripId } = useParams();
  const dispatch = useDispatch();

  const { tripDetail, isTripDetailLoading, tripDetailError } = useSelector(
    (state: { trip: TripState }) => state.trip
  );

  useEffect(() => {
    if (tripId && !tripDetail) {
      dispatch(fetchTripDetail({ id: Number(tripId) }));
    }
  }, [tripId, dispatch, tripDetail]);

  const [activeDate, setActiveDate] = useState<'startDate' | 'endDate' | null>(null);

  const handleTimeSave = (time: { hour: number; minute: number; meridiem: 'AM' | 'PM' }) => {
    if (!activeDate) return;

    const baseDate = new Date(watch(activeDate));
    let h = time.hour;

    if (time.meridiem === 'PM' && h !== 12) h += 12;
    if (time.meridiem === 'AM' && h === 12) h = 0;

    baseDate.setHours(h);
    baseDate.setMinutes(time.minute);

    setValue(activeDate, baseDate.toISOString());
    setActiveDate(null);
  };

  if (isTripDetailLoading) {
    return <FullscreenLoader />;
  }

  if (tripDetailError) {
    return (
      <div className="text-red-500">
        여행 정보를 불러오는 중 오류가 발생했습니다. : {tripDetailError}
      </div>
    );
  }

  const tripStartDate = tripDetail?.startDate;
  const tripEndDate = tripDetail?.endDate;

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const isDateStepValid = Boolean(startDate && endDate);

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 items-center mt-4 mx-4 min-h-[70px]">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          일정을 선택해주세요
        </h1>
        <p className="text-sm text-primary-base">필수</p>
      </div>
      <div className="mx-4 mb-2 text-sm text-gray-500 dark:text-gray-400">
        여행 기간: {formatDate(tripStartDate ?? '', 'YYYY. MM. DD')} ~
        {formatDate(tripEndDate ?? '', 'YYYY. MM. DD')}
      </div>

      <div className="mx-4 mt-1 min-h-[20px]">
        <DayPicker
          showOutsideDays
          mode="range"
          locale={ko}
          captionLayout="label"
          defaultMonth={tripStartDate ? new Date(tripStartDate) : undefined}
          disabled={{ before: new Date(tripStartDate ?? ''), after: new Date(tripEndDate ?? '') }}
          selected={{
            from: startDate ? new Date(startDate) : undefined,
            to: endDate ? new Date(endDate) : undefined,
          }}
          onSelect={(range) => {
            setValue('startDate', range?.from?.toISOString() ?? '');
            setValue('endDate', range?.to?.toISOString() ?? '');
          }}
          classNames={{
            root: 'w-full max-w-[360px] rounded-xl border border-gray-200 dark:border-gray-700 justify-center items-center p-6 bg-white dark:bg-slate-900 mx-auto text-slate-900 dark:text-slate-100',
            month_caption:
              'flex justify-center items-center h-10 mb-4 font-bold text-lg text-slate-900 dark:text-slate-100 relative',
            caption_label: 'text-xl font-semibold text-slate-800 dark:text-slate-100',
            month: 'relative flex flex-col',
            nav: 'absolute top-55 w-[310px] flex justify-between items-center h-10 px-1 z-10 ',
            button_previous:
              'p-1 text-gray-400 dark:text-gray-400 hover:text-black dark:hover:text-white',
            button_next:
              'p-1 text-gray-400 dark:text-gray-400 hover:text-black dark:hover:text-white',
            chevron: 'size-5 cursor-pointer',
            weekdays: 'w-full flex justify-between items-center h-10 mb-3',
            weekday: 'w-10 text-center text-sm font-medium',
            weeks: 'space-y-2',
            week: 'flex justify-between',
            day: 'size-10 text-sm cursor-pointer',
            day_button: 'size-10 cursor-pointer rounded-full',
            today: `text-primary-base font-bold`,
            range_start: `relative bg-black text-white rounded-full dark:bg-primary-base after:content-[''] after:absolute after:top-0 after:left-[50%] after:w-[50%] after:h-full after:bg-black/8 dark:after:bg-primary-base/30`,
            range_middle: 'bg-black/8 text-black dark:bg-primary-base/30 dark:text-white',
            range_end: `relative bg-black text-white rounded-full dark:bg-primary-base after:content-[''] after:absolute after:top-0 after:right-[50%] after:w-[50%] after:h-full after:bg-black/8 dark:after:bg-primary-base/30`,
            outside: 'text-gray-200 dark:text-gray-700',
            disabled: 'text-gray-200 dark:text-gray-700',
          }}
        />
      </div>

      <div className="flex gap-3 mx-4 mt-4">
        <Button
          onClick={() => startDate && setActiveDate('startDate')}
          disabled={!startDate}
          className="flex-1 p-1 rounded-xl border border-gray-200 dark:border-gray-700 text-left hover:border-primary-base dark:hover:border-primary-base bg-white dark:bg-slate-900"
        >
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">시작</div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {formatTimeDisplay(startDate)}
          </div>
        </Button>

        <Button
          onClick={() => endDate && setActiveDate('endDate')}
          disabled={!endDate}
          className="flex-1 p-1 rounded-xl border border-gray-200 dark:border-gray-700 text-left hover:border-primary-base dark:hover:border-primary-base bg-white dark:bg-slate-900"
        >
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">종료</div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {formatTimeDisplay(endDate)}
          </div>
        </Button>
      </div>

      {activeDate && (
        <TimeBottomSheet
          date={watch(activeDate)}
          onConfirm={(time) => handleTimeSave(time)}
          onClose={() => setActiveDate(null)}
        />
      )}
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

const ITEM_HEIGHT = 40;

export const ScrollWheel = ({
  items,
  value,
  onChange,
}: {
  items: readonly (string | number)[];
  value: string | number;
  onChange: (value: string | number) => void;
}) => {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const index = items.indexOf(value);
    if (index >= 0) {
      ref.current.scrollTop = index * ITEM_HEIGHT;
    }
  }, [value, items]);

  const handleScroll = () => {
    if (!ref.current) return;
    const index = Math.round(ref.current.scrollTop / ITEM_HEIGHT);
    if (items[index] !== value) onChange(items[index]);
  };

  return (
    <ul
      ref={ref}
      onScroll={handleScroll}
      className="h-[120px] overflow-y-scroll snap-y py-[40px] scrollbar-hide"
    >
      {items.map((item) => (
        <li
          key={item}
          className={clsx(
            'h-[40px] snap-center flex items-center justify-center',
            item === value
              ? 'font-bold text-slate-900 dark:text-slate-100'
              : 'text-gray-400 dark:text-gray-500'
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const MERIDIEMS = ['AM', 'PM'] as const;

export const TimePicker = ({
  initial,
  onChange,
  onConfirm,
}: {
  initial: { hour: number; minute: number; meridiem: 'AM' | 'PM' };
  onChange: (v: typeof initial) => void;
  onConfirm: () => void;
}) => {
  const { hour, minute, meridiem } = initial;
  return (
    <div className="flex flex-col items-center text-slate-900 dark:text-slate-100">
      <div className="flex gap-2">
        <ScrollWheel
          items={HOURS}
          value={hour}
          onChange={(value) => onChange({ ...initial, hour: Number(value) })}
        />
        <span className="py-[46px]">:</span>
        <ScrollWheel
          items={MINUTES}
          value={minute}
          onChange={(value) => onChange({ ...initial, minute: Number(value) })}
        />
        <ScrollWheel
          items={MERIDIEMS}
          value={meridiem}
          onChange={(value) => onChange({ ...initial, meridiem: value as 'AM' | 'PM' })}
        />
      </div>

      <Button
        className="mt-4 w-full bg-primary-base text-white py-3 rounded-lg"
        onClick={onConfirm}
      >
        저장
      </Button>
    </div>
  );
};

const TimeBottomSheet = ({
  date,
  onConfirm,
  onClose,
}: {
  date: string;
  onConfirm: (time: { hour: number; minute: number; meridiem: 'AM' | 'PM' }) => void;
  onClose: () => void;
}) => {
  const [time, setTime] = useState(() => {
    const convertedDate = new Date(date);
    let hour = convertedDate.getHours();
    const minute = convertedDate.getMinutes();
    const isPM = hour >= 12;

    if (hour === 0) {
      hour = 12;
    } else if (hour > 12) {
      hour -= 12;
    }

    return { hour, minute, meridiem: isPM ? 'PM' : 'AM' } as const;
  });
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-t-2xl px-4 pt-3 pb-6 animate-slide-up">
        <TimePicker initial={time} onConfirm={() => onConfirm(time)} onChange={setTime} />
      </div>
    </div>
  );
};
