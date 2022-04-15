import { ref, onMounted } from 'vue-demi';
import debounce from 'lodash/debounce';

export interface DebounceOptions {
  wait?: number; // 需要延迟的毫秒数
  leading?: boolean; // 默认false, 指定在延迟开始前调用
  trailing?: boolean; // 默认true, 指定延迟结束后调用
  maxWait?: number; // 设置函数允许被延迟的最大值
}

/**
 * 防抖函数hook
 * @param fn 要防抖的函数
 * @param options <DebounceOptions>
 * @returns
 */
function useDebounceFn<T extends (...args: any) => any>(fn: T, options?: DebounceOptions) {
  if (Object.prototype.toString.call(fn) !== '[object Function]') {
    console.error(`useDebounceFn expected parameter is a function, but got ${typeof fn}`);
  }

  const fnRef = ref(fn);
  const wait = options?.wait || 1000;

  const debounced = debounce(
    (...args: any[]) => {
      return fnRef.value(...args);
    },
    wait,
    options
  );

  onMounted(() => {
    debounced.cancel();
  });

  return {
    run: debounced as unknown as T,
    cancel: debounced.cancel, // 取消延迟
    flush: debounced.flush, // 立即调用
  };
}

export default useDebounceFn;
