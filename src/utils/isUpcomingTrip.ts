import dayjs from 'dayjs';

export function isUpcomingTrip(endDate: string): boolean {
  const today = dayjs();
  return dayjs(endDate).isAfter(today) || dayjs(endDate).isSame(today);
}
