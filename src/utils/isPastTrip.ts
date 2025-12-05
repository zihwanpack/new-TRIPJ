import dayjs from 'dayjs';

export function isPastTrip(endDate: string): boolean {
  const today = dayjs();
  return dayjs(endDate).isBefore(today);
}
