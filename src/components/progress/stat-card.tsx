import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';

interface StatCardProps {
  value: number | string;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  const { colors, typography, radius } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.xl }]}>
      <Text style={[styles.value, typography.heading, { color: colors.text }]}>
        {value}
      </Text>
      <Text style={[styles.label, typography.overline, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  value: {
    fontSize: 28,
  },
  label: {
    textTransform: 'uppercase',
  },
});
