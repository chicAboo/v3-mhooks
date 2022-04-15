import { ref } from 'vue-demi';

type RetryPlugin = {
  retryCount: number; // 错误重试次数
  retryInterval: number; // 错误重试间隔时间
};

/**
 * 错误重试
 * @param param
 * @returns
 */
const useRetryPlugin = ({ retryCount, retryInterval }: RetryPlugin) => {
  const count = ref(0);

  const errorRetry = (retryFunc: () => void) => {
    count.value += 1;

    if (retryCount === -1 || count.value <= retryCount) {
      const timeout = retryInterval ?? Math.min(1000 * 2 ** retryCount, 30000);

      count.value = setTimeout(retryFunc, timeout);
    } else {
      count.value = 0;
    }

    return () => count.value > 0 && clearTimeout(count.value);
  };

  const resetRetryCount = () => {
    count.value = 0;
  };

  return { errorRetry, resetRetryCount };
};

export default useRetryPlugin;
