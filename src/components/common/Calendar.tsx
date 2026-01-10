import { ko } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';

interface CalendarProps {
  startDate: string;
  endDate: string;
  setValue: (key: 'startDate' | 'endDate', value: string) => void;

  minDate?: string;
  maxDate?: string;
}

export const Calendar = ({ startDate, endDate, setValue, minDate, maxDate }: CalendarProps) => {
  const disabledMatcher =
    minDate && maxDate
      ? { before: new Date(minDate), after: new Date(maxDate) }
      : { before: new Date() };

  const defaultMonth = minDate ? new Date(minDate) : undefined;

  return (
    <DayPicker
      showOutsideDays
      mode="range"
      locale={ko}
      captionLayout="label"
      defaultMonth={defaultMonth}
      disabled={disabledMatcher}
      selected={{
        from: startDate ? new Date(startDate) : undefined,
        to: endDate ? new Date(endDate) : undefined,
      }}
      onSelect={(range) => {
        setValue('startDate', range?.from?.toISOString() ?? '');
        setValue('endDate', range?.to?.toISOString() ?? '');
      }}
      classNames={{
        root: 'w-full max-w-[340px] rounded-xl border border-gray-200 dark:border-gray-700 justify-center items-center p-6 bg-white dark:bg-slate-900 mx-auto text-slate-900 dark:text-slate-100 relative',
        month_caption: 'font-bold text-lg text-slate-900 dark:text-slate-100',
        month: 'flex flex-col',
        nav: 'absolute top-6 left-60 px-1',
        button_previous:
          'p-1 text-gray-400 dark:text-gray-400 hover:text-black dark:hover:text-white',
        button_next: 'p-1 text-gray-400 dark:text-gray-400 hover:text-black dark:hover:text-white',
        chevron: 'size-5 cursor-pointer',

        weekdays: 'w-full flex justify-between items-center h-10 mb-2',
        weekday: 'w-10 text-center text-sm font-medium text-gray-500',

        weeks: 'space-y-2',
        week: 'flex justify-between',
        day: 'size-10 text-sm cursor-pointer',

        day_button:
          'size-10 cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors',

        today: `text-primary-base font-bold`,
        range_start: `
          relative
          bg-black text-white rounded-full dark:bg-primary-base
          after:content-['']
          after:absolute
          after:top-0
          after:left-[50%]
          after:w-[50%]
          after:h-full
          after:bg-black/10 dark:after:bg-primary-base/30`,
        range_middle: 'bg-black/10 text-black dark:bg-primary-base/30 dark:text-white',
        range_end: `
          relative
          bg-black text-white rounded-full dark:bg-primary-base
          after:content-['']
          after:absolute
          after:top-0
          after:right-[50%]
          after:w-[50%]
          after:h-full
          after:bg-black/10 dark:after:bg-primary-base/30`,

        outside: 'text-gray-300 dark:text-gray-600 opacity-50',
        disabled: 'text-gray-200 dark:text-gray-700 opacity-30 cursor-not-allowed',
      }}
    />
  );
};
