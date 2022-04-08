import { defineComponent, ref } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { sleep } from '../../utils/testingHelper';
import useDebounce from '../index';

jest.setTimeout(30000);

describe('useDebounce', () => {
  it('should be defined', () => {
    expect(useDebounce).toBeDefined();
  });

  it('should be wait 1000ms', async () => {
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const count = ref(0);

          const setCount = (gap: number) => {
            count.value += gap;
          };

          const debounceValue = useDebounce(count);

          return () => (
            <div>
              <p>{`data:${debounceValue.value}`}</p>
              <button onClick={() => setCount(1)}>count+1</button>
            </div>
          );
        },
      })
    );

    expect(wrapper.find('p').text()).toBe('data:0');

    wrapper.find('button').trigger('click');
    wrapper.find('button').trigger('click');
    wrapper.find('button').trigger('click');
    expect(wrapper.find('p').text()).toBe('data:0');

    await sleep(1100);
    expect(wrapper.find('p').text()).toBe('data:3');
  });
});
