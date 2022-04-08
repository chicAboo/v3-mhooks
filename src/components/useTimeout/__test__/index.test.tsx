import { defineComponent, ref } from 'vue';
import { shallowMount } from '@vue/test-utils';
import useTimeout from '../index';
import { sleep } from '../../utils/testingHelper';

jest.setTimeout(30000);
describe('useTimeout test', () => {
  it('should be defined', () => {
    expect(useTimeout).toBeDefined();
  });

  it('should be work', async () => {
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const count = ref(0);
          useTimeout(() => {
            count.value = 1;
          }, 50);

          return () => <div>{count.value}</div>;
        },
      })
    );

    expect(wrapper.find('div').text()).toBe('0');

    await sleep(51);
    expect(wrapper.find('div').text()).toBe('1');
  });

  it('should return empty string', async () => {
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const value = useTimeout(() => {}, -1);

          return () => <div>{value}</div>;
        },
      })
    );

    await sleep();
    expect(wrapper.find('div').text()).toBe('');
  });
});
