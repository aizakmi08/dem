import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme';

interface RoutineDetailHeaderProps {
  title: string;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function RoutineDetailHeader({ onClose, isFavorite, onToggleFavorite }: RoutineDetailHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const handleToggleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleFavorite();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <Pressable
        onPress={onClose}
        hitSlop={16}
        style={({ pressed }) => [
          styles.iconButton,
          { backgroundColor: colors.surface, opacity: pressed ? 0.6 : 1 },
        ]}
      >
        <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
          <Path
            d="M10 3L5 8L10 13"
            stroke={colors.text}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>

      <Pressable
        onPress={handleToggleFavorite}
        hitSlop={16}
        style={({ pressed }) => [
          styles.iconButton,
          { backgroundColor: colors.surface, opacity: pressed ? 0.6 : 1 },
        ]}
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path
            d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
            fill={isFavorite ? colors.accent : 'none'}
            stroke={isFavorite ? colors.accent : colors.textSecondary}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
