import axios from 'axios';
import { isFunction, isPromise, isObject, isString, warning } from './index';
import type { IService, ServiceQuery } from '../types';

/**
 * 处理get请求的数据
 * @param url
 * @param options
 * @returns
 */
export const requestProxy = async (url: string, options?: Record<string, any>) => {
  const res = await axios({ url, ...options });
  if (res.status === 200) {
    return res as any;
  }
  // throw new Error(res.statusText);
};

/**
 * 判断入参类型，处理各种类型参数，返回promise
 * @param service<IService>
 * @returns Promise<any>
 */
const generatedService = <R, P extends unknown[]>(service: IService<R, P>): ServiceQuery<R, P> => {
  return (...args: P) => {
    if (isFunction(service)) {
      return generatedService(service(...args))();
    } else if (isPromise(service)) {
      return service;
    } else if (isObject(service)) {
      const { url, ...rest } = service;
      return requestProxy(url, rest);
    } else if (isString(service)) {
      return requestProxy(service);
    } else {
      throw warning('Unknow service type', true);
    }
  };
};

export default generatedService;
