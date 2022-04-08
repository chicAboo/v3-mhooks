import { Ref } from 'vue';
import useToggle from '../index';

describe('useToggle test', () => {
  it('should be defined', () => {
    expect(useToggle).toBeDefined();
  });

  it('test on init', () => {
    const [toggleValue] = useToggle();
    expect(toggleValue.value).toBeFalsy();
  });

  it('test on toggle method and one parameter', () => {
    const [toggleValue, { toggle, setReverseValue, setDefaultValue }] = useToggle('hello');

    // 初始化值 hello
    expect(toggleValue.value).toBe('hello');

    // 切换，期望值应该是false
    toggle();
    expect(toggleValue.value).toBeFalsy();

    // 切换，期望值应该是hello
    toggle();
    expect(toggleValue.value).toBe('hello');

    // 调用setReverseValue, 值应该是false
    setReverseValue();
    expect(toggleValue.value).toBeFalsy();

    // setDefaultValue, 值应该是hello
    setDefaultValue();
    expect(toggleValue.value).toBe('hello');
  });

  it('test on methods and two parameter', () => {
    const [toggleValue, { toggle, setReverseValue, setDefaultValue, set }] = useToggle(
      'first value',
      'last value'
    );

    // 初始化值 first value
    expect(toggleValue.value).toBe('first value');

    // 切换，期望值应该是last value
    toggle();
    expect(toggleValue.value).toBe('last value');

    // 再次切换，期望值为first value
    toggle();
    expect(toggleValue.value).toBe('first value');

    // 调用setReverseValue, 值应该是last value
    setReverseValue();
    expect(toggleValue.value).toBe('last value');

    // setDefaultValue, 值应该是first value
    setDefaultValue();
    expect(toggleValue.value).toBe('first value');

    // 调用set，设置为hello
    set('hello');
    expect(toggleValue.value).toBe('hello');
  });
});
