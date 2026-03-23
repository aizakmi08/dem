import { useMemo } from 'react';
import { db } from '@/lib/db';

interface ProgressData {
  activityCounts: Map<string, number>;
  currentStreak: number;
  bestStreak: number;
  totalSessions: number;
  totalMinutes: number;
  isLoading: boolean;
}

function toDateKey(timestamp: number): string {
  const d = new Date(timestamp);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function todayKey(): string {
  const now = new Date();
  return toDateKey(now.getTime());
}

function calculateStreaks(
  sortedDays: string[],
  today: string
): { currentStreak: number; bestStreak: number } {
  if (sortedDays.length === 0) return { currentStreak: 0, bestStreak: 0 };

  const nextDay = (dateKey: string): string => {
    const d = new Date(dateKey + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    return toDateKey(d.getTime());
  };

  let best = 1;
  let current = 1;

  for (let i = 1; i < sortedDays.length; i++) {
    if (sortedDays[i] === nextDay(sortedDays[i - 1])) {
      current++;
    } else {
      current = 1;
    }
    if (current > best) best = current;
  }

  const lastDay = sortedDays[sortedDays.length - 1];
  const isStreakActive = lastDay === today || nextDay(lastDay) === today;

  return {
    currentStreak: isStreakActive ? current : 0,
    bestStreak: best,
  };
}

// ── Mock data matching the Paper design ──────────────────────────────
// Set to false to use real InstantDB data
const USE_MOCK_DATA = true;

function getMockData(): ProgressData {
  // Activity counts per day matching the design's 3 intensity levels:
  //   1 session → #5C7A5C26, 2 sessions → #5C7A5C40, 3+ sessions → #5C7A5C66
  const activityCounts = new Map<string, number>([
    // March 2026 — matches Paper design exactly
    ['2026-03-02', 1], ['2026-03-04', 2], ['2026-03-06', 1],
    ['2026-03-08', 1], ['2026-03-09', 2], ['2026-03-10', 3],
    ['2026-03-12', 1], ['2026-03-13', 2], ['2026-03-14', 1],
    ['2026-03-15', 3], ['2026-03-16', 2], ['2026-03-17', 3],
    ['2026-03-18', 2], ['2026-03-19', 3], ['2026-03-20', 2],
    ['2026-03-21', 3],
    // February 2026 — 12-day best streak (Feb 5–16)
    ['2026-02-05', 1], ['2026-02-06', 2], ['2026-02-07', 1],
    ['2026-02-08', 2], ['2026-02-09', 1], ['2026-02-10', 3],
    ['2026-02-11', 1], ['2026-02-12', 2], ['2026-02-13', 1],
    ['2026-02-14', 2], ['2026-02-15', 1], ['2026-02-16', 2],
  ]);

  return {
    activityCounts,
    currentStreak: 7,
    bestStreak: 12,
    totalSessions: 23,
    totalMinutes: 142,
    isLoading: false,
  };
}

export function useProgressData(): ProgressData {
  if (USE_MOCK_DATA) return getMockData();

  const { isLoading, data } = db.useQuery({ progressEntries: {} });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMemo(() => {
    const entries = data?.progressEntries ?? [];

    if (entries.length === 0) {
      return {
        activityCounts: new Map<string, number>(),
        currentStreak: 0,
        bestStreak: 0,
        totalSessions: 0,
        totalMinutes: 0,
        isLoading: isLoading ?? false,
      };
    }

    const activityCounts = new Map<string, number>();
    let totalSeconds = 0;

    for (const entry of entries) {
      const key = toDateKey(entry.completedAt);
      activityCounts.set(key, (activityCounts.get(key) ?? 0) + 1);
      totalSeconds += entry.durationSeconds;
    }

    const sortedDays = Array.from(activityCounts.keys()).sort();
    const { currentStreak, bestStreak } = calculateStreaks(sortedDays, todayKey());

    return {
      activityCounts,
      currentStreak,
      bestStreak,
      totalSessions: entries.length,
      totalMinutes: Math.round(totalSeconds / 60),
      isLoading: isLoading ?? false,
    };
  }, [data, isLoading]);
}
