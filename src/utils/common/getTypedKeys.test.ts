import { expect, test, describe } from 'vitest';
import { getTypedKeys } from './getTypedKeys.ts';

describe('getTypedKeys utils test', () => {
  test('getTypedKeys', () => {
    expect(getTypedKeys({ a: 1, b: 2 })).toEqual(['a', 'b']);
  });
});
