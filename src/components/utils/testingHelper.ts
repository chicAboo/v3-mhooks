import { flushPromises } from '@vue/test-utils';

export function sleep(timer = 0) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, timer);
  });
}

/**
 * 将宏任务和微任务队列中的所有任务执行完
 */
export async function waitForAll() {
  jest.runAllTimers();
  await flushPromises();
}

export const waitForTime = async (millisecond: number) => {
  jest.advanceTimersByTime(millisecond);
  await flushPromises();
};

export const request = (...args: any[]) =>
  new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(args.join(',') || 'success');
    }, 1000);
  });

export const failedRequest = () =>
  new Promise<Error>((_, reject) => {
    setTimeout(() => {
      reject(new Error('fail'));
    }, 1000);
  });
