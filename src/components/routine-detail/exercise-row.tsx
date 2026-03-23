import { memo, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import { formatSeconds } from '@/lib/utils';
import { decorativePalette } from '@/theme/palette';

interface ExerciseRowProps {
  exerciseId: string;
  exerciseName: string;
  holdSeconds: number;
  colorIndex: number;
  onPress: (exerciseId: string) => void;
  onDecrease: (exerciseId: string) => void;
  onIncrease: (exerciseId: string) => void;
}

export const ExerciseRow = memo(function ExerciseRow({
  exerciseId,
  exerciseName,
  holdSeconds,
  colorIndex,
  onPress,
  onDecrease,
  onIncrease,
}: ExerciseRowProps) {
  const { colors, typography } = useTheme();

  const handlePress = useCallback(() => onPress(exerciseId), [exerciseId, onPress]);
  const handleDecrease = useCallback(() => onDecrease(exerciseId), [exerciseId, onDecrease]);
  const handleIncrease = useCallback(() => onIncrease(exerciseId), [exerciseId, onIncrease]);

  return (
    <View style={styles.row}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.rowLeft, { opacity: pressed ? 0.7 : 1 }]}
      >
        <View
          style={[
            styles.circle,
            { backgroundColor: decorativePalette[colorIndex % decorativePalette.length] },
          ]}
        />
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
