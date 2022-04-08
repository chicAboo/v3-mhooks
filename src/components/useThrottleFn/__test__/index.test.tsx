import { defineComponent } from 'vue';
import { shallowMount } from '@vue/test-utils';
import useThrottleFn from '../index';
import useSetState from '../../useSetState';
import { sleep } from '../../utils/testingHelper';

jest.setTimeout(20000);

const errorFunc = console.error;

describe('useThrottleFn', () => {
  beforeAll(() => {
    console.error = jest.fn();
  });
  it('should be defined', () => {
    expect(useThrottleFn).toBeDefined();
  });

  it('calling run, flush and cancel methods should work', async () => {
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const [state, setState] = useSetState({ count: 0 });
          const { run, flush, cancel } = useThrottleFn(
            (gap: number) => {
              setState({ count: state.value.count + gap });
            },
            { wait: 1000 }
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

    wrapper.find('button#run').trigger('click');
    wrapper.find('button#run').trigger('click');
    wrapper.find('button#run').trigger('click');
    expect(wrapper.find('p').text()).toBe('data:0');

    await sleep(900);
    expect(wrapper.find('p').text()).toBe('data:10');

    await sleep(100);
    wrapper.find('button#run').trigger('click');
    wrapper.find('button#flush').trigger('click');
    expect(wrapper.find('p').text()).toBe('data:20');

    wrapper.find('button#run').trigger('click');
    wrapper.find('button#cancel').trigger('click');
    expect(wrapper.find('p').text()).toBe('data:20');
  });
});
