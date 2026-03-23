import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/theme';

type PageDotsProps = {
  total: number;
  current: number;
};

export function PageDots({ total, current }: PageDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }, (_, i) => (
        <Dot key={i} active={i === current} />
      ))}
    </View>
  );
}

function Dot({ active }: { active: boolean }) {
  const { colors } = useTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(active ? 24 : 6, { duration: 250 }),
    backgroundColor: withTiming(active ? colors.accent : colors.border, { duration: 250 }),
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
