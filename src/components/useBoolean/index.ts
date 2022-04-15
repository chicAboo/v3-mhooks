import type { Ref } from 'vue-demi';
import useToggle from '../useToggle';

export interface Actions {
  toggle: () => void;
  set: (value: boolean) => void;
  setTrue: () => void;
  setFalse: () => void;
}

/**
 *
 * @param defaultValue 默认值false
 * @returns
 */
function useBoolean(defaultValue = false): [Ref<boolean>, Actions] {
  const [toggleValue, { toggle, set }] = useToggle(defaultValue);

  const setTrue = () => set(true);
  const setFalse = () => set(false);

  return [
    toggleValue,
    {
      toggle,
      set: (value) => set(!!value),
      setTrue,
      setFalse,
    },
  ];
}

export default useBoolean;
