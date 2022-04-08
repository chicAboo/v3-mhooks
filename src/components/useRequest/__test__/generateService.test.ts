import generatedService, { requestProxy } from '../utils/generateQuery';

const errorFunc = console.error;
describe('generateService', () => {
  const mockFunc = () =>
    new Promise((resolve) => {
      resolve('result data');
    });

  beforeAll(() => {
    console.error = jest.fn();
  });

  it('should use string service', async () => {
    const fn = jest.fn();
    const service = generatedService('/api/example');

    try {
      await service();
    } catch (err: any) {
      expect(err.message).toBe('Network Error');
      fn();
    }

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should use object service', async () => {
    const fn = jest.fn();
    const service = generatedService({ url: '/api/example' });

    try {
      await service();
    } catch (err: any) {
      expect(err.message).toBe('Network Error');
      fn();
    }

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should use promise service', async () => {
    const fn = jest.fn();
    const service = generatedService(mockFunc);

    try {
      const data = await service();
      expect(data).toBe('result data');
      fn();
    } catch (err: any) {
      expect(err.message).toBe('Network Error');
    }

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
