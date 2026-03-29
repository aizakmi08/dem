import { useMemo } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { ALL_ROUTINES } from '@/content/routines';
import type { Routine, Category, BodyArea } from '@/content/types';

// ── Goal-to-routine mapping ─────────────────────────────────────────────────

type GoalKey =
  | 'flexibility'
  | 'health'
  | 'pain'
  | 'stress'
  | 'athletic'
  | 'circulation'
  | 'recovery'
  | 'posture';

interface GoalMapping {
  categories: Category[];
  bodyAreas: BodyArea[];
  tagKeywords: string[];
}

const GOAL_MAP: Record<GoalKey, GoalMapping> = {
  flexibility: {
    categories: ['splits', 'targeted'],
    bodyAreas: ['hips', 'hamstrings'],
    tagKeywords: [],
  },
  health: {
    categories: ['energize', 'beginner-series'],
    bodyAreas: [],
    tagKeywords: [],
  },
  pain: {
    categories: ['targeted'],
    bodyAreas: ['lower-back', 'neck'],
    tagKeywords: [],
  },
  stress: {
    categories: ['relax-unwind'],
    bodyAreas: [],
    tagKeywords: ['restorative'],
  },
  athletic: {
    categories: ['pre-post-workout', 'running', 'strength'],
    bodyAreas: [],
    tagKeywords: [],
  },
  circulation: {
    categories: ['energize'],
    bodyAreas: [],
    tagKeywords: ['dynamic'],
  },
  recovery: {
    categories: ['relax-unwind'],
    bodyAreas: [],
    tagKeywords: ['recovery', 'restorative'],
  },
  posture: {
    categories: ['posture', 'at-the-office'],
    bodyAreas: ['posture'],
    tagKeywords: [],
  },
};

// ── Stretch time preferences ────────────────────────────────────────────────

interface TimePreference {
  categories: Category[];
  maxDuration?: number;
}

const TIME_PREF_MAP: Record<string, TimePreference> = {
  after_waking: { categories: ['energize', 'posture'] },
  after_coffee: { categories: ['energize', 'posture'] },
  after_exercise: { categories: ['pre-post-workout', 'relax-unwind'] },
  work_break: { categories: ['at-the-office', 'posture'], maxDuration: 10 },
  before_bed: { categories: ['relax-unwind'] },
};

// ── Difficulty filtering ────────────────────────────────────────────────────

const ALLOWED_DIFFICULTIES: Record<string, string[]> = {
  beginner: ['beginner', 'intermediate'],
  intermediate: ['beginner', 'intermediate', 'expert'],
  expert: ['beginner', 'intermediate', 'expert'],
};

// ── Time-of-day fallback (original logic) ───────────────────────────────────

function getTimeOfDayRoutines(): Routine[] {
  const hour = new Date().getHours();
  let categories: Category[];
  if (hour < 12) {
    categories = ['energize', 'posture', 'beginner-series', 'pre-post-workout'];
  } else if (hour < 17) {
    categories = ['at-the-office', 'posture', 'planks', 'body-part'];
  } else {
    categories = ['relax-unwind', 'targeted', 'body-part', 'splits'];
  }
  const picked: Routine[] = [];
  for (const cat of categories) {
    const routines = ALL_ROUTINES.filter((r) => r.category === cat);
    if (routines.length > 0 && !picked.find((p) => p.id === routines[0].id)) {
      picked.push(routines[0]);
    }
    if (routines.length > 1 && !picked.find((p) => p.id === routines[1].id)) {
      picked.push(routines[1]);
    }
  }
  return picked.slice(0, 6);
}

// ── Scoring ─────────────────────────────────────────────────────────────────

function scoreRoutine(
  routine: Routine,
  goalCategories: Set<Category>,
  goalBodyAreas: Set<BodyArea>,
  goalTagKeywords: Set<string>,
  experienceLevel: string,
  timePref: TimePreference | null,
): number {
  let score = 0;

  // Goal category match (+3 per match)
  if (goalCategories.has(routine.category)) {
    score += 3;
  }

  // Goal body area match (+2 per matching area)
  for (const area of routine.bodyAreas) {
    if (goalBodyAreas.has(area)) {
      score += 2;
    }
  }

  // Goal tag keyword match (+1 per matching tag)
  for (const tag of routine.tags) {
    const lower = tag.toLowerCase();
    for (const keyword of goalTagKeywords) {
      if (lower.includes(keyword)) {
        score += 1;
        break;
      }
    }
  }

  // Difficulty match: exact match gets +2, adjacent gets +1
  if (routine.difficulty === experienceLevel) {
    score += 2;
  }

  // Time preference match (+2 for category, penalty if too long)
  if (timePref) {
    if (timePref.categories.includes(routine.category)) {
      score += 2;
    }
    if (timePref.maxDuration && routine.durationMinutes > timePref.maxDuration) {
      score -= 2;
    }
  }

  return score;
}

// ── Hook ────────────────────────────────────────────────────────────────────

const RESULT_COUNT = 6;

export function useRecommendedRoutines(): Routine[] {
  const { profile, isLoading } = useProfile();

  return useMemo(() => {
    // Fallback: no profile data available
    if (!profile || isLoading) {
      return getTimeOfDayRoutines();
    }

    const experienceLevel = profile.experienceLevel ?? 'beginner';
    const goals: string[] = Array.isArray(profile.goals) ? profile.goals : [];
    const stretchTime: string | null = profile.preferredStretchTime ?? null;

    // If no meaningful profile data, fall back to time-of-day
    if (goals.length === 0 && !stretchTime) {
      return getTimeOfDayRoutines();
    }

    // Build aggregated sets from all user goals
    const goalCategories = new Set<Category>();
    const goalBodyAreas = new Set<BodyArea>();
    const goalTagKeywords = new Set<string>();

    for (const goal of goals) {
      const mapping = GOAL_MAP[goal as GoalKey];
      if (mapping) {
        for (const cat of mapping.categories) goalCategories.add(cat);
        for (const area of mapping.bodyAreas) goalBodyAreas.add(area);
        for (const kw of mapping.tagKeywords) goalTagKeywords.add(kw);
      }
    }

    // Resolve time preference
    const timePref = stretchTime ? (TIME_PREF_MAP[stretchTime] ?? null) : null;

    // Filter by difficulty ceiling
    const allowed = ALLOWED_DIFFICULTIES[experienceLevel] ?? [
      'beginner',
      'intermediate',
      'expert',
    ];
    const eligible = ALL_ROUTINES.filter((r) => allowed.includes(r.difficulty));

    // Score and sort
    const scored = eligible.map((routine) => ({
      routine,
      score: scoreRoutine(
        routine,
        goalCategories,
        goalBodyAreas,
        goalTagKeywords,
        experienceLevel,
        timePref,
      ),
    }));

    scored.sort((a, b) => b.score - a.score);

    // Deduplicate by category to give variety (take at most 2 per category)
    const categoryCounts = new Map<Category, number>();
    const result: Routine[] = [];

    for (const { routine } of scored) {
      if (result.length >= RESULT_COUNT) break;
      const count = categoryCounts.get(routine.category) ?? 0;
      if (count < 2) {
        result.push(routine);
        categoryCounts.set(routine.category, count + 1);
      }
    }

    // If we don't have enough (unlikely), fill from remaining scored routines
    if (result.length < RESULT_COUNT) {
      for (const { routine } of scored) {
        if (result.length >= RESULT_COUNT) break;
        if (!result.find((r) => r.id === routine.id)) {
          result.push(routine);
        }
      }
    }

    return result.length > 0 ? result : getTimeOfDayRoutines();
  }, [profile, isLoading]);
}
