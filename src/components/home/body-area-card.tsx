import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useTheme, decorativePalette } from '@/theme';
import type { BodyArea } from '@/content/types';

const [peach, sage, stone] = decorativePalette;

const AREA_COLORS: Record<string, string> = {
  hips: peach,
  'lower-back': sage,
  neck: stone,
  shoulders: peach,
  'full-body': sage,
  chest: stone,
};

const AREA_LABELS: Record<string, string> = {
  hips: 'Hips',
  'lower-back': 'Lower Back',
  neck: 'Neck',
  shoulders: 'Shoulders',
  'full-body': 'Full Body',
  chest: 'Chest',
};

interface BodyAreaCardProps {
  area: BodyArea;
  onPress?: () => void;
}

export function BodyAreaCard({ area, onPress }: BodyAreaCardProps) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <View
        style={[
          styles.circle,
          { backgroundColor: AREA_COLORS[area] ?? colors.border },
        ]}
      />
      <Text style={[typography.label, { color: colors.text }]}>
        {AREA_LABELS[area] ?? area}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 104,
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
});
