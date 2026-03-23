import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useTheme } from '@/theme';
import { decorativePalette } from '@/theme/palette';
import type { Routine } from '@/content/types';

interface RoutineListRowProps {
  routine: Routine;
  index: number;
  onPress?: () => void;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function RoutineListRow({ routine, index, onPress }: RoutineListRowProps) {
  const { colors, typography, radius } = useTheme();
  const primaryCategory = routine.categories[0];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.row,
        {
          backgroundColor: colors.surface,
          borderRadius: radius.xl,
        },
      ]}
    >
      <View
        style={[
          styles.indicator,
          {
            backgroundColor: decorativePalette[index % decorativePalette.length],
            opacity: 0.15,
          },
        ]}
      />
      <View style={styles.content}>
        <Text style={[typography.bodyMedium, { color: colors.text }]} numberOfLines={1}>
          {routine.name}
        </Text>
        <Text>
          <Text style={[typography.tabLabel, { color: colors.accent }]}>
            {routine.durationMinutes} MIN
          </Text>
          <Text style={[typography.tabLabel, { color: colors.textSecondary }]}>
            {' · '}
            {capitalize(routine.difficulty)}
            {primaryCategory ? ` · ${capitalize(primaryCategory)}` : ''}
          </Text>
        </Text>
      </View>
      <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
        <Path
          d="M6 4L10 8L6 12"
          stroke={colors.textSecondary}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  indicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  content: {
    flex: 1,
    gap: 4,
  },
});
