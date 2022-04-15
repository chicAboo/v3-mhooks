import type { UnwrapRef, Ref } from 'vue';
import { ref, watch } from 'vue';
import useThrottleFn from '../useThrottleFn';
import type { ThrottleOptions } from '../useThrottleFn';

/**
 * 管理节流值的hook
 * @param value Ref<any> 这儿传入的是通过ref声明的值
 * @param options ThrottleOptions
 * @returns
 */
function useThrottle<T>(value: Ref<T>, options?: ThrottleOptions) {
  const throttledValue = ref<T>(value.value);

  const setThrottleValue = (throttleValue: T) => {
    throttledValue.value = throttleValue as UnwrapRef<T>;
  };

  const { run } = useThrottleFn(() => {
    setThrottleValue(value.value);
  }, options);

  watch(value, () => {
    run();
  });

  return throttledValue;
}

export default useThrottle;
