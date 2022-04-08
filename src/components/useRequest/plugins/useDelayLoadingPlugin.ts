import type { State, UnWrapRefObject } from '../types';

/**
 * loading的延迟，有时候请求太快，loading在短时间内从false -> true -> false状态切换，加载会造成闪烁的情况，这会造成糟糕的用户体验。该方法就是解决这个问题的。
 * @param loadingDelay
 * @param setState
 * @returns
 */
const useDelayLoadingPlugin = <R, P extends unknown[]>(
  loadingDelay: number,
  setState: (newState: Partial<UnWrapRefObject<State<R, P>>>) => void
) => {
  const delayLoading = () => {
    let timerId: number;

    if (loadingDelay) {
      timerId = setTimeout(setState, loadingDelay, {
        loading: true,
      });
    }

    return () => timerId && clearTimeout(timerId);
  };

  return { delayLoading };
};

export default useDelayLoadingPlugin;
