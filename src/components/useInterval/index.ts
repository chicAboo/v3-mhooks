import type { Ref } from 'vue-demi';
import { ref, watchEffect, isRef } from 'vue-demi';

interface Options {
  immediate?: boolean;
}
type Callback = () => void;

/**
 * 用于处理setInterval函数的Hook
 * @param fn 待执行函数
 * @param delay 延迟时间
 * @param options options
 */
function useInterval(fn: Callback, delay: number | Ref<number>, options?: Options): Callback {
  let timer: number;
  const fnRef = ref(fn);
  const isRefData = isRef(delay);

  const intervalFn = (delayTime: number) => {
    if (typeof delayTime !== 'number' || delayTime < 0) {
      return;
    }
    if (options?.immediate && !timer) {
      fnRef.value();
    }

    timer = setInterval(() => {
      fnRef.value();
    }, delayTime);
  };

  const clear = () => {
    clearInterval(timer);
  };

  watchEffect((onInvalidate) => {
    intervalFn(isRefData ? delay.value : delay);

    onInvalidate(() => {
      clear();
    });
  });

  return clear;
}

export default useInterval;
