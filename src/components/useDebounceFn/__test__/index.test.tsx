import { defineComponent } from 'vue';
import { shallowMount } from '@vue/test-utils';
import useDebounceFn from '../index';
import useSetState from '../../useSetState';
import { waitForAll } from '../../utils/testingHelper';

describe('useDebounceFn', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  it('should be defined', () => {
    expect(useDebounceFn).toBeDefined();
  });

  it('calling run, flush and cancel methods should work', async () => {
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const [state, setState] = useSetState({ count: 0 });
          const { run, flush, cancel } = useDebounceFn(
            (gap: number) => {
              setState({ count: state.value.count + gap });
            },
            { wait: 2000 }
          );

          return () => (
            <div>
              <p>{`data:${state.value.count}`}</p>
              <button id="run" onClick={() => run(10)}>
                run
              </button>
              <button id="flush" onClick={() => flush()}>
                flush
              </button>
              <button id="cancel" onClick={() => cancel()}>
                cancel
              </button>
            </div>
          );
        },
      })
    );

    expect(wrapper.find('p').text()).toBe('data:0');

    await wrapper.find('button#run').trigger('click');

    // 触发三次点击事件
    await wrapper.find('button#run').trigger('click');
    await wrapper.find('button#run').trigger('click');
    await wrapper.find('button#run').trigger('click');
    expect(wrapper.find('p').text()).toBe('data:0');

    await waitForAll();
    expect(wrapper.find('p').text()).toBe('data:10');

    await wrapper.find('button#run').trigger('click');
    await wrapper.find('button#flush').trigger('click');
    expect(wrapper.find('p').text()).toBe('data:20');

    await wrapper.find('button#run').trigger('click');
    await wrapper.find('button#cancel').trigger('click');
    expect(wrapper.find('p').text()).toBe('data:20');
  });
});
