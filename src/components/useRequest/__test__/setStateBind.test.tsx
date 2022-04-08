import { defineComponent, ref, onMounted } from 'vue';
import { shallowMount } from '@vue/test-utils';
import setStateBind from '../utils/setStateBind';
import { waitForAll } from '../../utils/testingHelper';

describe('setStateBind', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('should be work', async () => {
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const data = ref(0);
          const loading = ref(false);
          const params = ref();
          const error = ref();

          const func = (state: any) => {};

          const setState = setStateBind({ data, loading, params, error }, [(state) => func(state)]);

          return () => (
            <div>
              <p id="data">{data.value}</p>
              <p id="loading">{`${loading.value}`}</p>
              <button id="submit" onClick={() => setState({ data: 'test', loading: true })}>
                submit
              </button>
            </div>
          );
        },
      })
    );

    expect(wrapper.find('#data').text()).toBe('0');
    expect(JSON.parse(wrapper.find('#loading').text())).toBeFalsy();

    wrapper.find('#submit').trigger('click');
    await waitForAll();
    expect(wrapper.find('#data').text()).toBe('test');
    expect(JSON.parse(wrapper.find('#loading').text())).toBeTruthy();
  });
});
