import { expect, test, describe } from 'vitest';
import { getTypedEntries } from './getTypedEntries.ts';

describe('getTypedEntries utils test', () => {
  test('getTypedEntries', () => {
    expect(getTypedEntries({ a: 1, b: 2 })).toEqual([
      ['a', 1],
      ['b', 2],
    ]);
  });
});
