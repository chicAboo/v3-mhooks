import { unref } from 'vue';
import type { RefObject, UnRef } from '../types';

export const objectToString = Object.prototype.toString;
export const toTypeString = (val: unknown): string => objectToString.call(val);

export const isString = (val: unknown): val is string => toTypeString(val) === '[object String]';
export const isArray = (val: unknown): val is any[] => Array.isArray(val);

export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object';

export const isPromise = (fn: unknown): fn is Promise<unknown> =>
  isObject(fn) && isFunction(fn.then) && isFunction(fn.catch);

export const isFunction = (fn: unknown): fn is Function => fn instanceof Function;

export const isNil = (val: unknown) => val === null || val === undefined;

export const isServer = typeof window === 'undefined';

export const isDocumentVisibility = () =>
  !isServer && window?.document?.visibilityState === 'visible';

export const isOnline = () => (!isServer && window?.navigator?.onLine) ?? true;

export const unRefObject = <T extends RefObject>(val: T) => {
  const obj = {};

  Object.keys(val).forEach((key) => {
    obj[key] = unref(val[key]);
  });

  return obj as {
    [K in keyof T]: UnRef<T[K]>;
  };
};

export const resolvedPromise = Promise.resolve(null);

export const warning = (message: string, throwError = false) => {
  const msg = `Warning: [useRequest] ${message}`;
  if (throwError) {
    return new Error(msg);
  } else {
    console.error(msg);
  }
};
