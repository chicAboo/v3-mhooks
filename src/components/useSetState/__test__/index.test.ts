import useSetState from '../index';

describe('useSetState test', () => {
  it('should be defined', () => {
    expect(useSetState).toBeDefined();
  });

  it('should support default values', () => {
    const [state] = useSetState();

    expect(state.value).toEqual({});
  });

  it('should support object update', () => {
    const [state, setState] = useSetState({ name: 'zhangsan' });

    expect(state.value).toEqual({ name: 'zhangsan' });

    setState({ name: 'lisi', age: 35 });
    expect(state.value).toEqual({ name: 'lisi', age: 35 });
  });

  it('should support funtion update', () => {
    const [state, setState] = useSetState({ name: 'zhangsan', count: 0 });

    expect(state.value).toEqual({ name: 'zhangsan', count: 0 });

    setState((prevState) => {
      return { count: prevState.count + 1 };
    });
    expect(state.value).toEqual({ name: 'zhangsan', count: 1 });
  });
});
