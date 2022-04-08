import limit from '../utils/limit';
import { waitForTime } from '../../utils/testingHelper';

describe('limit', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('limit should work', async () => {
    const mockFunc = jest.fn();

    const limitFunc = limit(mockFunc, 1000);

    limitFunc();
    await waitForTime(500);
    limitFunc();
    expect(mockFunc).toBeCalledTimes(1);

    await waitForTime(500);
    limitFunc();
    expect(mockFunc).toBeCalledTimes(2);

    await waitForTime(500);
    expect(mockFunc).toBeCalledTimes(2);
  });
});
