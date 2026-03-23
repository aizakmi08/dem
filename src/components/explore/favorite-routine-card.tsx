import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import { decorativePalette } from '@/theme/palette';
import type { Routine } from '@/content/types';

interface FavoriteRoutineCardProps {
  routine: Routine;
  onPress?: () => void;
}

export function FavoriteRoutineCard({ routine, onPress }: FavoriteRoutineCardProps) {
  const { colors, typography, radius } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderRadius: radius.xl,
        },
      ]}
    >
      <View style={styles.circleRow}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.circle,
              { backgroundColor: decorativePalette[i % decorativePalette.length] },
            ]}
          />
        ))}
      </View>
      <Text
        style={[typography.bodyMedium, { color: colors.text }]}
        numberOfLines={2}
      >
        {routine.name}
      </Text>
      <Text style={styles.meta}>
        <Text style={[typography.tabLabel, { color: colors.accent }]}>
          {routine.durationMinutes} MIN
        </Text>
        <Text style={[typography.tabLabel, { color: colors.textSecondary }]}>
          {' · '}
          {routine.difficulty.charAt(0).toUpperCase() + routine.difficulty.slice(1)}
        </Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    padding: 16,
    gap: 10,
  },
  circleRow: {
    flexDirection: 'row',
    gap: 6,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    opacity: 0.2,
  },
  meta: {
    flexDirection: 'row',
  },
});
