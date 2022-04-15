import { ref, onMounted } from 'vue-demi';
import throttle from 'lodash/throttle';

export interface ThrottleOptions {
  wait?: number; // 需要延迟的毫秒数
  leading?: boolean; // 默认false, 指定在延迟开始前调用
  trailing?: boolean; // 默认true, 指定延迟结束后调用
}

/**
 * 防抖函数hook
 * @param fn 要防抖的函数
 * @param options <ThrottleOptions>
 * @returns
 */
function useThrottleFn<T extends (...args: any) => any>(fn: T, options?: ThrottleOptions) {
  if (Object.prototype.toString.call(fn) !== '[object Function]') {
    console.error(`useThrottleFn expected parameter is a function, but got ${typeof fn}`);
  }

  const fnRef = ref(fn);
  const wait = options?.wait || 1000;

  const throttled = throttle(
    (...args: any[]) => {
      return fnRef.value(...args);
    },
    wait,
    options
  );

  onMounted(() => {
    throttled.cancel();
  });

  return {
    run: throttled as unknown as T,
    cancel: throttled.cancel, // 取消延迟
    flush: throttled.flush, // 立即调用
  };
}

export default useThrottleFn;
