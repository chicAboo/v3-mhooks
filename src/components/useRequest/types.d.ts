import type { Ref, WatchSource } from 'vue';
import type { DebounceOptions } from '../useDebounceFn';
import type { ThrottleOptions } from '../useThrottleFn';

export type Query<R, P extends unknown[]> = (...args: P) => Promise<R>;

export type ServiceObject = {
  [key: string]: any;
  url: string;
};

type MutateData<R> = (newData: R) => void;
type MutateFunction<R> = (arg: (oldData: R) => R) => void;
export interface Mutate<R> extends MutateData<R>, MutateFunction<R> {}

export type ServiceParams = string | ServiceObject;

export type ServiceQuery<R, P extends unknown[]> =
  | (() => Promise<R>)
  | ((...args: P) => Promise<R>);

export type IService<R, P extends unknown[]> =
  | ((...args: P) => ServiceParams)
  | ServiceParams
  | Query<R, P>
  | Promise<R>;

export interface BaseResult<R, P extends unknown[]> {
  queries: Record<string, any>;
}

export type RefObject = {
  [key: string]: Ref<any>;
};

export type UnRef<T> = T extends Ref<infer V> ? V : T;

export type UnWrapRefObject<T> = {
  [P in keyof T]: UnRef<T[P]>;
};

export interface InnerQueryState<R, P extends unknown[]> {
  run: (...arg: P) => Promise<R | null>;
  cancel: () => void;
  refresh: () => Promise<R | null>;
}

export type UnWrapState<R, P extends unknown[]> = UnWrapRefObject<InnerQueryState<R, P>>;

export type Queries<R, P extends unknown[]> = {
  [key: string]: UnWrapState<R, P>;
};

export type State<R, P> = {
  loading: Ref<boolean>;
  data: Ref<R | undefined>;
  error: Ref<Error | undefined>;
  params: Ref<P>;
};

export type GlobalOptions = {
  loadingDelay?: number;
  pollingInterval?: number;
  pollingWhenHidden?: boolean;
  pollingWhenOffline?: boolean;
  debounce?: boolean;
  debounceOptions?: DebounceOptions;
  throttleOptions?: ThrottleOptions;
  throttle?: boolean;
  refreshOnWindowFocus?: boolean;
  refocusTimespan?: number;
  cacheTime?: number;
  manual?: boolean;
  retryCount?: number;
  retryInterval?: number;
  staleTime?: number;
};

export type Options<R, P extends unknown[]> = GlobalOptions & {
  defaultParams?: P;
  refreshDeps?: WatchSource<any>[];
  cacheKey?: string;
  queryKey?: (...args: P) => string;
  onSuccess?: (data: R, params: P) => void;
  onError?: (error: Error, params: P) => void;
  onBefore?: (params: P) => void;
  onAfter?: (params: P) => void;
};

export type Plugins = Record<string, (...args: any) => any>;
