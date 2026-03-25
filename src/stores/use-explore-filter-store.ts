import { create } from 'zustand';
import type { Category, BodyArea } from '@/content/types';

export type DurationRange = 'under-5' | '5-10' | '10-20' | '20-plus';

export const DURATION_LABELS: Record<DurationRange, string> = {
  'under-5': 'Under 5 min',
  '5-10': '5–10 min',
  '10-20': '10–20 min',
  '20-plus': '20+ min',
};

export function matchesDuration(minutes: number, range: DurationRange): boolean {
  switch (range) {
    case 'under-5':
      return minutes <= 5;
    case '5-10':
      return minutes > 5 && minutes <= 10;
    case '10-20':
      return minutes > 10 && minutes <= 20;
    case '20-plus':
      return minutes > 20;
  }
}

interface ExploreFilterState {
  pendingCategory: Category | null;
  pendingBodyArea: BodyArea | null;
  pendingDuration: DurationRange | null;

  setPendingCategory: (cat: Category) => void;
  setPendingBodyArea: (area: BodyArea) => void;
  setPendingDuration: (dur: DurationRange) => void;
  consumePending: () => {
    category: Category | null;
    bodyArea: BodyArea | null;
    duration: DurationRange | null;
  };
}

export const useExploreFilterStore = create<ExploreFilterState>()((set, get) => ({
  pendingCategory: null,
  pendingBodyArea: null,
  pendingDuration: null,

  setPendingCategory: (cat) =>
    set({ pendingCategory: cat, pendingBodyArea: null, pendingDuration: null }),

  setPendingBodyArea: (area) =>
    set({ pendingBodyArea: area, pendingCategory: null, pendingDuration: null }),

  setPendingDuration: (dur) =>
    set({ pendingDuration: dur, pendingBodyArea: null, pendingCategory: null }),

  consumePending: () => {
    const { pendingCategory, pendingBodyArea, pendingDuration } = get();
    set({ pendingCategory: null, pendingBodyArea: null, pendingDuration: null });
    return { category: pendingCategory, bodyArea: pendingBodyArea, duration: pendingDuration };
  },
}));
