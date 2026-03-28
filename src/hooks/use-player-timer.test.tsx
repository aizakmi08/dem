import { act, renderHook } from '@testing-library/react-native';
import { AppState } from 'react-native';
import { cancelAnimation, withTiming } from 'react-native-reanimated';
import { usePlayerTimer } from './use-player-timer';

jest.mock('react-native-reanimated', () => ({
  useSharedValue: (initial: number) => {
    const { useRef } = require('react');
    const sharedValueRef = useRef<{ value: number }>();

    if (!sharedValueRef.current) {
      sharedValueRef.current = { value: initial };
    }

    return sharedValueRef.current;
  },
  withTiming: jest.fn((toValue, config, callback) => {
    if (config.duration === 0 && callback) {
      callback(true);
    }

    return toValue;
  }),
  cancelAnimation: jest.fn(),
  Easing: { linear: 'linear' },
}));

jest.mock('react-native-worklets', () => ({
  scheduleOnRN: jest.fn((callback: () => void) => callback()),
}));

const mockedWithTiming = jest.mocked(withTiming);
const mockedCancelAnimation = jest.mocked(cancelAnimation);

describe('usePlayerTimer', () => {
  beforeEach(() => {
    jest.spyOn(AppState, 'addEventListener').mockReturnValue({
      remove: jest.fn(),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('does not immediately complete the next exercise after a transition', () => {
    const onComplete = jest.fn();
    const onBackground = jest.fn();

    const { rerender } = renderHook(
      (props: {
        duration: number;
        exerciseIndex: number;
        status: 'playing' | 'transitioning';
      }) =>
        usePlayerTimer({
          ...props,
          onComplete,
          onBackground,
        }),
      {
        initialProps: {
          duration: 20,
          exerciseIndex: 0,
          status: 'playing',
        },
      },
    );

    mockedWithTiming.mockClear();

    rerender({
      duration: 20,
      exerciseIndex: 0,
      status: 'transitioning',
    });
    rerender({
      duration: 30,
      exerciseIndex: 1,
      status: 'playing',
    });

    expect(onComplete).not.toHaveBeenCalled();
    expect(mockedWithTiming).toHaveBeenCalledTimes(1);
    expect(mockedWithTiming).toHaveBeenCalledWith(
      0,
      expect.objectContaining({ duration: 30000 }),
      expect.any(Function),
    );
  });

  it('resumes the same exercise from the current progress after pause', () => {
    const onComplete = jest.fn();
    const onBackground = jest.fn();

    const { result, rerender } = renderHook(
      (props: { status: 'playing' | 'paused' }) =>
        usePlayerTimer({
          duration: 30,
          exerciseIndex: 0,
          status: props.status,
          onComplete,
          onBackground,
        }),
      {
        initialProps: {
          status: 'playing',
        },
      },
    );

    mockedWithTiming.mockClear();

    act(() => {
      result.current.progress.value = 0.4;
    });

    rerender({ status: 'paused' });
    rerender({ status: 'playing' });

    expect(mockedCancelAnimation).toHaveBeenCalled();
    expect(mockedWithTiming).toHaveBeenCalledTimes(1);
    expect(mockedWithTiming).toHaveBeenCalledWith(
      0,
      expect.objectContaining({ duration: 12000 }),
      expect.any(Function),
    );
  });
});
