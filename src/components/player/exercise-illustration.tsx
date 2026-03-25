import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import { decorativePalette } from '@/theme/palette';
import { ExerciseImage } from '@/components/ui/exercise-image';

interface ExerciseIllustrationProps {
  exerciseName: string;
  colorIndex: number;
  iconFilename?: string;
}

export const ExerciseIllustration = memo(function ExerciseIllustration({
  exerciseName,
  colorIndex,
  iconFilename,
}: ExerciseIllustrationProps) {
  const { typography } = useTheme();

  // 280 ring - 2×10 stroke - 2×6 padding = 248
  const FILL_SIZE = 248;

  if (iconFilename) {
    return <ExerciseImage iconFilename={iconFilename} size={FILL_SIZE} round />;
  }

  // Fallback: initials in a colored circle
  const bgColor = decorativePalette[colorIndex % decorativePalette.length];
  const initials = exerciseName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <View style={[styles.circle, { backgroundColor: bgColor }]}>
      <Text style={[typography.heading, styles.initials]}>{initials}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  circle: {
    width: 248,
    height: 248,
    borderRadius: 124,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#4A3728',
    opacity: 0.6,
  },
});
