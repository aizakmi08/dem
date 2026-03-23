import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';

interface ExploreSectionHeaderProps {
  title: string;
  variant?: 'overline' | 'heading';
  actionLabel?: string;
  onAction?: () => void;
}

export function ExploreSectionHeader({
  title,
  variant = 'heading',
  actionLabel,
  onAction,
}: ExploreSectionHeaderProps) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={
          variant === 'overline'
            ? [typography.overline, { color: colors.textSecondary }]
            : [typography.subheading, { color: colors.text }]
        }
      >
        {variant === 'overline' ? title.toUpperCase() : title}
      </Text>
      {actionLabel && onAction && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={[typography.label, { color: colors.primary }]}>
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 28,
  },
});
