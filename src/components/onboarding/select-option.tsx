import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import type { ColorTokens } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type SelectOptionProps = {
  isSelected: boolean;
  onPress: () => void;
  height?: number;
  borderRadius?: number;
  colors: ColorTokens;
  children: React.ReactNode;
};

export function SelectOption({
  isSelected,
  onPress,
  height = 60,
  borderRadius = 16,
  colors,
  children,
}: SelectOptionProps) {
  const progress = useSharedValue(0);
  const accentWithAlpha = useMemo(() => colors.accent + '14', [colors.accent]);

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
  }, [isSelected, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.surface, accentWithAlpha]
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', colors.accent]
    ),
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[
        styles.option,
        { height, borderRadius },
        animatedStyle,
      ]}
    >
      {children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: 20,
  },
});
