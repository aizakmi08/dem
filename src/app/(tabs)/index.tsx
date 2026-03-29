import { useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path, Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme';
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
import { useProgressData } from '@/hooks/use-progress-data';
import { useRecommendedRoutines } from '@/hooks/use-recommended-routines';
import { useSubscriptionStore } from '@/stores/use-subscription-store';
import { StreakBadge } from '@/components/home/streak-badge';
import { DailyRoutineCard } from '@/components/home/daily-routine-card';
import { CategoryCard } from '@/components/home/category-card';
import { BodyAreaCard } from '@/components/home/body-area-card';
import { capitalize } from '@/lib/utils';

// ── Static data ───────────────────────────────────────────────────────────────
function formatDate() {
  const now = new Date();
  const month = now.toLocaleDateString('en-US', { month: 'long' });
  const day = now.getDate();
  return `${month} ${day}`;
}

const DURATION_OPTIONS: DurationRange[] = ['under-5', '5-10', '10-20', '20-plus'];

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, typography, components, radius, spacing } = useTheme();
  const { currentStreak } = useProgressData();
  const recommendedRoutines = useRecommendedRoutines();
  const isPremium = useSubscriptionStore((s) => s.isPremium);

  const dateLabel = formatDate();
  const greeting = getTimeGreeting();

  const hero = recommendedRoutines[0];
  const quickCards = recommendedRoutines.slice(1, 3);

  const goToRoutine = useCallback(
    (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push(`/routine/${id}`);
    },
    [router],
  );
  const goToCategory = useCallback(
    (category: Category) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      useExploreFilterStore.getState().setPendingCategory(category);
      router.navigate('/(tabs)/explore');
    },
    [router],
  );
  const goToBodyArea = useCallback(
    (area: BodyArea) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      useExploreFilterStore.getState().setPendingBodyArea(area);
      router.navigate('/(tabs)/explore');
    },
    [router],
  );
  const goToDuration = useCallback(
    (dur: DurationRange) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View>
          <Text style={[typography.overline, { color: colors.textSecondary }]}>
            {dateLabel.toUpperCase()}
          </Text>
          <Text style={[typography.displaySmall, { color: colors.text }]}>{greeting}</Text>
        </View>
        <View style={styles.headerRight}>
          <StreakBadge count={currentStreak} />
          <Pressable
            onPress={() => router.push('/profile/edit')}
            style={[styles.avatar, { backgroundColor: colors.primary }]}
          >
            <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
              <Circle cx="9" cy="7" r="3" stroke="white" strokeWidth={1.5} />
              <Path
                d="M3 16.5C3 13.5 5.5 12 9 12C12.5 12 15 13.5 15 16.5"
                stroke="white"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            </Svg>
          </Pressable>
        </View>
      </View>

      {/* ── Premium Banner ──────────────────────────────────────────── */}
      {!isPremium && (
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/paywall');
          }}
          style={({ pressed }) => [
            styles.premiumBanner,
            { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
            <Path
              d="M10 1l2.5 5 5.5.8-4 3.9.9 5.5L10 13.7l-4.9 2.5.9-5.5-4-3.9 5.5-.8z"
              fill="rgba(255,255,255,0.9)"
            />
          </Svg>
          <View style={{ flex: 1 }}>
            <Text style={styles.premiumTitle}>Unlock Full Access</Text>
            <Text style={styles.premiumSub}>All routines, plans & tracking</Text>
          </View>
          <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <Path d="M6 3l5 5-5 5" stroke="rgba(255,255,255,0.5)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>
      )}

      {/* ── 1. Recommended — Hero Card ─────────────────────────────────── */}
      <View style={[styles.section, { paddingTop: spacing.xl }]}>
        <Text style={[typography.subheading, { color: colors.text }]}>Recommended for you</Text>

        {hero && (
          <Pressable
            onPress={() => goToRoutine(hero.id)}
            style={({ pressed }) => [
              styles.heroCard,
              { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <View style={styles.heroBlob} />
            <View style={styles.heroTop}>
              <View style={styles.heroIcon}>
                <ExerciseImage
                  iconFilename={getRoutineIcon(hero.exercises, getExerciseById, 0) ?? ''}
                  size={40}
                  round
                />
              </View>
              <View style={styles.heroMeta}>
                <Text style={styles.heroOverline}>
                  {hero.durationMinutes} MIN · {capitalize(hero.category).toUpperCase()}
                </Text>
                <Text style={styles.heroTitle}>{hero.name}</Text>
              </View>
            </View>
            <Text style={styles.heroDesc} numberOfLines={2}>
              {hero.description}
            </Text>
            <View style={styles.heroCta}>
              <Text style={styles.heroCtaText}>Start Now</Text>
            </View>
          </Pressable>
        )}

        {/* Quick cards */}
        <View style={styles.quickRow}>
          {quickCards.map((r, i) => (
            <Pressable
              key={r.id}
              onPress={() => goToRoutine(r.id)}
              style={({ pressed }) => [
                styles.quickCard,
                {
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <View style={styles.quickTop}>
                <ExerciseImage
                  iconFilename={getRoutineIcon(r.exercises, getExerciseById, i + 1) ?? ''}
                  size={34}
                  round
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.quickName, { color: colors.text }]}>{r.name}</Text>
                  <Text style={[styles.quickSub, { color: colors.textSecondary }]}>
                    {r.durationMinutes} min · {capitalize(r.category)}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── 2. How much time do you have? ──────────────────────────────── */}
      <View style={[styles.section, { paddingTop: spacing['2xl'] }]}>
        <Text style={[typography.subheading, { color: colors.text }]}>
          How much time do you have?
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {DURATION_OPTIONS.map((dur) => (
            <Pressable
              key={dur}
              onPress={() => goToDuration(dur)}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text style={[styles.chipText, { color: colors.text }]}>{DURATION_LABELS[dur]}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* ── 3. Browse by Body Area ────────────────────────────────────── */}
      <View style={[styles.section, { paddingTop: spacing['2xl'] }]}>
        <Text style={[typography.subheading, { color: colors.text }]}>Browse by Body Area</Text>
        <View style={styles.areaGrid}>
          {BODY_AREAS.slice(0, 6).map((ba) => (
            <BodyAreaCard key={ba.area} area={ba.area} onPress={() => goToBodyArea(ba.area)} />
          ))}
        </View>
      </View>

      {/* ── 4. Series & Progressions ───────────────────────────────────── */}
      <View style={[styles.section, { paddingTop: spacing['2xl'] }]}>
        <Text style={[typography.subheading, { color: colors.text }]}>Series & Progressions</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {ALL_SERIES.map((series) => {
          const routines = getSeriesRoutines(series);
          const durationRange = getSeriesDurationRange(series);
          const levelIcons = routines
            .map((r, i) => getRoutineIcon(r.exercises, getExerciseById, i + 1))
            .filter(Boolean) as string[];
          return (
            <Pressable
              key={series.id}
              onPress={() => goToRoutine(series.routineIds[0])}
              style={({ pressed }) => [
                styles.seriesCard,
                {
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: radius.xl,
                  opacity: pressed ? 0.8 : 1,
                },
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

      {/* ── 5. All Categories ─────────────────────────────────────────── */}
      <View style={[styles.section, { paddingTop: spacing['2xl'] }]}>
        <Text style={[typography.subheading, { color: colors.text }]}>All Categories</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {CATEGORY_ORDER.map((cat, i) => (
          <CategoryCard
            key={cat.category}
            category={cat.category}
            index={i}
            onPress={() => goToCategory(cat.category)}
          />
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
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 24,
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
  },
  premiumTitle: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  premiumSub: {
    fontSize: 11,
    fontFamily: 'Nunito_600SemiBold',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 14,
  },
  section: { paddingHorizontal: 24, gap: 10 },

  // Hero card
  heroCard: {
    borderRadius: 20,
    padding: 18,
    gap: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  heroBlob: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroMeta: { flex: 1, gap: 2 },
  heroOverline: {
    fontSize: 10,
    fontFamily: 'Nunito_700Bold',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 14,
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  heroDesc: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 18,
  },
  heroCta: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  heroCtaText: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
    lineHeight: 16,
  },

  // Quick cards
  quickRow: { flexDirection: 'row', gap: 10 },
  quickCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
  },
  quickTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  quickName: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    lineHeight: 16,
  },
  quickSub: {
    fontSize: 10,
    fontFamily: 'Nunito_600SemiBold',
    lineHeight: 14,
  },

  // Duration chips
  chipRow: { gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 9999 },
  chipText: { fontSize: 13, fontFamily: 'Nunito_700Bold', lineHeight: 16 },

  // Body area grid
  areaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },

  // Series & categories
  horizontalScroll: { paddingHorizontal: 24, paddingTop: 10, gap: 12 },
  seriesCard: { width: 180, padding: 16, gap: 6 },
  seriesIconRow: { flexDirection: 'row', gap: 4, marginBottom: 2 },
});
