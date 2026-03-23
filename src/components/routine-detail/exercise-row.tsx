import { memo, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import { decorativePalette } from '@/theme/palette';

interface ExerciseRowProps {
  exerciseId: string;
  exerciseName: string;
  holdSeconds: number;
  colorIndex: number;
  onDecrease: (exerciseId: string) => void;
  onIncrease: (exerciseId: string) => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const ExerciseRow = memo(function ExerciseRow({
  exerciseId,
  exerciseName,
  holdSeconds,
  colorIndex,
  onDecrease,
  onIncrease,
}: ExerciseRowProps) {
  const { colors, typography } = useTheme();

  const handleDecrease = useCallback(() => onDecrease(exerciseId), [exerciseId, onDecrease]);
  const handleIncrease = useCallback(() => onIncrease(exerciseId), [exerciseId, onIncrease]);

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.circle,
          { backgroundColor: decorativePalette[colorIndex % decorativePalette.length] },
        ]}
      />

      <Text style={[typography.bodyMedium, styles.name, { color: colors.text }]} numberOfLines={2}>
        {exerciseName}
      </Text>

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
          {formatTime(holdSeconds)}
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
