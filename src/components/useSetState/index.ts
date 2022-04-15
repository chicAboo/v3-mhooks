import type { Ref } from 'vue';
import { ref } from 'vue';
import { isFunction } from '../utils';

export type SetState<S extends Record<string, any>> = <K extends keyof S>(
  state: Pick<S, K> | null | ((prevState: Readonly<S>) => Pick<S, K> | S | null)
) => void;

/**
 * 管理object的hook
 * @param initialState 初始值对象
 * @returns
 */
function useSetState<S extends Record<string, any>>(
  initialState: S = {} as S
): [
  Ref<Record<string, any>>,
  (patch: Record<string, any> | ((prevState: S) => Partial<S>)) => void
] {
  const state = ref<S>(initialState);

  const setState = (patch: Record<string, any> | ((prevState: Readonly<S>) => void)) => {
    const newState = isFunction(patch) ? patch(state.value) : patch;
    state.value = { ...state.value, ...newState };
  };

  return [state, setState];
}

export default useSetState;
