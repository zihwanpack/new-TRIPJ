import { expect, test, describe } from 'vitest';
import { delay } from './delay.ts';

describe('delay utils test', () => {
  test('delay', async () => {
    const start = Date.now();
    await delay(200);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(200);
  });
});
