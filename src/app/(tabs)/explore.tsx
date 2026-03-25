import { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';
import { useTheme, decorativePalette } from '@/theme';
import { ALL_ROUTINES } from '@/content/routines';
import { ALL_EXERCISES, getExerciseById } from '@/content/exercises';
import { getRoutineIcon } from '@/content/illustrations';
import { BODY_AREAS } from '@/content/body-areas';
import type { Routine, Category, BodyArea } from '@/content/types';
import { CATEGORY_ORDER, CATEGORY_LABELS } from '@/content/categories';
import {
  useExploreFilterStore,
  type DurationRange,
  DURATION_LABELS,
  matchesDuration,
} from '@/stores/use-explore-filter-store';
import { ExploreSearchBar } from '@/components/explore/explore-search-bar';
import { CategoryTabBar } from '@/components/explore/category-tab-bar';
import { ExerciseImage } from '@/components/ui/exercise-image';
import { capitalize } from '@/lib/utils';

// ── List item types ───────────────────────────────────────────────────────────
type SectionHeader = { type: 'section-header'; key: string; label: string; count: number };
type RoutineRow = { type: 'routine'; key: string; routine: Routine; globalIndex: number; firstIcon?: string };
type ExerciseRow = { type: 'exercise'; key: string; exerciseId: string; exerciseName: string; exerciseType: string; iconFilename: string };
type ListItem = SectionHeader | RoutineRow | ExerciseRow;

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeRoutineRow(routine: Routine, gi: number): RoutineRow {
  return {
    type: 'routine',
    key: routine.id,
    routine,
    globalIndex: gi,
    firstIcon: getRoutineIcon(routine.exercises, getExerciseById, gi),
  };
}

// ── Pre-built grouped data ────────────────────────────────────────────────────
function buildGroupedData(routines: Routine[]): ListItem[] {
  const items: ListItem[] = [];
  let gi = 0;
  for (const cat of CATEGORY_ORDER) {
    const group = routines.filter((r) => r.category === cat.category);
    if (group.length === 0) continue;
    items.push({ type: 'section-header', key: `header-${cat.category}`, label: cat.label, count: group.length });
    for (const routine of group) {
      items.push(makeRoutineRow(routine, gi++));
    }
  }
  return items;
}

const ALL_GROUPED = buildGroupedData(ALL_ROUTINES);

// ── Body area helpers ─────────────────────────────────────────────────────────
const BODY_AREA_LABELS: Record<string, string> = Object.fromEntries(
  BODY_AREAS.map((ba) => [ba.area, ba.label]),
);
function getRoutinesForBodyArea(area: BodyArea): Routine[] {
  const ba = BODY_AREAS.find((b) => b.area === area);
  const ids = new Set(ba?.routineIds ?? []);
  return ALL_ROUTINES.filter((r) => ids.has(r.id) || r.bodyAreas.includes(area));
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, typography, radius, components } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedBodyArea, setSelectedBodyArea] = useState<BodyArea | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<DurationRange | null>(null);

  // ── Consume pending filters from Home ───────────────────────────────────────
  const pendingCat = useExploreFilterStore((s) => s.pendingCategory);
  const pendingBody = useExploreFilterStore((s) => s.pendingBodyArea);
  const pendingDur = useExploreFilterStore((s) => s.pendingDuration);

  useEffect(() => {
    if (pendingCat) {
      setSelectedCategory(pendingCat);
      setSelectedBodyArea(null);
      setSelectedDuration(null);
      setSearchQuery('');
      useExploreFilterStore.getState().consumePending();
    } else if (pendingBody) {
      setSelectedBodyArea(pendingBody);
      setSelectedCategory(null);
      setSelectedDuration(null);
      setSearchQuery('');
      useExploreFilterStore.getState().consumePending();
    } else if (pendingDur) {
      setSelectedDuration(pendingDur);
      setSelectedBodyArea(null);
      setSelectedCategory(null);
      setSearchQuery('');
      useExploreFilterStore.getState().consumePending();
    }
  }, [pendingCat, pendingBody, pendingDur]);

  // ── Derive list data ────────────────────────────────────────────────────────
  const listData = useMemo<ListItem[]>(() => {
    const query = searchQuery.trim().toLowerCase();

    // ── Search mode ───────────────────────────────────────────────────
    if (query) {
      const items: ListItem[] = [];
      const mRoutines = ALL_ROUTINES.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          CATEGORY_LABELS[r.category]?.toLowerCase().includes(query),
      );
      if (mRoutines.length > 0) {
        items.push({ type: 'section-header', key: 'h-routines', label: 'Routines', count: mRoutines.length });
        mRoutines.forEach((routine, i) => items.push(makeRoutineRow(routine, i)));
      }
      const mExercises = ALL_EXERCISES.filter((e) => e.name.toLowerCase().includes(query)).slice(0, 20);
      if (mExercises.length > 0) {
        items.push({ type: 'section-header', key: 'h-exercises', label: 'Exercises', count: mExercises.length });
        mExercises.forEach((ex) =>
          items.push({ type: 'exercise', key: `ex-${ex.id}`, exerciseId: ex.id, exerciseName: ex.name, exerciseType: ex.exerciseType, iconFilename: ex.iconFilename }),
        );
      }
      if (items.length === 0) {
        items.push({ type: 'section-header', key: 'h-empty', label: 'No results', count: 0 });
      }
      return items;
    }

    // ── Body area mode (standalone) ───────────────────────────────────
    if (selectedBodyArea) {
      const routines = getRoutinesForBodyArea(selectedBodyArea);
      const label = BODY_AREA_LABELS[selectedBodyArea] ?? capitalize(selectedBodyArea);
      return [
        { type: 'section-header' as const, key: `h-body-${selectedBodyArea}`, label, count: routines.length },
        ...routines.map((routine, i) => makeRoutineRow(routine, i)),
      ];
    }

    // ── Category + optional duration (combinable) ─────────────────────
    let pool = ALL_ROUTINES;
    if (selectedDuration) {
      pool = pool.filter((r) => matchesDuration(r.durationMinutes, selectedDuration));
    }

    if (selectedCategory) {
      const routines = pool.filter((r) => r.category === selectedCategory);
      const label = CATEGORY_LABELS[selectedCategory] ?? capitalize(selectedCategory);
      return [
        { type: 'section-header' as const, key: `h-${selectedCategory}`, label, count: routines.length },
        ...routines.map((routine, i) => makeRoutineRow(routine, i)),
      ];
    }

    // ── Duration only → group by category ─────────────────────────────
    if (selectedDuration) {
      return buildGroupedData(pool);
    }

    // ── All (no filter) ───────────────────────────────────────────────
    return ALL_GROUPED;
  }, [searchQuery, selectedCategory, selectedBodyArea, selectedDuration]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const goToRoutine = useCallback((id: string) => router.push(`/routine/${id}`), [router]);

  const handleCategorySelect = useCallback((cat: Category | null) => {
    setSelectedCategory(cat);
    setSelectedBodyArea(null);
    // keep duration — it's combinable with category
  }, []);

  const clearBodyArea = useCallback(() => setSelectedBodyArea(null), []);
  const clearDuration = useCallback(() => setSelectedDuration(null), []);

  // ── Active badge count (for subtitle) ───────────────────────────────────────
  const resultCount = useMemo(() => listData.filter((i) => i.type === 'routine').length, [listData]);

  // ── Render item ─────────────────────────────────────────────────────────────
  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === 'section-header') {
        return (
          <View style={styles.sectionRow}>
            <Text style={[typography.subheading, { color: colors.text }]}>{item.label}</Text>
            {item.count > 0 && (
              <Text style={[typography.tabLabel, { color: colors.textSecondary }]}>{item.count}</Text>
            )}
          </View>
        );
      }
      if (item.type === 'exercise') {
        return (
          <View style={[styles.exerciseRow, { backgroundColor: colors.surface, borderRadius: radius.xl }]}>
            <ExerciseImage iconFilename={item.iconFilename} size={40} round />
            <View style={styles.itemContent}>
              <Text style={[typography.bodyMedium, { color: colors.text }]} numberOfLines={1}>{item.exerciseName}</Text>
              <Text style={[typography.tabLabel, { color: colors.textSecondary }]}>{capitalize(item.exerciseType)}</Text>
            </View>
          </View>
        );
      }
      const { routine, globalIndex, firstIcon } = item;
      return (
        <Pressable
          onPress={() => goToRoutine(routine.id)}
          style={({ pressed }) => [
            styles.routineRow,
            { backgroundColor: colors.surface, borderRadius: radius.xl, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          {firstIcon ? (
            <ExerciseImage iconFilename={firstIcon} size={44} round />
          ) : (
            <View style={[styles.routineIndicator, { backgroundColor: decorativePalette[globalIndex % decorativePalette.length], opacity: 0.15 }]} />
          )}
          <View style={styles.itemContent}>
            <Text style={[typography.bodyMedium, { color: colors.text }]} numberOfLines={1}>{routine.name}</Text>
            <Text>
              <Text style={[typography.tabLabel, { color: colors.accent }]}>{routine.durationMinutes} MIN</Text>
              <Text style={[typography.tabLabel, { color: colors.textSecondary }]}>
                {' · '}{routine.exercises.length} exercises{' · '}{capitalize(routine.difficulty)}
              </Text>
            </Text>
          </View>
          <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <Path d="M6 4L10 8L6 12" stroke={colors.textSecondary} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>
      );
    },
    [colors, typography, radius, goToRoutine],
  );

  const keyExtractor = useCallback((item: ListItem) => item.key, []);

  // ── Filter badge component (reusable) ───────────────────────────────────────
  const FilterBadge = useCallback(
    ({ label, onClear }: { label: string; onClear: () => void }) => (
      <Pressable
        onPress={onClear}
        style={[styles.filterBadge, { backgroundColor: components.chip.activeBackgroundColor, borderRadius: components.chip.borderRadius }]}
      >
        <Text style={[typography.label, { color: components.chip.activeColor }]}>{label}</Text>
        <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
          <Path d="M4 4L10 10M10 4L4 10" stroke={components.chip.activeColor} strokeWidth={1.5} strokeLinecap="round" />
        </Svg>
      </Pressable>
    ),
    [typography, components],
  );

  // ── List header ─────────────────────────────────────────────────────────────
  const hasActiveFilter = !!(selectedBodyArea || selectedDuration || selectedCategory || searchQuery);

  const listHeader = useMemo(
    () => (
      <>
        <View style={[styles.titleRow, { paddingTop: insets.top + 16 }]}>
          <Text style={[typography.title, { color: colors.text }]}>Explore</Text>
          <Text style={[typography.tabLabel, { color: colors.textSecondary }]}>
            {hasActiveFilter ? `${resultCount} results` : `${ALL_ROUTINES.length} routines · ${ALL_EXERCISES.length} exercises`}
          </Text>
        </View>

        <View style={styles.searchSection}>
          <ExploreSearchBar value={searchQuery} onChangeText={setSearchQuery} />
        </View>

        <View style={styles.tabSection}>
          <CategoryTabBar selected={selectedCategory} onSelect={handleCategorySelect} />
        </View>

        {/* Active filter badges */}
        {(selectedBodyArea || selectedDuration) && (
          <View style={styles.badgeRow}>
            {selectedBodyArea && (
              <FilterBadge label={BODY_AREA_LABELS[selectedBodyArea] ?? capitalize(selectedBodyArea)} onClear={clearBodyArea} />
            )}
            {selectedDuration && (
              <FilterBadge label={DURATION_LABELS[selectedDuration]} onClear={clearDuration} />
            )}
          </View>
        )}
      </>
    ),
    [
      insets.top, colors, typography, searchQuery, selectedCategory,
      selectedBodyArea, selectedDuration, hasActiveFilter, resultCount,
      handleCategorySelect, clearBodyArea, clearDuration, FilterBadge,
    ],
  );

  return (
    <FlatList
      data={listData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={listHeader}
      contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 80 }]}
      style={[styles.screen, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    />
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1 },
  titleRow: { paddingHorizontal: 24, gap: 2 },
  searchSection: { paddingTop: 16, paddingHorizontal: 24 },
  tabSection: { paddingTop: 12, paddingBottom: 4 },
  badgeRow: { flexDirection: 'row', paddingHorizontal: 24, paddingBottom: 4, gap: 8 },
  filterBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 14 },
  listContent: { gap: 8 },
  sectionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 4,
  },
  routineRow: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 24,
    paddingHorizontal: 16, paddingVertical: 14, gap: 14,
  },
  routineIndicator: { width: 44, height: 44, borderRadius: 22 },
  itemContent: { flex: 1, gap: 3 },
  exerciseRow: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 24,
    paddingHorizontal: 16, paddingVertical: 12, gap: 14,
  },
  exerciseDot: { width: 36, height: 36, borderRadius: 18 },
});
