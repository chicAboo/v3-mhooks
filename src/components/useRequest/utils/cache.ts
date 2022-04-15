import type { UnWrapRefObject, State } from '../types';

type CacheKey = string | number;
type CacheResultType<T> = {
  cacheData: T;
  timer?: number;
  cacheTime: number;
};

export type CacheDataType<R, P extends unknown[]> = {
  queries?: { [key: string]: UnWrapRefObject<State<R, P>> };
  latestQueriesKey?: string;
};

type GetCacheReturn<R, P extends unknown[]> =
  | Omit<CacheResultType<UnWrapRefObject<State<R, P>>>, 'timer'>
  | undefined;

const CACHE_MAP = new Map<CacheKey, CacheResultType<any>>();

/**
 * 设置指定key值缓存
 * @param cacheKey
 * @param data
 * @param cacheTime
 */
export const setCache = <R, P extends unknown[]>(
  cacheKey: CacheKey,
  data: UnWrapRefObject<State<R, P>>,
  cacheTime: number
) => {
  const oldCache = CACHE_MAP.get(cacheKey);

  if (oldCache?.cacheTime) {
    clearTimeout(oldCache.timer);
  }

  const timer = setTimeout(() => CACHE_MAP.delete(cacheKey), cacheTime);

  CACHE_MAP.set(cacheKey, {
    cacheData: data,
    timer,
    cacheTime: +new Date(),
  });
};

/**
 * 获取指定缓存
 * @param cacheKey
 * @returns
 */
export const getCache = <R, P extends unknown[]>(cacheKey: CacheKey): GetCacheReturn<R, P> => {
  const cache = CACHE_MAP.get(cacheKey);

  if (!cache) {
    return;
  }

  return {
    cacheData: cache.cacheData as unknown as UnWrapRefObject<State<R, P>>,
    cacheTime: cache.cacheTime,
  };
};

/**
 * 清空指定缓存，若无惨全部清空
 * @param cacheKey 指定缓存key，可选
 */
export const clearCache = (cacheKey?: CacheKey) => {
  if (cacheKey) {
    const cacheData = CACHE_MAP.get(cacheKey);
    if (cacheData) {
      clearTimeout(cacheData.timer);
      CACHE_MAP.delete(cacheKey);
    }
  } else {
    CACHE_MAP.forEach((item) => clearTimeout(item.timer));
    CACHE_MAP.clear();
  }
};
