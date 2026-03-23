import { memo } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import { formatSeconds } from '@/lib/utils';

interface TimerDisplayProps {
  seconds: number;
}

export const TimerDisplay = memo(function TimerDisplay({ seconds }: TimerDisplayProps) {
  const { colors, typography } = useTheme();

  return (
    <Text style={[styles.timer, typography.display, { color: colors.text }]}>
      {formatSeconds(seconds)}
    </Text>
  );
});

const styles = StyleSheet.create({
  timer: {
    paddingTop: 20,
  },
});
