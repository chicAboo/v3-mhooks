import generateQuery from './utils/generateQuery';
import type { IService, Options } from './types';
import useRequestImplement from './useRequestImplement';
import {
  usePollingPlugin,
  useDelayLoadingPlugin,
  useRefreshOnFocusPlugin,
  useCachePlugin,
  useRetryPlugin,
} from './plugins';

function useRequest<R, P extends any[]>(service: IService<R, P>, options?: Options<R, P>) {
  return useRequestImplement<R, P>(generateQuery(service), options ?? {}, {
    usePollingPlugin,
    useDelayLoadingPlugin,
    useRefreshOnFocusPlugin,
    useCachePlugin,
    useRetryPlugin,
  });
}

export default useRequest;
