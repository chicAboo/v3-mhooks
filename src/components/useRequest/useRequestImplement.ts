import { ref, watch, onMounted } from 'vue';
import { isFunction } from './utils';
import type { ServiceQuery, Options, Plugins, Mutate } from './types';
import { getGlobalOptions } from './utils/globalConfig';
import useDebounceFn from '../useDebounceFn';
import useThrottleFn from '../useThrottleFn';

function useRequestImplement<R, P extends any[]>(
  service: ServiceQuery<R, P>,
  options: Options<R, P>,
  plugins?: Plugins
) {
  const {
    usePollingPlugin,
    useDelayLoadingPlugin,
    useRefreshOnFocusPlugin,
    useCachePlugin,
    useRetryPlugin,
  } = plugins || {};

  const {
    defaultParams = [] as unknown as P,
    manual = false,
    debounce = false,
    debounceOptions = {},
    throttle = false,
    throttleOptions = {},
    cacheKey = undefined,
    cacheTime = 600000,
    staleTime = 0,
    pollingInterval = undefined,
    pollingWhenHidden = false,
    pollingWhenOffline = false,
    loadingDelay = 0,
    refreshOnWindowFocus = false,
    refocusTimespan = 5000,
    refreshDeps = [],
    retryCount = 0,
    retryInterval = 0,
    onSuccess = undefined,
    onError = undefined,
    onBefore = undefined,
    onAfter = undefined,
  } = { ...getGlobalOptions(), ...options };

  const data = ref();
  const loading = ref(false);
  const error = ref();
  const params = ref();

  const count = ref(0);
  const delayLoadingTimer = ref();
  const pollingTimer = ref();
  const retryTimer = ref();
  const stopPollingWhenHiddenOrOffline = ref(false);

  // update cache and set state
  const { setState, setCacheToState, staleTimeFunc } = useCachePlugin(
    { cacheKey, cacheTime, staleTime },
    { data, loading, error, params }
  );

  // change old data
  const mutate: Mutate<R> = (fData) => {
    const mutateDate = isFunction(fData) ? fData(data.value) : fData;

    setState({ data: mutateDate });
  };

  // delay loading
  const { delayLoading } = useDelayLoadingPlugin(loadingDelay, setState);

  // error retry
  const { errorRetry, resetRetryCount } = useRetryPlugin({ retryCount, retryInterval });

  // request
  const fetch = (...args: P) => {
    const isCache = setCacheToState();
    if (!isCache) {
      setState({ loading: !loadingDelay, params: args });

      delayLoadingTimer.value = delayLoading();
    }

    count.value += 1;
    const currentCount = count.value;

    onBefore?.(args);

    return service(...args)
      .then((res: any) => {
        if (count.value === currentCount) {
          setState({ loading: false, data: res });

          resetRetryCount();

          if (onSuccess) {
            onSuccess(res, args);
          }
        }
      })
      .catch((err: any) => {
        if (count.value === currentCount) {
          setState({ loading: false, error: err });

          retryTimer.value = errorRetry(() => fetch(...args));

          if (onError) {
            onError(err, args);
          }
          console.error(err);
        }
      })
      .finally(() => {
        if (count.value === currentCount) {
          if (delayLoadingTimer.value) {
            delayLoadingTimer.value();
          }

          pollingTimer.value = polling(() => fetch(...args));

          onAfter?.(args);
        }
      });
  };

  // debounce
  const { run: debounceFn, cancel: debounceCancel } = useDebounceFn(fetch, { ...debounceOptions });
  // throttle
  const { run: throttleFn, cancel: throttleCancel } = useThrottleFn(fetch, { ...throttleOptions });

  // request before
  const run = (...args: P) => {
    clearAllTimer();
    resetRetryCount();

    // stale time
    const isStale = staleTimeFunc();
    if (isStale) {
      return;
    }

    if (debounce) {
      debounceFn(...args);
      return;
    }
    if (throttle) {
      throttleFn(...args);
      return;
    }

    return fetch(...args);
  };

  // refresh
  const refresh = () => {
    run(...params.value);
  };

  // polling
  const { polling } = usePollingPlugin({
    error,
    retryCount,
    pollingInterval,
    pollingWhenHidden,
    pollingWhenOffline,
    stopPollingWhenHiddenOrOffline,
    refresh,
  });

  // request when refresh on window focus
  useRefreshOnFocusPlugin({ refocusTimespan, refreshOnWindowFocus, refresh });

  // clear timer
  const clearAllTimer = () => {
    if (pollingTimer.value) {
      pollingTimer.value();
    }

    if (delayLoadingTimer.value) {
      delayLoadingTimer.value();
    }

    if (retryTimer.value) {
      retryTimer.value();
    }
  };

  // cancel
  const cancel = () => {
    count.value += 1;
    setState({ loading: false });

    if (debounce) {
      debounceCancel();
    }
    if (throttle) {
      throttleCancel();
    }

    clearAllTimer();
  };

  // refresh dependencies
  if (refreshDeps.length) {
    watch(refreshDeps, () => {
      !manual && refresh();
    });
  }

  // init refresh
  onMounted(() => {
    if (!manual) {
      run(...defaultParams);
    }
  });

  return {
    loading,
    data,
    params,
    error,
    run,
    cancel,
    refresh,
    mutate,
  };
}

export default useRequestImplement;
