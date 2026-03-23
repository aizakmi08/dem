import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import { decorativePalette } from '@/theme/palette';

interface ExerciseIllustrationProps {
  exerciseName: string;
  colorIndex: number;
}

export const ExerciseIllustration = memo(function ExerciseIllustration({
  exerciseName,
  colorIndex,
}: ExerciseIllustrationProps) {
  const { typography } = useTheme();
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
    width: 240,
    height: 240,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#4A3728',
    opacity: 0.6,
  },
});
