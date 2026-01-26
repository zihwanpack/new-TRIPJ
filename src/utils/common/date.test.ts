import { expect, test, describe, vi } from 'vitest';
import {
  calculateDday,
  filteringByDateRange,
  formatDate,
  formatDateRange,
  formatDateToYearMonth,
  formatTimeDisplay,
  getDateRange,
} from './date.ts';
import dayjs from 'dayjs';

describe('date utils test', () => {
  test('calculateDday', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));

    const date = dayjs().locale('ko').add(4, 'day').toISOString();

    const result = calculateDday(date);

    expect(result).toBe(4);

    vi.useRealTimers();
  });

  test('formatDateToYearMonth', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-26T00:00:00Z'));

    const date = dayjs().locale('ko').toISOString();

    const result = formatDateToYearMonth(date);

    expect(result).toBe('2026년 01월');

    vi.useRealTimers();
  });

  test('formatDate', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-26T00:00:00Z'));

    const date = dayjs().locale('ko').toISOString();

    const result = formatDate(date, 'YYYY.MM.DD');

    expect(result).toBe('2026.01.26');

    vi.useRealTimers();
  });

  test('formatDateRange', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-26T00:00:00Z'));

    const date = dayjs().locale('ko').toISOString();

    const result = formatDateRange(date, date);

    expect(result).toBe('2026.01.26 ~ 2026.01.26');
  });

  test('getDateRange', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-26T00:00:00Z'));

    const date = dayjs().locale('ko').toISOString();

    const result = getDateRange(date, date);

    expect(result.map((d) => d.toISOString())).toEqual([date]);

    vi.useRealTimers();
  });

  test('filteringByDateRange', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-26T00:00:00Z'));

    const date = dayjs().locale('ko').toISOString();

    const result = filteringByDateRange([{ startDate: date, endDate: date }], date);

    expect(result).toEqual([{ startDate: date, endDate: date }]);

    vi.useRealTimers();
  });

  test('formatTimeDisplay', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-26T00:00:00Z'));

    const date = dayjs().locale('ko').toISOString();

    const result = formatTimeDisplay(date);

    expect(result).toBe('오전 09:00');

    vi.useRealTimers();
  });
});
