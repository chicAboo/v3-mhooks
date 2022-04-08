import { setCache, getCache, clearCache } from '../utils/cache';
import { waitForTime } from '../../utils/testingHelper';

describe('utils cache', () => {
  const cacheKey = 'time';
  const cacheData = {
    loading: false,
    data: '测试数据',
    error: undefined,
    params: undefined,
  };

  beforeAll(() => {
    jest.useFakeTimers();
    clearCache();
  });

  it('setCache and getCache should work', () => {
    setCache(undefined as any, cacheData as any, 1000);
    expect(getCache(cacheKey)).toBeUndefined();
    expect(getCache('test')).toBeUndefined();

    setCache<any, any>(cacheKey, cacheData, +new Date());
    const data = getCache(cacheKey);
    expect(data?.cacheData).toEqual(cacheData);
  });

  it('cacheTime should work', async () => {
    setCache<any, any>(cacheKey, cacheData, 10000);
    expect(getCache(cacheKey)?.cacheData).toEqual(cacheData);

    setCache<any, any>(cacheKey, cacheData, 10000);
    expect(getCache(cacheKey)?.cacheData).toMatchObject(cacheData);
    await waitForTime(11000);
    expect(getCache(cacheKey)?.cacheData).toBeUndefined();
  });

  it('clearCache should work', async () => {
    setCache<any, any>('test1', cacheData, 10000);
    setCache<any, any>('test2', cacheData, 10000);

    expect(getCache('test1')?.cacheData).toEqual(cacheData);
    expect(getCache('test2')?.cacheData).toEqual(cacheData);

    clearCache('test1');

    expect(getCache('test1')?.cacheData).toBeUndefined();

    clearCache();
    expect(getCache('test2')?.cacheData).toBeUndefined();
  });
});
