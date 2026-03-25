import { useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, Pressable, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';
import { useTheme } from '@/theme';
import { getExerciseById } from '@/content/exercises';
import type { Routine } from '@/content/types';
import { capitalize } from '@/lib/utils';
import { usePlayerStore } from '@/stores/use-player-store';
import { RoutineDetailHeader } from './routine-detail-header';
import { ExerciseRow } from './exercise-row';
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
}

export function RoutineDetailScreen({ routine }: RoutineDetailScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, typography, components } = useTheme();

  const [holdTimes, setHoldTimes] = useState<Record<string, number>>(() =>
    Object.fromEntries(routine.exercises.map((e) => [e.exerciseId, e.holdSeconds]))
  );

  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  const selectedExercise = useMemo(
    () => (selectedExerciseId ? getExerciseById(selectedExerciseId) ?? null : null),
    [selectedExerciseId]
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
          };
        }),
    [routine.exercises]
  );

  const handleClose = useCallback(() => router.back(), [router]);

  const handleMenu = useCallback(() => {
    Alert.alert('Menu', 'Options coming soon');
  }, []);

  const handleExercisePress = useCallback((exerciseId: string) => {
    setSelectedExerciseId(exerciseId);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedExerciseId(null);
  }, []);

  const handleDecrease = useCallback((exerciseId: string) => {
    setHoldTimes((prev) => ({
      ...prev,
      [exerciseId]: Math.max(HOLD_MIN, prev[exerciseId] - HOLD_STEP),
    }));
  }, []);

  const handleIncrease = useCallback((exerciseId: string) => {
    setHoldTimes((prev) => ({
      ...prev,
      [exerciseId]: Math.min(HOLD_MAX, prev[exerciseId] + HOLD_STEP),
    }));
  }, []);

  const handleStart = useCallback(() => {
    usePlayerStore.getState().initSession(routine.id, holdTimes, routine.exercises);
    router.push(`/player/${routine.id}`);
  }, [routine, holdTimes, router]);

  const handleShare = useCallback(() => {
    Alert.alert('Coming soon', 'Sharing is not yet implemented');
  }, []);

  const keyExtractor = useCallback((item: ExerciseItem) => item.key, []);

  const renderExercise = useCallback(
    ({ item, index }: { item: ExerciseItem; index: number }) => (
      <ExerciseRow
        exerciseId={item.exerciseId}
        exerciseName={item.name}
        holdSeconds={holdTimes[item.exerciseId] ?? 30}
        colorIndex={index}
        iconFilename={item.iconFilename}
        onPress={handleExercisePress}
        onDecrease={handleDecrease}
        onIncrease={handleIncrease}
      />
    ),
    [holdTimes, handleExercisePress, handleDecrease, handleIncrease]
  );

  const listHeader = useMemo(
    () => (
      <>
        <View style={styles.metaRow}>
          <View style={styles.metaLeft}>
            <Text style={[typography.overline, { color: colors.accent }]}>
              {routine.durationMinutes} Minutes
            </Text>
            <Text style={[typography.label, { color: colors.textSecondary }]}> · </Text>
            <Text style={[typography.label, { color: colors.textSecondary }]}>
              {capitalize(routine.difficulty)}
            </Text>
          </View>
          <Pressable
            hitSlop={16}
            onPress={() => Alert.alert('Coming soon', 'Favorites not yet implemented')}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
              <Path
                d="M11 18.5C11 18.5 2.75 13.2 2.75 7.15C2.75 4.95 4.58 3.3 6.88 3.3C8.43 3.3 9.9 4.13 11 5.5C12.1 4.13 13.57 3.3 15.12 3.3C17.42 3.3 19.25 4.95 19.25 7.15C19.25 13.2 11 18.5 11 18.5Z"
                stroke={colors.textSecondary}
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        </View>

        <Text style={[typography.body, styles.description, { color: colors.text }]}>
          {routine.description}
        </Text>

        <View
          style={[
            styles.divider,
            { backgroundColor: colors.border },
          ]}
        />
      </>
    ),
    [routine, colors, typography]
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <RoutineDetailHeader title={routine.name} onClose={handleClose} onMenu={handleMenu} />

      <FlatList
        data={exerciseItems}
        renderItem={renderExercise}
        keyExtractor={keyExtractor}
        ListHeaderComponent={listHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />

      <View style={[styles.bottomActions, { backgroundColor: colors.background, paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [
            styles.shareButton,
            {
              borderColor: colors.border,
              borderRadius: components.button.outline.borderRadius,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <Path
              d="M8 2V10M8 2L5 5M8 2L11 5M3 10V13H13V10"
              stroke={colors.textSecondary}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={[typography.bodyMedium, { color: colors.textSecondary }]}>
            Share Routine
          </Text>
        </Pressable>

        <Pressable
          onPress={handleStart}
          style={({ pressed }) => [
            styles.startButton,
            {
              backgroundColor: colors.primary,
              borderRadius: components.button.primary.borderRadius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={[typography.button, { color: colors.white }]}>Start</Text>
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
  screen: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    paddingTop: 16,
  },
  divider: {
    height: 1,
    marginTop: 20,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  bottomActions: {
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 12,
  },
  shareButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    gap: 8,
  },
  startButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
