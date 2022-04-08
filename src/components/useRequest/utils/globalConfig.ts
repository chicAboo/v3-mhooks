import type { GlobalOptions } from '../types';

const globalOptions = new Map();

export const setGlobalOptions = (options: GlobalOptions) => {
  Object.keys(options).forEach((key) => {
    globalOptions.set(key, options[key]);
  });
};

export const getGlobalOptions = () => {
  return Object.fromEntries(globalOptions.entries());
};

export const clearGlobalOptions = () => {
  globalOptions.clear();
};
