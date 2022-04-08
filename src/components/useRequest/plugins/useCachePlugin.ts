import type { State } from '../types';
import { unRefObject } from '../utils';
import { getCache, setCache } from '../utils/cache';
import setStateBind from '../utils/setStateBind';

type CacheInfo = {
  cacheKey: string; // 缓存
  cacheTime: number; // 缓存时间
  staleTime: number; // 保鲜时间，-1永不过期，0不保鲜
};

/**
 * 缓存和预加载
 * @param param
 * @returns
 */
const useCachePlugin = <R, P extends unknown[], T extends State<R, P>>(
  { cacheKey, cacheTime, staleTime }: CacheInfo,
  { data, loading, error, params }: T
) => {
  // 统一管理状态
  const setState = setStateBind({ data, loading, error, params }, [(state) => updateCache(state)]);

  // stale time
  const staleTimeFunc = () => {
    const cache = getCache<R, P>(cacheKey);
    if (!cache || !Object.hasOwnProperty.call(cache, 'cacheData')) {
      return;
    }
    if (staleTime === -1 || +new Date() - cache.cacheTime <= staleTime) {
      const cacheQuery = cache.cacheData;
      setState({
        loading: false,
        data: cacheQuery.data,
        params: cacheQuery.params,
        error: cacheQuery.error,
      });

      return true;
    } else {
      return;
    }
  };

  // swr
  const setCacheToState = () => {
    if (cacheKey) {
      const cache = getCache<R, P>(cacheKey);

      if (cache?.cacheData) {
        const cacheQuery = cache.cacheData;
        setState({
          loading: cacheQuery.loading,
          data: cacheQuery.data,
          params: cacheQuery.params,
          error: cacheQuery.error,
        });

        return true;
      }
    }

    return false;
  };

  // 更新cache
  const updateCache = <R, P extends unknown[]>(state: State<R, P>) => {
    if (!cacheKey) {
      return;
    }
    const cacheData = getCache<R, P>(cacheKey)?.cacheData;
    const queryData = unRefObject(state);

    setCache<R, P>(cacheKey, { ...cacheData, ...queryData }, cacheTime);
  };

  return { updateCache, setState, setCacheToState, staleTimeFunc };
};

export default useCachePlugin;
