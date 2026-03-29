import { useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path, Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme';
import { getExerciseById } from '@/content/exercises';
import { CATEGORY_LABELS } from '@/content/categories';
import type { Routine } from '@/content/types';
import { capitalize } from '@/lib/utils';
import { usePlayerStore } from '@/stores/use-player-store';
import { useFavorites } from '@/hooks/use-favorites';
import { ExerciseImage } from '@/components/ui/exercise-image';
import { RoutineDetailHeader } from './routine-detail-header';
import { ExerciseInfoModal } from './exercise-info-modal';

const HOLD_STEP = 5;
const HOLD_MIN = 5;
const HOLD_MAX = 300;

interface RoutineDetailScreenProps {
  routine: Routine;
}

interface ExerciseItem {
  key: string;
  exerciseId: string;
  name: string;
  iconFilename?: string;
  holdSeconds: number;
  sides: 'none' | 'both';
  order: number;
}

export function RoutineDetailScreen({ routine }: RoutineDetailScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, typography, radius, spacing } = useTheme();

  const [holdTimes, setHoldTimes] = useState<Record<string, number>>(() =>
    Object.fromEntries(routine.exercises.map((e) => [e.exerciseId, e.holdSeconds])),
  );

  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  const selectedExercise = useMemo(
    () => (selectedExerciseId ? getExerciseById(selectedExerciseId) ?? null : null),
    [selectedExerciseId],
  );

  const exerciseItems = useMemo<ExerciseItem[]>(
    () =>
      [...routine.exercises]
        .sort((a, b) => a.order - b.order)
        .map((re) => {
          const ex = getExerciseById(re.exerciseId);
          return {
            key: `${re.exerciseId}-${re.order}`,
            exerciseId: re.exerciseId,
            name: ex?.name ?? re.exerciseId,
            iconFilename: ex?.iconFilename,
            holdSeconds: re.holdSeconds,
            sides: re.sides,
            order: re.order,
          };
        }),
    [routine.exercises],
  );

  const handleClose = useCallback(() => router.back(), [router]);
  const handleToggleFavorite = useCallback(
    () => toggleFavorite(routine.id),
    [toggleFavorite, routine.id],
  );
  const handleModalClose = useCallback(() => setSelectedExerciseId(null), []);

  const handleStart = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    usePlayerStore.getState().initSession(routine.id, holdTimes, routine.exercises);
    router.push(`/player/${routine.id}`);
  }, [routine, holdTimes, router]);

  const catLabel = CATEGORY_LABELS[routine.category] ?? capitalize(routine.category);

  const handleDecrease = useCallback((exerciseId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHoldTimes((prev) => ({
      ...prev,
      [exerciseId]: Math.max(HOLD_MIN, prev[exerciseId] - HOLD_STEP),
    }));
  }, []);

  const handleIncrease = useCallback((exerciseId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHoldTimes((prev) => ({
      ...prev,
      [exerciseId]: Math.min(HOLD_MAX, prev[exerciseId] + HOLD_STEP),
    }));
  }, []);

  const formatTime = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : `${s}s`);

  const keyExtractor = useCallback((item: ExerciseItem) => item.key, []);

  const renderExercise = useCallback(
    ({ item, index }: { item: ExerciseItem; index: number }) => {
      const sideLabel = item.sides === 'both' ? ' · Both sides' : '';
      const currentHold = holdTimes[item.exerciseId] ?? item.holdSeconds;
      return (
        <View style={[styles.exerciseRow, { borderBottomColor: colors.border }]}>
          <Pressable
            onPress={() => setSelectedExerciseId(item.exerciseId)}
            style={({ pressed }) => [styles.exerciseLeft, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={[styles.exerciseNumber, { backgroundColor: colors.surface }]}>
              <Text style={[styles.exerciseNumberText, { color: colors.textSecondary }]}>
                {index + 1}
              </Text>
            </View>
            {item.iconFilename ? (
              <ExerciseImage iconFilename={item.iconFilename} size={40} round />
            ) : (
              <View style={[styles.exercisePlaceholder, { backgroundColor: colors.surface }]} />
            )}
            <View style={styles.exerciseInfo}>
              <Text style={[styles.exerciseName, { color: colors.text }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.exerciseMeta, { color: colors.textSecondary }]}>
                {formatTime(currentHold)}{sideLabel}
              </Text>
            </View>
          </Pressable>
          <View style={styles.stepper}>
            <Pressable
              onPress={() => handleDecrease(item.exerciseId)}
              hitSlop={10}
              style={({ pressed }) => [
                styles.stepperBtn,
                { backgroundColor: colors.surface, opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Text style={[styles.stepperText, { color: colors.text }]}>−</Text>
            </Pressable>
            <Text style={[styles.stepperValue, { color: colors.text }]}>
              {formatTime(currentHold)}
            </Text>
            <Pressable
              onPress={() => handleIncrease(item.exerciseId)}
              hitSlop={10}
              style={({ pressed }) => [
                styles.stepperBtn,
                { backgroundColor: colors.surface, opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Text style={[styles.stepperText, { color: colors.text }]}>+</Text>
            </Pressable>
          </View>
        </View>
      );
    },
    [colors, holdTimes, handleDecrease, handleIncrease],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.heroSection}>
        {/* Category + Difficulty badges */}
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: `${colors.primary}18` }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>{catLabel}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: `${colors.accent}18` }]}>
            <Text style={[styles.badgeText, { color: colors.accent }]}>
              {capitalize(routine.difficulty)}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.routineTitle, { color: colors.text }]}>{routine.name}</Text>

        {/* Description */}
        <Text style={[styles.routineDesc, { color: colors.textSecondary }]}>
          {routine.description}
        </Text>

        {/* Meta row */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <Circle cx={8} cy={8} r={6} stroke={colors.textSecondary} strokeWidth={1.3} />
              <Path
                d="M8 5v3l2 2"
                stroke={colors.textSecondary}
                strokeWidth={1.3}
                strokeLinecap="round"
              />
            </Svg>
            <Text style={[styles.metaText, { color: colors.text }]}>
              {routine.durationMinutes} min
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <Path
                d="M4 12l3-3 3 3 3-4"
                stroke={colors.textSecondary}
                strokeWidth={1.3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={[styles.metaText, { color: colors.text }]}>
              {routine.exercises.length} exercises
            </Text>
          </View>
        </View>

        {/* Exercises label */}
        <Text
          style={[
            styles.exercisesLabel,
            { color: colors.text, borderBottomColor: colors.border },
          ]}
        >
          Exercises
        </Text>
      </View>
    ),
    [routine, colors, catLabel],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <RoutineDetailHeader
        title={routine.name}
        onClose={handleClose}
        isFavorite={isFavorite(routine.id)}
        onToggleFavorite={handleToggleFavorite}
      />

      <FlatList
        data={exerciseItems}
        renderItem={renderExercise}
        keyExtractor={keyExtractor}
        ListHeaderComponent={listHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />

      <View
        style={[
          styles.bottomActions,
          { backgroundColor: colors.background, paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <Pressable
          onPress={handleStart}
          style={({ pressed }) => [
            styles.startButton,
            {
              backgroundColor: colors.primary,
              borderRadius: radius.xl,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={[typography.button, { color: colors.white }]}>START ROUTINE</Text>
        </Pressable>
      </View>

      <ExerciseInfoModal
        exercise={selectedExercise}
        visible={selectedExercise !== null}
        onClose={handleModalClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  heroSection: { gap: 8, paddingTop: 12 },
  badgeRow: { flexDirection: 'row', gap: 8 },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 9999 },
  badgeText: { fontSize: 11, fontFamily: 'Nunito_700Bold', lineHeight: 14 },
  routineTitle: {
    fontSize: 26,
    fontFamily: 'Nunito_800ExtraBold',
    lineHeight: 32,
    paddingTop: 4,
  },
  routineDesc: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  metaRow: { flexDirection: 'row', gap: 16, paddingTop: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 13, fontFamily: 'Nunito_600SemiBold', lineHeight: 16 },
  exercisesLabel: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
    lineHeight: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  exerciseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  exerciseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseNumberText: {
    fontSize: 12,
    fontFamily: 'Nunito_800ExtraBold',
    lineHeight: 14,
  },
  exercisePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  exerciseInfo: { flex: 1, gap: 1 },
  exerciseName: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    lineHeight: 18,
  },
  exerciseMeta: {
    fontSize: 11,
    fontFamily: 'Nunito_600SemiBold',
    lineHeight: 14,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 8,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    lineHeight: 20,
  },
  stepperValue: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    lineHeight: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 24, paddingBottom: 16 },
  bottomActions: { paddingHorizontal: 24, paddingTop: 12 },
  startButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
