import { useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path, Circle } from 'react-native-svg';
import { useTheme } from '@/theme';
import { ALL_ROUTINES } from '@/content/routines';
import { getExerciseById } from '@/content/exercises';
import { CATEGORY_ORDER } from '@/content/categories';
import { BODY_AREAS } from '@/content/body-areas';
import { ALL_SERIES, getSeriesRoutines, getSeriesDurationRange } from '@/content/series';
import { getRoutineIcon } from '@/content/illustrations';
import { ExerciseImage } from '@/components/ui/exercise-image';
import type { Category, BodyArea } from '@/content/types';
import {
  useExploreFilterStore,
  type DurationRange,
  DURATION_LABELS,
} from '@/stores/use-explore-filter-store';
import { StreakBadge } from '@/components/home/streak-badge';
import { DailyRoutineCard } from '@/components/home/daily-routine-card';
import { CategoryCard } from '@/components/home/category-card';
import { BodyAreaCard } from '@/components/home/body-area-card';

// ── Static data ───────────────────────────────────────────────────────────────
function getRecommendedRoutines() {
  const hour = new Date().getHours();
  // Pick categories relevant to the time of day, then grab top routines
  let categories: Category[];
  if (hour < 12) {
    categories = ['energize', 'posture', 'beginner-series', 'pre-post-workout'];
  } else if (hour < 17) {
    categories = ['at-the-office', 'posture', 'planks', 'body-part'];
  } else {
    categories = ['relax-unwind', 'targeted', 'body-part', 'splits'];
  }
  const picked: typeof ALL_ROUTINES = [];
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

function formatDate() {
  const now = new Date();
  const month = now.toLocaleDateString('en-US', { month: 'long' });
  const day = now.getDate();
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
  return { dateLabel: `${month} ${day}`, weekday };
}

const POPULAR_IDS = ['wake-and-shake-1', 'tech-neck', 'sleep', 'warm-up', 'posture-reset', 'desk-stretch'];
const popularRoutines = POPULAR_IDS
  .map((id) => ALL_ROUTINES.find((r) => r.id === id))
  .filter(Boolean) as typeof ALL_ROUTINES;

const DURATION_OPTIONS: DurationRange[] = ['under-5', '5-10', '10-20', '20-plus'];

const recommendedRoutines = getRecommendedRoutines();
const { dateLabel } = formatDate();

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
const greeting = getTimeGreeting();

// ── Component ─────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, typography, components, radius } = useTheme();

  const goToRoutine = useCallback(
    (id: string) => router.push(`/routine/${id}`),
    [router],
  );
  const goToCategory = useCallback(
    (category: Category) => {
      useExploreFilterStore.getState().setPendingCategory(category);
      router.navigate('/(tabs)/explore');
    },
    [router],
  );
  const goToBodyArea = useCallback(
    (area: BodyArea) => {
      useExploreFilterStore.getState().setPendingBodyArea(area);
      router.navigate('/(tabs)/explore');
    },
    [router],
  );
  const goToDuration = useCallback(
    (dur: DurationRange) => {
      useExploreFilterStore.getState().setPendingDuration(dur);
      router.navigate('/(tabs)/explore');
    },
    [router],
  );

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="never"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: 12 }]}>
        <View>
          <Text style={[typography.overline, { color: colors.textSecondary }]}>{dateLabel}</Text>
          <Text style={[typography.displaySmall, { color: colors.text }]}>{greeting}</Text>
        </View>
        <View style={styles.headerRight}>
          <StreakBadge count={7} />
          <View style={[styles.avatar, { backgroundColor: colors.border }]}>
            <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
              <Circle cx="9" cy="7" r="3" stroke={colors.textSecondary} strokeWidth={1.5} />
              <Path d="M3 16.5C3 13.5 5.5 12 9 12C12.5 12 15 13.5 15 16.5" stroke={colors.textSecondary} strokeWidth={1.5} strokeLinecap="round" />
            </Svg>
          </View>
        </View>
      </View>

      {/* ── 1. Recommended for you (time-aware, multiple) ──────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={[typography.subheading, { color: colors.text }]}>Recommended for you</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
        {recommendedRoutines.map((r, i) => (
          <DailyRoutineCard key={r.id} routine={r} index={i} onPress={() => goToRoutine(r.id)} />
        ))}
      </ScrollView>

      {/* ── 2. How much time do you have? ──────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={[typography.subheading, { color: colors.text }]}>How much time do you have?</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
        {DURATION_OPTIONS.map((dur) => (
          <Pressable
            key={dur}
            onPress={() => goToDuration(dur)}
            style={({ pressed }) => [
              styles.durationChip,
              {
                backgroundColor: colors.surface,
                borderRadius: components.chip.borderRadius,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text style={[typography.bodyMedium, { color: colors.text }]}>
              {DURATION_LABELS[dur]}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* ── 3. Series & Progressions ───────────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={[typography.subheading, { color: colors.text }]}>Series & Progressions</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
        {ALL_SERIES.map((series) => {
          const routines = getSeriesRoutines(series);
          const durationRange = getSeriesDurationRange(series);
          // Pick a unique icon per level from the middle of each routine
          const levelIcons = routines
            .map((r, i) => getRoutineIcon(r.exercises, getExerciseById, i + 1))
            .filter(Boolean) as string[];
          return (
            <Pressable
              key={series.id}
              onPress={() => goToRoutine(series.routineIds[0])}
              style={({ pressed }) => [
                styles.seriesCard,
                { backgroundColor: colors.surface, borderRadius: radius.xl, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <View style={styles.seriesIconRow}>
                {levelIcons.slice(0, 5).map((icon, i) => (
                  <ExerciseImage key={`${series.id}-${i}`} iconFilename={icon} size={28} round />
                ))}
              </View>
              <Text style={[typography.bodyMedium, { color: colors.text }]} numberOfLines={1}>
                {series.name}
              </Text>
              <Text style={[typography.tabLabel, { color: colors.accent }]}>
                {routines.length} levels · {durationRange}
              </Text>
              <Text style={[typography.tabLabel, { color: colors.textSecondary }]} numberOfLines={2}>
                {series.description}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ── 4. Popular Routines ────────────────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={[typography.subheading, { color: colors.text }]}>Popular</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
        {popularRoutines.map((r, i) => (
          <DailyRoutineCard key={r.id} routine={r} index={i + 3} onPress={() => goToRoutine(r.id)} />
        ))}
      </ScrollView>

      {/* ── 5. Browse by Body Area ────────────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={[typography.subheading, { color: colors.text }]}>Browse by Body Area</Text>
      </View>
      <View style={styles.areaGrid}>
        {BODY_AREAS.map((ba) => (
          <BodyAreaCard key={ba.area} area={ba.area} onPress={() => goToBodyArea(ba.area)} />
        ))}
      </View>

      {/* ── 6. All Categories ─────────────────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={[typography.subheading, { color: colors.text }]}>All Categories</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
        {CATEGORY_ORDER.map((cat, i) => (
          <CategoryCard key={cat.category} category={cat.category} index={i} onPress={() => goToCategory(cat.category)} />
        ))}
      </ScrollView>
    </ScrollView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  sectionHeader: { paddingTop: 28, paddingBottom: 2, paddingHorizontal: 24 },
  chipScroll: { paddingHorizontal: 24, paddingTop: 12, gap: 10 },
  durationChip: { paddingVertical: 12, paddingHorizontal: 20 },
  horizontalScroll: { paddingHorizontal: 24, paddingTop: 12, gap: 12 },
  seriesCard: { width: 180, padding: 16, gap: 6 },
  seriesIconRow: { flexDirection: 'row', gap: 4, marginBottom: 2 },
  areaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 12,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    rowGap: 10,
  },
});
