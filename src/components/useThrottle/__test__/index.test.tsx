import { defineComponent, ref } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { sleep } from '../../utils/testingHelper';
import useThrottle from '../index';

jest.setTimeout(30000);

describe('useThrottle', () => {
  it('should be defined', () => {
    expect(useThrottle).toBeDefined();
  });

  it('should be wait 1000ms', async () => {
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const inputValue = ref('');

          const setValue = (e: any) => {
            inputValue.value = e.value;
          };

          const throttledValue = useThrottle(inputValue);

          return () => (
            <div>
              <p>{`${throttledValue.value}`}</p>
              <input onChange={(e) => setValue(e)} />
            </div>
          );
        },
      })
    );

    expect(wrapper.find('p').text()).toBe('');
    wrapper.find('input').trigger('change', { value: 'a' });
    expect(wrapper.find('p').text()).toBe('');

    wrapper.find('input').trigger('change', { value: 'a' });
    expect(wrapper.find('p').text()).toBe('');

    wrapper.find('input').trigger('change', { value: 'a' });
    await sleep(1000);
    expect(wrapper.find('p').text()).toBe('a');

    wrapper.find('input').trigger('change', { value: 'aaa' });
    await sleep(1000);
    expect(wrapper.find('p').text()).toBe('aaa');
  });
});
