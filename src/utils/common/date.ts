import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import 'dayjs/locale/ko';
dayjs.extend(isSameOrBefore);
dayjs.locale('ko');

export const calculateDday = (targetDate: string): number => {
  const today = dayjs().startOf('day');
  const target = dayjs(targetDate).startOf('day');
  return target.diff(today, 'day');
};

export const formatDateToYearMonth = (date: string) => {
  const [year, month] = date.split('T')[0].split('-');
  return `${year}년 ${month}월`;
};

export const formatDate = (date: string | Date | dayjs.Dayjs, format: string) => {
  return dayjs(date).format(format);
};

export const formatDateRange = (startDate: string, endDate: string) => {
  const startDateFormatted = formatDate(startDate, 'YYYY.MM.DD');
  const endDateFormatted = formatDate(endDate, 'YYYY.MM.DD');
  return `${startDateFormatted} ~ ${endDateFormatted}`;
};

export const getDateRange = (start: string, end: string) => {
  const dates: dayjs.Dayjs[] = [];
  let current = dayjs(start);
  const last = dayjs(end);

  while (current.isSameOrBefore(last, 'day')) {
    dates.push(current);
    current = current.add(1, 'day');
  }

  return dates;
};

export const filteringByDateRange = <T extends { startDate: string; endDate: string }>(
  data: T[],
  selectedDate: string,
) => {
  return data?.filter((datum) => {
    if (!selectedDate) return datum;

    const selected = dayjs(selectedDate);
    const start = dayjs(datum.startDate);
    const end = dayjs(datum.endDate);

    return (
      selected.isSame(start, 'day') ||
      selected.isSame(end, 'day') ||
      (selected.isAfter(start, 'day') && selected.isBefore(end, 'day'))
    );
  });
};

export const formatTimeDisplay = (isoString: string | null) => {
  if (!isoString) return '-- : --';

  return dayjs(isoString).locale('ko').format('A hh:mm');
};
