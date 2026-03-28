import { renderHook } from '@testing-library/react-native';
import { useProgressData } from './use-progress-data';
import { db } from '@/lib/db';

jest.mock('@/lib/db', () => ({
  db: {
    useQuery: jest.fn(),
  },
}));

const useQueryMock = jest.mocked(db.useQuery);

function entry(completedAt: string, durationSeconds: number) {
  return {
    completedAt: new Date(completedAt).getTime(),
    durationSeconds,
  };
}

describe('useProgressData', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-28T12:00:00.000Z'));
  });

  it('returns empty progress data when there are no entries', () => {
    useQueryMock.mockReturnValue({ isLoading: true, data: undefined } as never);

    const { result } = renderHook(() => useProgressData());

    expect(result.current).toEqual({
      activityCounts: new Map(),
      currentStreak: 0,
      bestStreak: 0,
      totalSessions: 0,
      totalMinutes: 0,
      isLoading: true,
    });
  });

  it('aggregates same-day entries and keeps total sessions as the raw entry count', () => {
    useQueryMock.mockReturnValue({
      isLoading: false,
      data: {
        progressEntries: [
          entry('2026-03-27T08:00:00.000Z', 30),
          entry('2026-03-27T12:00:00.000Z', 31),
          entry('2026-03-28T09:00:00.000Z', 32),
        ],
      },
    } as never);

    const { result } = renderHook(() => useProgressData());

    expect(result.current.activityCounts.get('2026-03-27')).toBe(2);
    expect(result.current.activityCounts.get('2026-03-28')).toBe(1);
    expect(result.current.totalSessions).toBe(3);
    expect(result.current.totalMinutes).toBe(2);
  });

  it('computes an active streak when entries are unsorted and include today', () => {
    useQueryMock.mockReturnValue({
      isLoading: false,
      data: {
        progressEntries: [
          entry('2026-03-28T10:00:00.000Z', 60),
          entry('2026-03-26T10:00:00.000Z', 60),
          entry('2026-03-27T10:00:00.000Z', 60),
        ],
      },
    } as never);

    const { result } = renderHook(() => useProgressData());

    expect(result.current.currentStreak).toBe(3);
    expect(result.current.bestStreak).toBe(3);
  });

  it('treats yesterday as an active streak boundary', () => {
    useQueryMock.mockReturnValue({
      isLoading: false,
      data: {
        progressEntries: [
          entry('2026-03-26T10:00:00.000Z', 60),
          entry('2026-03-27T10:00:00.000Z', 60),
        ],
      },
    } as never);

    const { result } = renderHook(() => useProgressData());

    expect(result.current.currentStreak).toBe(2);
    expect(result.current.bestStreak).toBe(2);
  });

  it('resets the current streak when the last activity is older than yesterday', () => {
    useQueryMock.mockReturnValue({
      isLoading: false,
      data: {
        progressEntries: [
          entry('2026-03-24T10:00:00.000Z', 60),
          entry('2026-03-25T10:00:00.000Z', 60),
          entry('2026-03-26T10:00:00.000Z', 60),
        ],
      },
    } as never);

    const { result } = renderHook(() => useProgressData());

    expect(result.current.currentStreak).toBe(0);
    expect(result.current.bestStreak).toBe(3);
  });

  it('does not count duplicate entries on the same day as separate streak days', () => {
    useQueryMock.mockReturnValue({
      isLoading: false,
      data: {
        progressEntries: [
          entry('2026-03-27T08:00:00.000Z', 60),
          entry('2026-03-27T09:00:00.000Z', 60),
          entry('2026-03-28T10:00:00.000Z', 60),
        ],
      },
    } as never);

    const { result } = renderHook(() => useProgressData());

    expect(result.current.currentStreak).toBe(2);
    expect(result.current.bestStreak).toBe(2);
  });
});
