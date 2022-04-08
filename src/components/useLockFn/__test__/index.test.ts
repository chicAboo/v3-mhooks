import { ref } from 'vue';
import useLockFn from '../index';
import { sleep } from '../../utils/testingHelper';

jest.setTimeout(30000);

describe('useLockFn test', () => {
  it('should be defined', () => {
    expect(useLockFn).toBeDefined();
  });

  it('should work after sleep 100ms', async () => {
    const count = ref(0);
    const lockFn = useLockFn(async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 100);
      });
      count.value += 1;
    });

    lockFn();
    lockFn();
    lockFn();
    expect(count.value).toBe(0);

    lockFn();
    lockFn();
    await sleep(100);
    expect(count.value).toBe(1);

    lockFn();
    await sleep(50);
    expect(count.value).toBe(1);
    await sleep(50);
    expect(count.value).toBe(2);
  });

  it('should be throw error', () => {
    const lockFn = useLockFn(async () => {
      await new Promise<void>((_, reject) => {
        reject('Errors');
      });
    });

    expect(lockFn()).rejects.toMatch('Errors');
  });
});
