import { setGlobalOptions, getGlobalOptions, clearGlobalOptions } from '../utils/globalConfig';

describe('globalOptions', () => {
  const options = { manual: true, loadingDelay: 5000 };
  it('setGlobalOptions and getGlobalOptions should work', () => {
    setGlobalOptions(options);
    expect(getGlobalOptions()).toEqual(options);
  });

  it('clearGlobalOptions should work', () => {
    setGlobalOptions(options);

    clearGlobalOptions();

    expect(getGlobalOptions()).toEqual({});
  });
});
