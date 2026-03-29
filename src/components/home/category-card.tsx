import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import type { Category } from '@/content/types';
import { CATEGORY_LABELS, getRoutineCountByCategory } from '@/content/categories';
import { ALL_ROUTINES } from '@/content/routine-data';
import { getExerciseById } from '@/content/exercises';
import { getRoutineIcon } from '@/content/illustrations';
import { ExerciseImage } from '@/components/ui/exercise-image';

// Pre-compute a representative icon per category (pick from the middle of the first routine)
const CATEGORY_ICONS: Partial<Record<Category, string>> = {};
for (const r of ALL_ROUTINES) {
  if (!CATEGORY_ICONS[r.category] && r.exercises.length > 0) {
    const icon = getRoutineIcon(r.exercises, getExerciseById, Math.floor(r.exercises.length / 2));
    if (icon) CATEGORY_ICONS[r.category] = icon;
  }
}

interface CategoryCardProps {
  category: Category;
  index: number;
  onPress?: () => void;
}

export function CategoryCard({ category, index, onPress }: CategoryCardProps) {
  const { colors, typography, radius } = useTheme();
  const label = CATEGORY_LABELS[category];
  const count = getRoutineCountByCategory(category);
  const icon = CATEGORY_ICONS[category];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.xl,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {icon ? (
        <ExerciseImage iconFilename={icon} size={36} round />
      ) : (
        <View style={[styles.fallbackDot, { backgroundColor: colors.border }]} />
      )}
      <Text style={[typography.bodyMedium, { color: colors.text }]} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[typography.tabLabel, { color: colors.textSecondary }]}>
        {count} {count === 1 ? 'routine' : 'routines'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    padding: 16,
    gap: 6,
  },
  fallbackDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    opacity: 0.25,
  },
});
