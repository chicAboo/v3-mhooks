import { ref, onMounted, onUnmounted } from 'vue';

/**
 * 用于处理setTimeout函数的hook
 * @param fn 待执行函数
 * @param delay 延迟时间
 */
function useTimeout(fn: () => void, delay = 0): void {
  const fnRef = ref(fn);
  let timer: number;

  onMounted(() => {
    if (typeof delay !== 'number' || delay < 0) {
      return;
    }
    timer = setTimeout(() => {
      fnRef.value();
    }, delay);
  });

  onUnmounted(() => {
    clearTimeout(timer);
  });
}

export default useTimeout;
