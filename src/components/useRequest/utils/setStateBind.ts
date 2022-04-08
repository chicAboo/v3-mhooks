import type { State, UnWrapRefObject } from '../types';
/**
 * 设置状态
 * @param oldState 原始状态
 * @param publicCb 处理回调
 * @returns
 */
export default <R, P extends unknown[], T extends State<R, P>>(
  oldState: T,
  publicCb: Array<(state: T) => void>
) => {
  return (newState: Partial<UnWrapRefObject<State<R, P>>>) => {
    Object.keys(newState).forEach((key) => {
      oldState[key].value = newState[key];
    });

    publicCb.forEach((fun) => fun(oldState));
  };
};
