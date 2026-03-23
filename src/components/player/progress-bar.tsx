import { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar = memo(function ProgressBar({ current, total }: ProgressBarProps) {
  const { colors, radius } = useTheme();
  const widthPercent = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <View style={[styles.track, { backgroundColor: colors.border }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${widthPercent}%`,
            backgroundColor: colors.accent,
            borderTopRightRadius: radius.full,
            borderBottomRightRadius: radius.full,
          },
        ]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: 3,
    marginTop: 16,
  },
  fill: {
    height: 3,
  },
});
