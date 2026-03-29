import { memo, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme';
import { formatSeconds } from '@/lib/utils';
import { decorativePalette } from '@/theme/palette';
import { ExerciseImage } from '@/components/ui/exercise-image';

interface ExerciseRowProps {
  exerciseId: string;
  exerciseName: string;
  holdSeconds: number;
  colorIndex: number;
  iconFilename?: string;
  onPress: (exerciseId: string) => void;
  onDecrease: (exerciseId: string) => void;
  onIncrease: (exerciseId: string) => void;
}

export const ExerciseRow = memo(function ExerciseRow({
  exerciseId,
  exerciseName,
  holdSeconds,
  colorIndex,
  iconFilename,
  onPress,
  onDecrease,
  onIncrease,
}: ExerciseRowProps) {
  const { colors, typography } = useTheme();

  const handlePress = useCallback(() => onPress(exerciseId), [exerciseId, onPress]);
  const handleDecrease = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDecrease(exerciseId);
  }, [exerciseId, onDecrease]);
  const handleIncrease = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onIncrease(exerciseId);
  }, [exerciseId, onIncrease]);

  return (
    <View style={styles.row}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.rowLeft, { opacity: pressed ? 0.7 : 1 }]}
      >
        {iconFilename ? (
          <ExerciseImage iconFilename={iconFilename} size={44} round />
        ) : (
          <View
            style={[
              styles.circle,
              { backgroundColor: decorativePalette[colorIndex % decorativePalette.length] },
            ]}
          />
        )}
        <Text style={[typography.bodyMedium, styles.name, { color: colors.text }]} numberOfLines={2}>
          {exerciseName}
        </Text>
      </Pressable>

      <View style={styles.stepper}>
        <Pressable
          onPress={handleDecrease}
          hitSlop={12}
          style={({ pressed }) => [
            styles.stepperButton,
            { backgroundColor: colors.surface, opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <Text style={[typography.subheading, { color: colors.text }]}>−</Text>
        </Pressable>

        <Text style={[typography.label, styles.time, { color: colors.text }]}>
          {formatSeconds(holdSeconds)}
        </Text>

        <Pressable
          onPress={handleIncrease}
          hitSlop={12}
          style={({ pressed }) => [
            styles.stepperButton,
            { backgroundColor: colors.surface, opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <Text style={[typography.subheading, { color: colors.text }]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    opacity: 0.15,
  },
  name: {
    flex: 1,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    minWidth: 32,
    textAlign: 'center',
  },
});
