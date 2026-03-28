import { id } from '@instantdb/react-native';
import { usePlayerStore } from './use-player-store';
import type { RoutineExercise } from '@/content/types';

jest.mock('@instantdb/react-native', () => ({
  id: jest.fn(),
}));

const mockGetState = jest.fn(() => ({ transitionTime: 0 }));
jest.mock('./use-settings-store', () => ({
  useSettingsStore: { getState: () => mockGetState() },
}));

const mockedId = jest.mocked(id);

const exercises: RoutineExercise[] = [
  { exerciseId: 'b', holdSeconds: 20, sides: 'none', order: 2 },
  { exerciseId: 'a', holdSeconds: 10, sides: 'none', order: 1 },
];

describe('usePlayerStore', () => {
  beforeEach(() => {
    usePlayerStore.getState().reset();
    mockedId.mockReset();
    mockedId.mockReturnValue('session-1');
    mockGetState.mockReturnValue({ transitionTime: 0 });
  });

  it('initializes a session with sorted exercises and overridden hold times', () => {
    usePlayerStore.getState().initSession(
      'routine-1',
      { a: 15, b: 25 },
      exercises,
    );

    expect(usePlayerStore.getState()).toMatchObject({
      sessionId: 'session-1',
      routineId: 'routine-1',
      status: 'countdown',
      elapsedSeconds: 0,
      exercisesCompleted: 0,
      exercises: [
        { exerciseId: 'a', holdSeconds: 15 },
        { exerciseId: 'b', holdSeconds: 25 },
      ],
    });
  });

  it('advances through exercises and becomes complete at the end', () => {
    usePlayerStore.getState().initSession('routine-1', {}, exercises);

    usePlayerStore.getState().advance();
    expect(usePlayerStore.getState()).toMatchObject({
      currentIndex: 1,
      status: 'playing',
      exercisesCompleted: 1,
    });

    usePlayerStore.getState().advance();
    expect(usePlayerStore.getState()).toMatchObject({
      currentIndex: 1,
      status: 'complete',
      exercisesCompleted: 2,
    });

    usePlayerStore.getState().advance();
    expect(usePlayerStore.getState()).toMatchObject({
      currentIndex: 1,
      status: 'complete',
      exercisesCompleted: 2,
    });
  });

  it('retreats one step and never drops completed exercises below zero', () => {
    usePlayerStore.getState().initSession('routine-1', {}, exercises);
    usePlayerStore.getState().advance();

    usePlayerStore.getState().retreat();
    expect(usePlayerStore.getState()).toMatchObject({
      currentIndex: 0,
      status: 'playing',
      exercisesCompleted: 0,
    });

    usePlayerStore.getState().retreat();
    expect(usePlayerStore.getState()).toMatchObject({
      currentIndex: 0,
      exercisesCompleted: 0,
    });
  });

  it('resets the store back to the idle state', () => {
    usePlayerStore.getState().initSession('routine-1', {}, exercises);
    usePlayerStore.getState().tick();
    usePlayerStore.getState().advance();

    usePlayerStore.getState().reset();

    expect(usePlayerStore.getState()).toMatchObject({
      sessionId: '',
      routineId: '',
      exercises: [],
      currentIndex: 0,
      transitionIndex: 0,
      status: 'idle',
      elapsedSeconds: 0,
      exercisesCompleted: 0,
    });
  });

  it('enters transitioning status when transitionTime > 0', () => {
    mockGetState.mockReturnValue({ transitionTime: 10 });
    usePlayerStore.getState().initSession('routine-1', {}, exercises);

    usePlayerStore.getState().advance();
    expect(usePlayerStore.getState()).toMatchObject({
      currentIndex: 0,
      transitionIndex: 1,
      status: 'transitioning',
      exercisesCompleted: 1,
    });
  });

  it('finishTransition moves to the next exercise', () => {
    mockGetState.mockReturnValue({ transitionTime: 10 });
    usePlayerStore.getState().initSession('routine-1', {}, exercises);

    usePlayerStore.getState().advance();
    usePlayerStore.getState().finishTransition();

    expect(usePlayerStore.getState()).toMatchObject({
      currentIndex: 1,
      status: 'playing',
    });
  });

  it('skips transition on last exercise and goes to complete', () => {
    mockGetState.mockReturnValue({ transitionTime: 10 });
    usePlayerStore.getState().initSession('routine-1', {}, exercises);

    usePlayerStore.getState().advance();
    usePlayerStore.getState().finishTransition();
    usePlayerStore.getState().advance();

    expect(usePlayerStore.getState()).toMatchObject({
      status: 'complete',
      exercisesCompleted: 2,
    });
  });
});
