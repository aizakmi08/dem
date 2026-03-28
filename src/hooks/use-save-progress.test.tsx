import { act, renderHook } from '@testing-library/react-native';
import { useSaveProgress } from './use-save-progress';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/db';
import { id } from '@instantdb/react-native';

jest.mock('@/hooks/use-auth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/db', () => {
  const progressEntries = new Proxy(
    {},
    {
      get: (_target, entryId) => ({
        update: (payload: unknown) => ({
          link: (links: unknown) => ({ entryId: String(entryId), payload, links }),
        }),
      }),
    },
  );

  return {
    db: {
      transact: jest.fn(),
      tx: { progressEntries },
    },
  };
});

jest.mock('@instantdb/react-native', () => ({
  id: jest.fn(),
}));

const mockedUseAuth = jest.mocked(useAuth);
const transactMock = jest.mocked(db.transact);
const mockedId = jest.mocked(id);

function flushMicrotasks() {
  return act(async () => {
    await Promise.resolve();
  });
}

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

describe('useSaveProgress', () => {
  beforeEach(() => {
    mockedUseAuth.mockReturnValue({ user: { id: 'user-1' } } as ReturnType<typeof useAuth>);
    transactMock.mockResolvedValue(undefined as never);
    mockedId.mockReset();
    mockedId.mockImplementation(() => 'entry-1');
    jest.spyOn(Date, 'now').mockReturnValue(1234567890);
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('does not save unless the session is complete', () => {
    renderHook(() =>
      useSaveProgress({
        sessionId: 'session-1',
        routineId: 'routine-1',
        status: 'playing',
        durationSeconds: 60,
        exercisesCompleted: 2,
        exercisesTotal: 3,
      }),
    );

    expect(transactMock).not.toHaveBeenCalled();
  });

  it('does not save when auth or ids are missing', () => {
    mockedUseAuth.mockReturnValue({ user: null } as ReturnType<typeof useAuth>);

    const { rerender } = renderHook(
      ({ sessionId, routineId }) =>
        useSaveProgress({
          sessionId,
          routineId,
          status: 'complete',
          durationSeconds: 60,
          exercisesCompleted: 3,
          exercisesTotal: 3,
        }),
      {
        initialProps: {
          sessionId: 'session-1',
          routineId: 'routine-1',
        },
      },
    );

    rerender({ sessionId: '', routineId: 'routine-1' });
    rerender({ sessionId: 'session-1', routineId: '' });

    expect(transactMock).not.toHaveBeenCalled();
  });

  it('saves one progress entry with the expected payload', async () => {
    renderHook(() =>
      useSaveProgress({
        sessionId: 'session-1',
        routineId: 'routine-1',
        status: 'complete',
        durationSeconds: 60,
        exercisesCompleted: 3,
        exercisesTotal: 3,
      }),
    );

    await flushMicrotasks();

    expect(transactMock).toHaveBeenCalledTimes(1);
    expect(transactMock).toHaveBeenCalledWith({
      entryId: 'entry-1',
      payload: {
        userId: 'user-1',
        routineId: 'routine-1',
        completedAt: 1234567890,
        durationSeconds: 60,
        exercisesCompleted: 3,
        exercisesTotal: 3,
      },
      links: { $user: 'user-1' },
    });
  });

  it('does not duplicate a save for the same completed session after success', async () => {
    const { rerender } = renderHook(
      ({ durationSeconds }) =>
        useSaveProgress({
          sessionId: 'session-1',
          routineId: 'routine-1',
          status: 'complete',
          durationSeconds,
          exercisesCompleted: 3,
          exercisesTotal: 3,
        }),
      {
        initialProps: { durationSeconds: 60 },
      },
    );

    await flushMicrotasks();
    rerender({ durationSeconds: 61 });
    await flushMicrotasks();

    expect(transactMock).toHaveBeenCalledTimes(1);
  });

  it('does not duplicate a save while the original request is still in flight', async () => {
    const deferred = createDeferred<void>();
    transactMock.mockReturnValue(deferred.promise as never);

    const { rerender } = renderHook(
      ({ durationSeconds }) =>
        useSaveProgress({
          sessionId: 'session-1',
          routineId: 'routine-1',
          status: 'complete',
          durationSeconds,
          exercisesCompleted: 3,
          exercisesTotal: 3,
        }),
      {
        initialProps: { durationSeconds: 60 },
      },
    );

    await flushMicrotasks();
    rerender({ durationSeconds: 61 });
    await flushMicrotasks();

    expect(transactMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      deferred.resolve();
      await deferred.promise;
    });
  });

  it('retries a failed save and succeeds on the next attempt', async () => {
    jest.useFakeTimers();
    transactMock
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(undefined as never);
    mockedId.mockImplementationOnce(() => 'entry-1').mockImplementationOnce(() => 'entry-2');

    renderHook(() =>
      useSaveProgress({
        sessionId: 'session-1',
        routineId: 'routine-1',
        status: 'complete',
        durationSeconds: 60,
        exercisesCompleted: 3,
        exercisesTotal: 3,
      }),
    );

    await flushMicrotasks();
    expect(transactMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      jest.advanceTimersByTime(2000);
      await Promise.resolve();
    });

    expect(transactMock).toHaveBeenCalledTimes(2);
    expect(transactMock.mock.calls[1][0]).toMatchObject({
      entryId: 'entry-2',
      payload: {
        routineId: 'routine-1',
        durationSeconds: 60,
      },
    });
  });

  it('clears a pending retry on unmount', async () => {
    jest.useFakeTimers();
    transactMock.mockRejectedValueOnce(new Error('offline'));

    const { unmount } = renderHook(() =>
      useSaveProgress({
        sessionId: 'session-1',
        routineId: 'routine-1',
        status: 'complete',
        durationSeconds: 60,
        exercisesCompleted: 3,
        exercisesTotal: 3,
      }),
    );

    await flushMicrotasks();
    unmount();

    await act(async () => {
      jest.advanceTimersByTime(2000);
      await Promise.resolve();
    });

    expect(transactMock).toHaveBeenCalledTimes(1);
  });

  it('saves again when a new session completes', async () => {
    mockedId.mockImplementationOnce(() => 'entry-1').mockImplementationOnce(() => 'entry-2');

    const { rerender } = renderHook(
      ({ sessionId }) =>
        useSaveProgress({
          sessionId,
          routineId: 'routine-1',
          status: 'complete',
          durationSeconds: 60,
          exercisesCompleted: 3,
          exercisesTotal: 3,
        }),
      {
        initialProps: { sessionId: 'session-1' },
      },
    );

    await flushMicrotasks();
    rerender({ sessionId: 'session-2' });
    await flushMicrotasks();

    expect(transactMock).toHaveBeenCalledTimes(2);
    expect(transactMock.mock.calls[1][0]).toMatchObject({
      entryId: 'entry-2',
    });
  });
});
