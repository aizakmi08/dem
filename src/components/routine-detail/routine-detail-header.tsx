import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path, Circle } from 'react-native-svg';
import { useTheme } from '@/theme';

interface RoutineDetailHeaderProps {
  title: string;
  onClose: () => void;
  onMenu: () => void;
}

export function RoutineDetailHeader({ title, onClose, onMenu }: RoutineDetailHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <Pressable
        onPress={onClose}
        hitSlop={16}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      >
        <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
          <Path
            d="M5 5L15 15M15 5L5 15"
            stroke={colors.text}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
      </Pressable>

      <Text style={[styles.title, typography.subheading, { color: colors.text }]} numberOfLines={1}>
        {title}
      </Text>

      <Pressable
        onPress={onMenu}
        hitSlop={16}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      >
        <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
          <Circle cx="10" cy="4" r="1.5" fill={colors.textSecondary} />
          <Circle cx="10" cy="10" r="1.5" fill={colors.textSecondary} />
          <Circle cx="10" cy="16" r="1.5" fill={colors.textSecondary} />
        </Svg>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
});
