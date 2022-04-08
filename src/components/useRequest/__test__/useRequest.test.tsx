import { ref, reactive, defineComponent } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { useRequest } from '../../../index';
import { request, waitForAll, failedRequest, waitForTime } from '../../utils/testingHelper';
import { focusListeners, visibleListeners, reconnectListeners } from '../utils/subscriber';

const errorFunc = console.error;
declare let jsdom: any;

describe('useRequest', () => {
  beforeAll(() => {
    console.error = jest.fn();
    jest.useFakeTimers();
  });

  beforeEach(() => {
    visibleListeners.clear();
    focusListeners.clear();
    reconnectListeners.clear();
  });

  it('should be defined', () => {
    expect(useRequest).toBeDefined();
  });

  it('should auto run', async () => {
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { data } = useRequest(request);

          return () => (
            <div>
              <p>{data.value}</p>
            </div>
          );
        },
      })
    );

    await waitForAll();
    expect(wrapper.find('p').text()).toBe('success');
  });

  it('should be triggered manually', async () => {
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { data, run } = useRequest(request, { manual: true });

          return () => (
            <div>
              <button id="run" onClick={() => run()}>
                submit
              </button>
              <p>{data.value}</p>
            </div>
          );
        },
      })
    );

    await waitForAll();
    expect(wrapper.find('p').text()).toBe('');

    wrapper.find('#run').trigger('click');
    await waitForAll();
    expect(wrapper.find('p').text()).toBe('success');
  });

  it('defaultParams and params should work', async () => {
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { params, run } = useRequest(request, { defaultParams: ['hello', 'useRequest'] });

          return () => (
            <div>
              <button id="run" onClick={() => run('I', 'am', 'ChicABoo!')}>
                submit
              </button>
              <p>{params.value?.join(' ')}</p>
            </div>
          );
        },
      })
    );

    await waitForAll();
    expect(wrapper.find('p').text()).toBe('hello useRequest');

    wrapper.find('#run').trigger('click');
    await waitForAll();
    expect(wrapper.find('p').text()).toBe('I am ChicABoo!');
  });

  it('mutate should work', async () => {
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { data, mutate } = useRequest(request);

          return () => (
            <div>
              <button id="run" onClick={() => mutate('mutate test')}>
                submit
              </button>
              <p>{data.value}</p>
            </div>
          );
        },
      })
    );
    await waitForAll();
    expect(wrapper.find('p').text()).toBe('success');

    wrapper.find('#run').trigger('click');
    await waitForAll();
    expect(wrapper.find('p').text()).toBe('mutate test');
  });

  it('onBefore and onAfter should work', async () => {
    const mockBeforeCallback = jest.fn();
    const mockAfterCallback = jest.fn();

    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { run } = useRequest(request, {
            manual: true,
            onBefore: mockBeforeCallback,
            onAfter: mockAfterCallback,
          });

          return () => (
            <div>
              <button id="run" onClick={() => run('hello', 'useRequest')}>
                submit
              </button>
            </div>
          );
        },
      })
    );

    wrapper.find('#run').trigger('click');
    await waitForAll();
    expect(mockBeforeCallback).toHaveBeenCalledWith(['hello', 'useRequest']);
    expect(mockAfterCallback).toHaveBeenCalledWith(['hello', 'useRequest']);
  });

  it('onSuccess should work', async () => {
    const mockSuccessCallback = jest.fn();
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { run } = useRequest(request, {
            manual: true,
            onSuccess: mockSuccessCallback,
          });

          return () => (
            <div>
              <button id="run" onClick={() => run('hello', 'useRequest')}>
                submit
              </button>
            </div>
          );
        },
      })
    );

    wrapper.find('#run').trigger('click');
    await waitForAll();
    expect(mockSuccessCallback).toHaveBeenCalledWith('hello,useRequest', ['hello', 'useRequest']);
  });

  it('onError should work', async () => {
    const mockErrorCallback = jest.fn();

    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { run } = useRequest(failedRequest, {
            manual: true,
            onError: mockErrorCallback,
          });

          return () => (
            <div>
              <button id="run" onClick={() => run()}>
                submit
              </button>
            </div>
          );
        },
      })
    );

    wrapper.find('#run').trigger('click');
    await waitForAll();
    expect(mockErrorCallback).toHaveBeenCalledWith(new Error('fail'), []);
  });

  it('refreshDeps should work', async () => {
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const countRef = ref(0);
          const reactiveCount = reactive({ count: 0 });
          const { loading } = useRequest(failedRequest, {
            refreshDeps: [countRef, () => reactiveCount.count],
          });

          return () => (
            <div>
              <button id="ref" onClick={() => countRef.value++}>
                countRef
              </button>
              <button id="reactive" onClick={() => reactiveCount.count++}>
                countReactive
              </button>
              <p id="loading">{`data:${loading.value}`}</p>
            </div>
          );
        },
      })
    );

    await wrapper.find('#ref').trigger('click');
    expect(wrapper.find('#loading').text()).toBe('data:true');
    await waitForAll();
    expect(wrapper.find('#loading').text()).toBe('data:false');

    await wrapper.find('#reactive').trigger('click');
    expect(wrapper.find('#loading').text()).toBe('data:true');
    await waitForAll();
    expect(wrapper.find('#loading').text()).toBe('data:false');
  });

  it('loadingDelay should work', async () => {
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { loading, run } = useRequest(request, {
            manual: true,
            loadingDelay: 500,
          });

          return () => (
            <button id="loading" onClick={() => run()}>
              {`data:${loading.value}`}
            </button>
          );
        },
      })
    );

    wrapper.find('#loading').trigger('click');
    expect(wrapper.find('#loading').text()).toBe('data:false');
    await waitForTime(400);
    expect(wrapper.find('#loading').text()).toBe('data:false');
    await waitForTime(100);
    expect(wrapper.find('#loading').text()).toBe('data:true');
    await waitForTime(500);
    expect(wrapper.find('#loading').text()).toBe('data:false');
  });

  it('cancel loadingDelay should work', async () => {
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { loading, cancel } = useRequest(request, {
            loadingDelay: 500,
          });

          return () => (
            <button id="loading" onClick={() => cancel()}>
              {`data:${loading.value}`}
            </button>
          );
        },
      })
    );

    expect(wrapper.find('#loading').text()).toBe('data:false');
    await waitForTime(400);
    expect(wrapper.find('#loading').text()).toBe('data:false');

    wrapper.find('#loading').trigger('click');
    await waitForTime(200);
    expect(wrapper.find('#loading').text()).toBe('data:false');
  });

  it('cancel should work', async () => {
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { cancel, data, run } = useRequest(request);

          return () => (
            <div>
              <button onClick={() => cancel()} id="cancel" />
              <button onClick={() => run()} id="run" />
              <span id="data">{`data:${data.value}`}</span>
            </div>
          );
        },
      })
    );

    expect(wrapper.find('#data').text()).toBe('data:undefined');
    await wrapper.find('#cancel').trigger('click');
    await waitForAll();
    expect(wrapper.find('#data').text()).toBe('data:undefined');

    await wrapper.find('#run').trigger('click');
    await waitForAll();
    expect(wrapper.find('#data').text()).toBe('data:success');
  });

  it('cancel should work when request error', async () => {
    console.error = jest.fn();
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { cancel, data, run } = useRequest(failedRequest);

          return () => (
            <div>
              <button onClick={() => cancel()} id="cancel" />
              <button onClick={() => run()} id="run" />
              <span id="data">{`data:${data.value}`}</span>
            </div>
          );
        },
      })
    );

    expect(wrapper.find('#data').text()).toBe('data:undefined');
    await waitForTime(500);
    await wrapper.find('#cancel').trigger('click');
    await waitForAll();
    expect(wrapper.find('#data').text()).toBe('data:undefined');

    await wrapper.find('#run').trigger('click');
    await waitForAll();
    expect(console.error).toHaveBeenCalledWith(new Error('fail'));
  });

  it('pollingInterval should work', async () => {
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { run, cancel, loading } = useRequest(request, {
            manual: true,
            pollingInterval: 500,
          });

          return () => (
            <div>
              <button onClick={() => cancel()} id="cancel" />
              <button onClick={() => run()} id="run" />
              <span id="data">{`${loading.value}`}</span>
            </div>
          );
        },
      })
    );

    await wrapper.find('#run').trigger('click');
    expect(wrapper.find('#data').text()).toBe('true');
    await waitForTime(1000);
    expect(wrapper.find('#data').text()).toBe('false');
    await waitForTime(500);
    expect(wrapper.find('#data').text()).toBe('true');
    await waitForTime(1000);
    expect(wrapper.find('#data').text()).toBe('false');

    await wrapper.find('#cancel').trigger('click');
    await waitForAll();
    expect(wrapper.find('#data').text()).toBe('false');
  });

  it('does not work when pollingInterval less than 0', async () => {
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { run, cancel, loading } = useRequest(request, {
            manual: true,
            pollingInterval: -1,
          });

          return () => (
            <div>
              <button onClick={() => run()} id="run" />
              <span id="data">{`${loading.value}`}</span>
            </div>
          );
        },
      })
    );

    await wrapper.find('#run').trigger('click');
    expect(wrapper.find('#data').text()).toBe('true');
    await waitForTime(1000);
    expect(wrapper.find('#data').text()).toBe('false');
    await waitForTime(500);
    expect(wrapper.find('#data').text()).toBe('false');
  });

  it('should work when pollingWhenHidden is true', async () => {
    let count = 0;
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { data } = useRequest(() => request((count += 1)), {
            pollingInterval: 1000,
            pollingWhenHidden: true,
          });

          return () => <div>{data.value}</div>;
        },
      })
    );

    expect(wrapper.text()).toBe('');
    await waitForTime(1000);
    expect(wrapper.text()).toBe('1');
    await waitForTime(2000);
    expect(wrapper.text()).toBe('2');

    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
    });

    await waitForTime(2000);
    expect(wrapper.text()).toBe('3');
    await waitForTime(2000);
    expect(wrapper.text()).toBe('4');

    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
    });

    await waitForTime(2000);
    expect(wrapper.text()).toBe('5');
    await waitForTime(2000);
    expect(wrapper.text()).toBe('6');
  });

  it('should not work when pollingWhenHidden is false and visibleState is hidden', async () => {
    let count = 0;
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { data } = useRequest(() => request((count += 1)), {
            pollingInterval: 1000,
            pollingWhenHidden: false,
          });

          return () => <div>{data.value}</div>;
        },
      })
    );

    expect(wrapper.text()).toBe('');
    await waitForTime(1000);
    expect(wrapper.text()).toBe('1');
    await waitForTime(2000);
    expect(wrapper.text()).toBe('2');

    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
    });

    await waitForTime(2000);
    expect(wrapper.text()).toBe('3');
    await waitForTime(2000);
    expect(wrapper.text()).toBe('3');

    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
    });

    // manul dispatch event
    jsdom.window.dispatchEvent(new Event('visibilitychange'));

    await waitForTime(1000);
    expect(wrapper.text()).toBe('4');
    await waitForTime(2000);
    expect(wrapper.text()).toBe('5');
  });

  it('should work when pollingWhenOffline is true', async () => {
    let count = 0;
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { data } = useRequest(() => request((count += 1)), {
            pollingInterval: 1000,
            pollingWhenOffline: true,
          });

          return () => <div>{data.value}</div>;
        },
      })
    );

    expect(wrapper.text()).toBe('');
    await waitForTime(1000);
    expect(wrapper.text()).toBe('1');
    await waitForTime(2000);
    expect(wrapper.text()).toBe('2');

    Object.defineProperty(window.navigator, 'onLine', {
      value: false,
      writable: true,
    });

    await waitForTime(2000);
    expect(wrapper.text()).toBe('3');
    await waitForTime(2000);
    expect(wrapper.text()).toBe('4');

    Object.defineProperty(window.navigator, 'onLine', {
      value: true,
      writable: true,
    });

    await waitForTime(2000);
    expect(wrapper.text()).toBe('5');
    await waitForTime(2000);
    expect(wrapper.text()).toBe('6');
  });

  it('should not work when pollingWhenOffline is false and onLine is false', async () => {
    let count = 0;
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { data } = useRequest(() => request((count += 1)), {
            pollingInterval: 1000,
            pollingWhenOffline: false,
          });

          return () => <div>{data.value}</div>;
        },
      })
    );

    expect(wrapper.text()).toBe('');
    await waitForTime(1000);
    expect(wrapper.text()).toBe('1');
    await waitForTime(2000);
    expect(wrapper.text()).toBe('2');

    Object.defineProperty(window.navigator, 'onLine', {
      value: false,
      writable: true,
    });

    await waitForTime(2000);
    expect(wrapper.text()).toBe('3');
    await waitForTime(2000);
    expect(wrapper.text()).toBe('3');

    Object.defineProperty(window.navigator, 'onLine', {
      value: true,
      writable: true,
    });

    // manul dispatch event
    jsdom.window.dispatchEvent(new Event('visibilitychange'));
    await waitForTime(1000);
    expect(wrapper.text()).toBe('4');
    await waitForTime(2000);
    expect(wrapper.text()).toBe('5');
  });

  it('refreshOnWindowFocus should work', async () => {
    let count = 0;
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { data, run } = useRequest(() => request((count += 1)), {
            refreshOnWindowFocus: true,
          });

          return () => <div onClick={() => run()}>{data.value}</div>;
        },
      })
    );

    expect(wrapper.text()).toBe('');
    await waitForTime(1000);
    expect(wrapper.text()).toBe('1');

    wrapper.find('div').trigger('click');
    await waitForTime(1000);
    expect(wrapper.text()).toBe('2');

    jsdom.window.dispatchEvent(new Event('visibilitychange'));
    await waitForTime(1000);
    expect(wrapper.text()).toBe('3');

    jsdom.window.dispatchEvent(new Event('visibilitychange'));
    await waitForTime(1000);
    expect(wrapper.text()).toBe('3');

    // wait 5s
    await waitForTime(4000);
    jsdom.window.dispatchEvent(new Event('visibilitychange'));
    await waitForTime(1000);
    expect(wrapper.text()).toBe('4');
  });

  it('refocusTimespan should work', async () => {
    let count = 0;
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { data, run } = useRequest(() => request((count += 1)), {
            refreshOnWindowFocus: true,
            refocusTimespan: 10000,
          });

          return () => <div onClick={() => run()}>{data.value}</div>;
        },
      })
    );

    expect(wrapper.text()).toBe('');
    await waitForTime(1000);
    expect(wrapper.text()).toBe('1');

    wrapper.find('div').trigger('click');
    await waitForTime(1000);
    expect(wrapper.text()).toBe('2');

    jsdom.window.dispatchEvent(new Event('visibilitychange'));
    await waitForTime(1000);
    expect(wrapper.text()).toBe('3');

    jsdom.window.dispatchEvent(new Event('visibilitychange'));
    await waitForTime(5000);
    expect(wrapper.text()).toBe('3');

    // wait 5s
    await waitForTime(9000);
    jsdom.window.dispatchEvent(new Event('visibilitychange'));
    await waitForTime(1000);
    expect(wrapper.text()).toBe('4');
  });

  it('debounce and cancel debounce is should work', async () => {
    let count = 0;
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { data, run, cancel } = useRequest(() => request((count += 1)), {
            manual: true,
            debounce: true,
          });

          return () => (
            <div>
              <button id="run" onClick={() => run()}>
                {data.value}
              </button>
              ;
              <button id="cancel" onClick={() => cancel()}>
                cancel
              </button>
              ;
            </div>
          );
        },
      })
    );

    wrapper.find('#run').trigger('click');
    wrapper.find('#run').trigger('click');
    wrapper.find('#run').trigger('click');
    wrapper.find('#run').trigger('click');
    wrapper.find('#run').trigger('click');

    await waitForAll();
    expect(wrapper.find('#run').text()).toBe('1');

    // cancel test
    wrapper.find('#run').trigger('click');
    wrapper.find('#run').trigger('click');
    wrapper.find('#run').trigger('click');
    wrapper.find('#run').trigger('click');
    wrapper.find('#run').trigger('click');

    wrapper.find('#cancel').trigger('click');

    await waitForAll();
    expect(wrapper.find('#run').text()).toBe('1');
  });

  it('throttle and cancel throttle is should work', async () => {
    let count = 0;
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { data, run, cancel } = useRequest(() => request((count += 1)), {
            manual: true,
            throttle: true,
            throttleOptions: {
              wait: 100,
            },
          });

          return () => (
            <div>
              <button id="run" onClick={() => run()}>
                {data.value}
              </button>
              ;
              <button id="cancel" onClick={() => cancel()}>
                cancel
              </button>
              ;
            </div>
          );
        },
      })
    );

    await wrapper.find('#run').trigger('click');
    await waitForTime(40);
    expect(wrapper.find('#run').text()).toBe('');

    await wrapper.find('#run').trigger('click');
    await waitForTime(40);
    expect(wrapper.find('#run').text()).toBe('');

    await wrapper.find('#run').trigger('click');
    await waitForAll();
    expect(wrapper.find('#run').text()).toBe('2');

    // cancel
    await wrapper.find('#run').trigger('click');
    await wrapper.find('#cancel').trigger('click');

    await waitForAll();
    expect(wrapper.find('#run').text()).toBe('2');
  });

  it('cacheKey is should work', async () => {
    let count = 0;
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { data, run } = useRequest(() => request((count += 1)), {
            cacheKey: 'time',
          });

          return () => (
            <div id="run" onClick={() => run()}>
              {data.value}
            </div>
          );
        },
      })
    );

    expect(wrapper.text()).toBe('');

    await wrapper.find('#run').trigger('click');
    await waitForAll();
    expect(wrapper.text()).toBe('1');

    await wrapper.find('#run').trigger('click');
    await waitForTime(1000);
    expect(wrapper.text()).toBe('1');
  });

  it('cacheKey is should work', async () => {
    let count = 0;
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { data, run } = useRequest(() => request((count += 1)), {
            cacheKey: 'time',
          });

          return () => (
            <div id="run" onClick={() => run()}>
              {data.value}
            </div>
          );
        },
      })
    );

    expect(wrapper.text()).toBe('');

    await wrapper.find('#run').trigger('click');
    await waitForAll();
    expect(wrapper.text()).toBe('1');

    await wrapper.find('#run').trigger('click');
    await waitForTime(1000);
    expect(wrapper.text()).toBe('1');
  });

  it('loadingDelay should work', async () => {
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { loading, run } = useRequest(request, {
            loadingDelay: 500,
          });

          return () => (
            <div id="run" onClick={() => run()}>
              {`${loading.value}`}
            </div>
          );
        },
      })
    );
    await wrapper.find('#run').trigger('click');
    await waitForTime(400);
    expect(wrapper.text()).toBe('false');

    await waitForTime(200);
    expect(wrapper.text()).toBe('true');

    await waitForAll();
    expect(wrapper.text()).toBe('false');
  });

  it('retryCount should work', async () => {
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { loading, run } = useRequest(failedRequest, {
            retryCount: 3,
          });

          return () => (
            <div id="run" onClick={() => run()}>
              {`${loading.value}`}
            </div>
          );
        },
      })
    );

    for (let i = 0; i < 3; i++) {
      await wrapper.find('#run').trigger('click');
      expect(wrapper.text()).toBe('true');
      await waitForTime(1000);
      expect(wrapper.text()).toBe('false');
    }
  });

  it('retryInterval should work', async () => {
    const wrapper = shallowMount(
      defineComponent({
        setup() {
          const { loading, run } = useRequest(failedRequest, {
            retryCount: 3,
            retryInterval: 2000,
          });

          return () => (
            <div id="run" onClick={() => run()}>
              {`${loading.value}`}
            </div>
          );
        },
      })
    );

    for (let i = 0; i < 3; i++) {
      await wrapper.find('#run').trigger('click');
      expect(wrapper.text()).toBe('true');
      await waitForTime(2000);
      expect(wrapper.text()).toBe('false');
    }
  });
});
