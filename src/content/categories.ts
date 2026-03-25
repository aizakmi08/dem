import type { Category } from './types';
import { ALL_ROUTINES } from './routine-data';

export interface CategoryInfo {
  category: Category;
  label: string;
}

export const CATEGORY_ORDER: CategoryInfo[] = [
  { category: 'energize', label: 'Energize' },
  { category: 'posture', label: 'Posture' },
  { category: 'relax-unwind', label: 'Relax & Unwind' },
  { category: 'at-the-office', label: 'At the Office' },
  { category: 'running', label: 'Running' },
  { category: 'splits', label: 'Splits' },
  { category: 'pre-post-workout', label: 'Pre & Post Workout' },
  { category: 'strength', label: 'Strength' },
  { category: 'planks', label: 'Planks' },
  { category: 'targeted', label: 'Targeted' },
  { category: 'body-part', label: 'Body Part' },
  { category: 'pelvic-floor', label: 'Pelvic Floor' },
  { category: 'beginner-series', label: 'Beginner Series' },
];

export const CATEGORY_LABELS: Record<Category, string> = Object.fromEntries(
  CATEGORY_ORDER.map((c) => [c.category, c.label]),
) as Record<Category, string>;

export function getRoutineCountByCategory(category: Category): number {
  return ALL_ROUTINES.filter((r) => r.category === category).length;
}
