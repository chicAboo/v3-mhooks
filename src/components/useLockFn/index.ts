import { ref } from 'vue-demi';

/**
 * 用于给异步函数增加一个锁，防止并发执行
 * @param fn 异步函数
 * @returns
 */
function useLockFn<P extends any[]>(
  fn: (...args: P) => Promise<any>
): (...args: P) => Promise<any> {
  const lockRef = ref(false);

  const lockFn = async (...args: P) => {
    if (lockRef.value) {
      return;
    }
    lockRef.value = true;
    try {
      const res = await fn(...args);
      lockRef.value = false;
      return res;
    } catch (error) {
      lockRef.value = false;
      throw error;
    }
  };

  return lockFn;
}

export default useLockFn;
