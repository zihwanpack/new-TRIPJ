import type { Trip } from '../types/trip.ts';
import { calculateDday } from './date.ts';

type WelcomeMessageParams = {
  ongoingTrip: Trip | null;
  upcomingTrip: Trip | null;
};
export const getWelcomeMessage = ({ ongoingTrip, upcomingTrip }: WelcomeMessageParams): string => {
  if (ongoingTrip) {
    return '여행 중이시군요! 즐거운 시간 보내세요 🏖️';
  }

  const dDay = calculateDday(upcomingTrip?.startDate || '');

  if (isNaN(dDay)) return '설레는 여행을 계획해보세요! ✈️';
  if (dDay === 0) return '드디어 오늘 떠나요! 😆';
  if (dDay === 1) return '내일 떠날 준비 되셨나요? 👀';
  if (dDay < 0) return '여행 중이신가요? 즐거운 시간 보내세요! 🏖️';

  return `${dDay}일 후 떠날 준비 되셨나요? 🧳`;
};
