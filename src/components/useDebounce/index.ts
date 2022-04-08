import type { UnwrapRef, Ref } from 'vue';
import { ref, watch } from 'vue';
import useDebounceFn from '../useDebounceFn';
import type { DebounceOptions } from '../useDebounceFn';

/**
 * 处理防抖值的hook
 * @param value ref声明出来的值
 * @param options DebounceOptions
 * @returns
 */
function useDebounce<T>(value: Ref<T>, options?: DebounceOptions) {
  const debounced = ref<T>(value.value);

  const setDebounced = (debouncedValue: T) => {
    debounced.value = debouncedValue as UnwrapRef<T>;
  };

  const { run } = useDebounceFn(() => {
    setDebounced(value.value);
  }, options);

  watch(value, () => {
    run();
  });

  return debounced;
}

export default useDebounce;
