import { useFormContext } from 'react-hook-form';
import { CTA } from '../common/CTA.tsx';
import { useParams } from 'react-router-dom';
import { FullscreenLoader } from '../common/FullscreenLoader.tsx';
import { useRef, useState, useEffect } from 'react';
import { formatDate, formatTimeDisplay } from '../../utils/common/date.ts';
import { Button } from '../common/Button.tsx';
import type { EventFormValues } from '../../schemas/eventSchema.ts';
import clsx from 'clsx';
import { Calendar } from '../common/Calendar.tsx';
import { Typography } from '../common/Typography.tsx';
import { useQuery } from '@tanstack/react-query';
import { tripQueryKeys } from '../../constants/queryKeys.ts';
import type { Trip } from '../../types/trip.ts';
import { getTripDetailApi } from '../../api/trip.ts';
import { useTripDetailQueryOptions } from '../../hooks/query/trip.ts';

interface EventDateTimeStepProps {
  setStep: (step: number) => void;
}

export const EventDateTimeStep = ({ setStep }: EventDateTimeStepProps) => {
  const { watch, setValue } = useFormContext<EventFormValues>();
  const { tripId } = useParams();
  const tripIdNumber = Number(tripId!);

  const {
    data: tripDetail,
    isLoading: isTripDetailLoading,
    isError: isTripDetailError,
    error: tripDetailError,
  } = useQuery<Trip>({
    queryKey: tripQueryKeys.detail(tripIdNumber),
    queryFn: () => getTripDetailApi({ id: tripIdNumber }),
    ...useTripDetailQueryOptions({ id: tripIdNumber }),
  });

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

  if (isTripDetailError) {
    return (
      <div className="text-red-500">
        여행 정보를 불러오는 중 오류가 발생했습니다. : {tripDetailError.message}
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
        <Typography variant="h1">일정을 선택해주세요</Typography>
        <Typography variant="body" color="primary">
          필수
        </Typography>
      </div>
      <div className="mx-4 mb-2">
        <Typography variant="helper" color="muted">
          여행 기간: {formatDate(tripStartDate ?? '', 'YYYY. MM. DD')} ~
          {formatDate(tripEndDate ?? '', 'YYYY. MM. DD')}
        </Typography>
      </div>

      <div className="mx-4 mt-1 min-h-[20px]">
        <Calendar
          startDate={startDate}
          endDate={endDate}
          setValue={setValue}
          minDate={tripStartDate}
          maxDate={tripEndDate}
        />
      </div>

      <div className="flex gap-3 mx-4 mt-4">
        <Button
          onClick={() => startDate && setActiveDate('startDate')}
          disabled={!startDate}
          className="flex-1 p-1 rounded-xl border border-gray-200 dark:border-gray-700 text-left hover:border-primary-base dark:hover:border-primary-base bg-white dark:bg-slate-900"
        >
          <Typography variant="bodySmall" color="muted" className="mb-1">
            시작
          </Typography>
          <Typography variant="h2" color="secondary">
            {formatTimeDisplay(startDate)}
          </Typography>
        </Button>

        <Button
          onClick={() => endDate && setActiveDate('endDate')}
          disabled={!endDate}
          className="flex-1 p-1 rounded-xl border border-gray-200 dark:border-gray-700 text-left hover:border-primary-base dark:hover:border-primary-base bg-white dark:bg-slate-900"
        >
          <Typography variant="bodySmall" color="muted" className="mb-1">
            종료
          </Typography>
          <Typography variant="h2" color="secondary">
            {formatTimeDisplay(endDate)}
          </Typography>
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
