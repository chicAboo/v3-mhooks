import { ref } from 'vue';
import useInterval from '../index';
import { sleep } from '../../utils/testingHelper';

jest.setTimeout(3000);
describe('useInterval test', () => {
  it('should be defined', () => {
    expect(useInterval).toBeDefined();
  });

  it('should be work', async () => {
    const count = ref(0);
    useInterval(() => {
      count.value += 1;
    }, 10);

    expect(count.value).toBe(0);

    await sleep(10);
    expect(count.value).toBe(1);

    await sleep(10);
    expect(count.value).toBe(2);

    await sleep(10);
    expect(count.value).toBe(3);
  });

  it('should be immediate run', async () => {
    const count = ref(0);
    useInterval(
      () => {
        count.value += 1;
      },
      10,
      { immediate: true }
    );
    expect(count.value).toBe(1);

    await sleep(10);
    expect(count.value).toBe(2);
  });

  it('should be no run', async () => {
    const count = ref(0);
    useInterval(
      () => {
        count.value += 1;
      },
      -1,
      { immediate: true }
    );
    await sleep(10);
    expect(count.value).toBe(0);
  });

  it('delay should use ref number and clear interval', async () => {
    const count = ref(0);
    const delay = ref(10);

    const clear = useInterval(() => {
      count.value += 1;
    }, delay);

    expect(count.value).toBe(0);

    await sleep(10);
    expect(count.value).toBe(1);

    await sleep(10);
    expect(count.value).toBe(2);

    await sleep(10);
    expect(count.value).toBe(3);

    clear();
    await sleep(20);
    expect(count.value).toBe(3);
  });
});
