import { View, Text, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useTheme } from '@/theme';

interface StreakBadgeProps {
  count: number;
}

export function StreakBadge({ count }: StreakBadgeProps) {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
        <Path
          d="M9 1.5C9 1.5 10.5 4.5 10.5 6.75C10.5 7.99264 9.82843 9 9 9C8.17157 9 7.5 7.99264 7.5 6.75L7.5 6.375C5.625 8.25 4.5 10.875 4.5 12.75C4.5 15.0972 6.52208 17 9 17C11.4779 17 13.5 15.0972 13.5 12.75C13.5 9.375 11.25 5.625 9 1.5Z"
          fill="#C4603B"
          stroke="#C4603B"
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <Text style={[typography.bodyMedium, { color: colors.text }]}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
  },
});
