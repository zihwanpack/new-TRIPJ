import { expect, test, describe } from 'vitest';
import { getTotal } from './getTotal.ts';

describe('getTotal utils test', () => {
  test('getTotal', () => {
    expect(getTotal([1, 2, 3, 4, 5])).toBe(15);
  });
});
