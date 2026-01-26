import { describe, test, expect, vi } from 'vitest';
import { getWelcomeMessage } from './getWelcomeMessage';
import dayjs from 'dayjs';
import type { DestinationKey } from '../../constants/tripImages.ts';
import type { DestinationType } from '../../types/trip.ts';

describe('getWelcomeMessage', () => {
  test('ongoingTrip, upcomingTrip 모두 없으면 기본 안내 메시지를 반환한다', () => {
    const params = {
      ongoingTrip: null,
      upcomingTrip: null,
    };

    const result = getWelcomeMessage(params);

    expect(result).toBe('설레는 여행을 계획해보세요! ✈️');
  });

  test('여행 시작일이 오늘이면 "드디어 오늘 떠나요!" 메시지를 반환한다', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-26T00:00:00Z'));

    const params = {
      ongoingTrip: null,
      upcomingTrip: {
        id: 1,
        title: 'test',
        destination: 'seoul' as DestinationKey,
        destinationType: 'domestic' as DestinationType,
        startDate: dayjs('2026-01-26').toISOString(),
        endDate: dayjs('2026-01-30').toISOString(),
      },
    };

    const result = getWelcomeMessage(params);

    expect(result).toBe('드디어 오늘 떠나요! 😆');

    vi.useRealTimers();
  });
});
