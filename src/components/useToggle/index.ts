import type { UnwrapRef, Ref } from 'vue-demi';
import { ref } from 'vue-demi';

export interface Actions<T> {
  setDefaultValue: () => void;
  setReverseValue: () => void;
  set: (value: T) => void;
  toggle: () => void;
}

function useToggle<T = boolean>(): [Ref<boolean>, Actions<T>];
function useToggle<T>(defaultValue: T): [Ref<T>, Actions<T>];
function useToggle<T, U>(defaultValue: T, reverseValue: U): [Ref<T> | Ref<U>, Actions<T | U>];
/**
 * 用于在两个状态值间切换的Hook
 * @param defaultValue 可选项，传入默认的状态值
 * @param reverseValue 可选项，传入取反的状态值
 * @returns [toggleValue, Actionss]
 */
function useToggle<D, R>(defaultValue: D = false as unknown as D, reverseValue?: R) {
  const toggleValue = ref<D | R>(defaultValue);
  const reverseValueOrigin = (
    reverseValue === undefined ? !defaultValue : reverseValue
  ) as UnwrapRef<D | R>;

  /**
   * 来回切换
   */
  const toggle = () => {
    toggleValue.value =
      toggleValue.value === defaultValue ? reverseValueOrigin : (defaultValue as UnwrapRef<D>);
  };

  /**
   * 设置指定的值
   * @param value 设置的值
   * @returns
   */
  const set = (value: D | R) => (toggleValue.value = value as UnwrapRef<D>);

  /**
   * 设置defaultValue值
   * @returns
   */
  const setDefaultValue = () => (toggleValue.value = defaultValue as UnwrapRef<D>);

  /**
   * 设置reverseValue值
   * @returns
   */
  const setReverseValue = () => (toggleValue.value = reverseValueOrigin as UnwrapRef<D | R>);

  return [toggleValue, { toggle, set, setDefaultValue, setReverseValue }];
}

export default useToggle;
