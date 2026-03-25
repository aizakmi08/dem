import { ALL_ROUTINES } from './routine-data';
import type { Routine } from './types';

export interface Series {
  id: string;
  name: string;
  description: string;
  routineIds: string[];
}

export const ALL_SERIES: Series[] = [
  {
    id: 'wake-and-shake',
    name: 'Wake & Shake',
    description: 'Dynamic morning energizer — 3 progressive levels',
    routineIds: ['wake-and-shake-1', 'wake-and-shake-2', 'wake-and-shake-3'],
  },
  {
    id: 'front-splits',
    name: 'Front Splits',
    description: 'Progressive flexibility program for splits',
    routineIds: [
      'front-splits-warm-up',
      'front-splits-1',
      'front-splits-2',
      'front-splits-3',
      'front-splits-mobility',
      'front-splits-strength',
    ],
  },
  {
    id: 'planks',
    name: 'Planks',
    description: 'Core strength — 4 levels from beginner to advanced',
    routineIds: ['planks-1', 'planks-2', 'planks-3', 'planks-4'],
  },
  {
    id: 'post-run',
    name: 'Post-Run',
    description: 'Running recovery — 3 progressive cool-downs',
    routineIds: ['post-run-1', 'post-run-2', 'post-run-3'],
  },
  {
    id: 'pelvic-floor',
    name: 'Pelvic Floor',
    description: 'Pelvic health progression — 4 levels',
    routineIds: ['pelvic-floor-2', 'pelvic-floor-3', 'pelvic-floor-4', 'pelvic-floor-5'],
  },
  {
    id: 'strength',
    name: 'Strength',
    description: 'Isometric strength — from isolated to full body',
    routineIds: [
      'strength-back',
      'strength-abs',
      'strength-arms',
      'strength-squats',
      'strength-core',
      'strength-full-body',
      'strength-expert',
    ],
  },
];

/** Resolve a series' routine IDs to full Routine objects. */
export function getSeriesRoutines(series: Series): Routine[] {
  return series.routineIds
    .map((id) => ALL_ROUTINES.find((r) => r.id === id))
    .filter(Boolean) as Routine[];
}

/** Get duration range string like "2–10 min" for a series. */
export function getSeriesDurationRange(series: Series): string {
  const routines = getSeriesRoutines(series);
  if (routines.length === 0) return '';
  const durations = routines.map((r) => r.durationMinutes);
  const min = Math.min(...durations);
  const max = Math.max(...durations);
  return min === max ? `${min} min` : `${min}–${max} min`;
}
