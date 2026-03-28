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

export function useProgressData(): ProgressData {
  const { isLoading, data } = db.useQuery({ progressEntries: {} });

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
