import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useTheme, decorativePalette } from '@/theme';
import type { Routine } from '@/content/types';

interface DailyRoutineCardProps {
  routine: Routine;
  onPress?: () => void;
}

export function DailyRoutineCard({ routine, onPress }: DailyRoutineCardProps) {
  const { colors, typography } = useTheme();
  const previewExercises = routine.exercises.slice(0, 6);

  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.textSection}>
          <Text style={[typography.overline, { color: colors.accent }]}>
            {routine.durationMinutes} Minutes
          </Text>
          <Text style={[typography.heading, { color: colors.text }]}>
            {routine.name}
          </Text>
        </View>
        <View style={styles.exerciseRow}>
          {previewExercises.map((exercise, index) => (
            <View
              key={exercise.exerciseId}
              style={[
                styles.exerciseCircle,
                {
                  backgroundColor:
                    decorativePalette[index % decorativePalette.length],
                },
              ]}
            />
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    gap: 16,
  },
  textSection: {
    gap: 4,
  },
  exerciseRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  exerciseCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
});
