import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import type { Routine } from '@/content/types';
import { CATEGORY_LABELS } from '@/content/categories';
import { getExerciseById } from '@/content/exercises';
import { getRoutineIcon } from '@/content/illustrations';
import { ExerciseImage } from '@/components/ui/exercise-image';
import { capitalize } from '@/lib/utils';

interface DailyRoutineCardProps {
  routine: Routine;
  index: number;
  onPress?: () => void;
}

export function DailyRoutineCard({ routine, index, onPress }: DailyRoutineCardProps) {
  const { colors, typography, radius } = useTheme();
  const catLabel = CATEGORY_LABELS[routine.category] ?? capitalize(routine.category);
  const iconFilename = getRoutineIcon(routine.exercises, getExerciseById, index);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius['2xl'], opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.textCol}>
          <Text style={[typography.tabLabel, { color: colors.accent }]}>
            {routine.durationMinutes} MIN · {catLabel}
          </Text>
          <Text style={[typography.bodyMedium, { color: colors.text }]} numberOfLines={1}>
            {routine.name}
          </Text>
          <Text style={[typography.tabLabel, { color: colors.textSecondary }]}>
            {routine.exercises.length} exercises · {capitalize(routine.difficulty)}
          </Text>
        </View>
        {iconFilename && <ExerciseImage iconFilename={iconFilename} size={52} round />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    padding: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textCol: {
    flex: 1,
    gap: 4,
  },
});
