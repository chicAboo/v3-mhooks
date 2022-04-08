import useBoolean from '../index';

describe('useBoolean test', () => {
  it('should be defined', () => {
    expect(useBoolean).toBeDefined();
  });

  it('should return the defaultvalue', () => {
    const [state] = useBoolean(true);
    const [falseState] = useBoolean(false);

    expect(state.value).toBeTruthy();
    expect(falseState.value).toBeFalsy();
  });

  it('should be methods', () => {
    const [state, { toggle, set, setTrue, setFalse }] = useBoolean();

    expect(state.value).toBeFalsy();

    toggle();
    expect(state.value).toBeTruthy();

    set(false);
    expect(state.value).toBeFalsy();

    set(true);
    expect(state.value).toBeTruthy();

    setFalse();
    expect(state.value).toBeFalsy();

    setTrue();
    expect(state.value).toBeTruthy();
  });
});
